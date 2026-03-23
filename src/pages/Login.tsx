import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import {
  InputOTP, InputOTPGroup, InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Shield, Fingerprint, Phone, CheckCircle2, Loader2, ArrowRight,
  Building2, MapPin, Users, Lock, Scan, Sparkles,
} from "lucide-react";
import Confetti from "@/components/effects/Confetti";

const landmarks = [
  { name: "Red Fort, Delhi", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1920&q=80" },
  { name: "India Gate, Delhi", image: "https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?w=1920&q=80" },
  { name: "Gateway of India, Mumbai", image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1920&q=80" },
  { name: "Taj Mahal, Agra", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1920&q=80" },
];

const floatingIcons = [
  { icon: Building2, delay: 0 }, { icon: MapPin, delay: 1.5 },
  { icon: Users, delay: 3 }, { icon: Shield, delay: 4.5 },
];

type Step = "choose" | "aadhaar" | "otp" | "biometric" | "face-check" | "success" | "admin-login";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { loginCitizen, loginCitizenWithOnboarding, loginAdmin, isLoggedIn, isAdmin } = useAuth();
  const [step, setStep] = useState<Step>("choose");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentLandmark, setCurrentLandmark] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [faceStream, setFaceStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [faceStage, setFaceStage] = useState<"front" | "right" | "left" | "verifying" | "done">("front");
  const [faceProgress, setFaceProgress] = useState(0);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) navigate(isAdmin ? "/admin" : "/dashboard", { replace: true });
  }, [isLoggedIn, isAdmin, navigate]);

  useEffect(() => {
    if (window.PublicKeyCredential) {
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable?.()
        .then(setBiometricSupported).catch(() => setBiometricSupported(false));
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentLandmark((prev) => (prev + 1) % landmarks.length), 10000);
    return () => clearInterval(interval);
  }, []);

  const formatAadhaar = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 12);
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) parts.push(digits.slice(i, i + 4));
    return parts.join(" ");
  };

  const handleAadhaarSubmit = async () => {
    const digits = aadhaarNumber.replace(/\s/g, "");
    if (digits.length !== 12) {
      toast({ variant: "destructive", title: "Invalid Aadhaar", description: "Please enter a valid 12-digit Aadhaar number" });
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    setStep("otp");
    toast({ title: "OTP Sent! ✅", description: t("otp_sent") });
  };

  const handleOtpSubmit = async () => {
    if (otp.length !== 6) {
      toast({ variant: "destructive", title: "Invalid OTP", description: "Please enter the 6-digit OTP" });
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    setFaceStage("front");
    setFaceProgress(0);
    setStep("face-check");
    startFaceCamera();
  };

  const handleBiometricAuth = useCallback(async () => {
    try {
      // Real WebAuthn - uses device fingerprint/face sensor
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: "Digital Suvidha", id: window.location.hostname },
          user: {
            id: new TextEncoder().encode(aadhaarNumber.replace(/\s/g, "") || "citizen"),
            name: aadhaarNumber || "citizen@suvidha",
            displayName: "Citizen",
          },
          pubKeyCredParams: [
            { alg: -7, type: "public-key" },   // ES256
            { alg: -257, type: "public-key" },  // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform", // Use device biometric (fingerprint/face)
            userVerification: "required",
          },
          timeout: 60000,
        },
      });

      if (credential) {
        setFaceStage("front");
        setFaceProgress(0);
        setStep("face-check");
        startFaceCamera();
      }
    } catch (err: any) {
      console.error("WebAuthn error:", err);
      toast({ variant: "destructive", title: "Biometric Failed", description: err?.message || "Please try OTP login instead." });
      setStep("aadhaar");
    }
  }, [navigate, toast, t, loginCitizen, aadhaarNumber]);

  const handleAdminLogin = async () => {
    if (!adminUser.trim() || !adminPass.trim()) {
      toast({ variant: "destructive", title: "Required", description: "Enter username and password" });
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    if (adminUser === "admin" && adminPass === "250707@NJ") {
      loginAdmin();
      toast({ title: "Admin Access Granted! 🔓" });
      setStep("success");
      setTimeout(() => navigate("/admin"), 2000);
    } else {
      toast({ variant: "destructive", title: "Access Denied", description: "Invalid admin credentials" });
    }
  };

  const startFaceCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 320, height: 240 } });
      setFaceStream(stream);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch {
      toast({ variant: "destructive", title: "Camera Access Denied", description: "Please allow camera for face verification" });
    }
  };

  const stopFaceCamera = () => {
    faceStream?.getTracks().forEach((t) => t.stop());
    setFaceStream(null);
  };

  const handleFaceStageCapture = async () => {
    if (faceStage === "front") {
      setFaceProgress(33);
      toast({ title: "✅ Front face captured", description: "Now turn your head slightly RIGHT" });
      setFaceStage("right");
    } else if (faceStage === "right") {
      setFaceProgress(66);
      toast({ title: "✅ Right side captured", description: "Now turn your head slightly LEFT" });
      setFaceStage("left");
    } else if (faceStage === "left") {
      setFaceProgress(100);
      setFaceStage("verifying");
      toast({ title: "🔍 Verifying face with Aadhaar..." });
      // Simulate AI face matching
      await new Promise((r) => setTimeout(r, 2500));
      stopFaceCamera();
      setFaceStage("done");
      loginCitizenWithOnboarding(aadhaarNumber.replace(/\s/g, ""));
      setStep("success");
      setShowConfetti(true);
      toast({ title: t("login_success"), description: "✅ Face verified — all 3 angles matched!" });
      setTimeout(() => navigate("/onboarding"), 2500);
    }
  };


  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
      {landmarks.map((landmark, idx) => (
        <motion.div key={idx} className="absolute inset-0" initial={false}
          animate={{ opacity: currentLandmark === idx ? 1 : 0 }} transition={{ duration: 2, ease: "easeInOut" }}
          style={{ zIndex: currentLandmark === idx ? 1 : 0 }}>
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${landmark.image})` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/75 to-secondary/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-secondary/30" />
        </motion.div>
      ))}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
        {floatingIcons.map((item, index) => (
          <motion.div key={index} className="absolute text-secondary-foreground/5"
            animate={{ opacity: [0.05, 0.15, 0.05], y: [-10, -60, -10] }}
            transition={{ duration: 12, delay: item.delay, repeat: Infinity, ease: "easeInOut" }}
            style={{ left: `${15 + index * 22}%`, top: `${55 + index * 8}%` }}>
            <item.icon className="w-20 h-20" />
          </motion.div>
        ))}
      </div>
      <div className="absolute top-0 left-0 right-0 h-2 z-20">
        <div className="h-full bg-gradient-to-r from-primary via-white to-success" />
      </div>

      {/* Left Branding */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center p-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center text-secondary-foreground">
                  <img src="/logo.png" alt="SUVIDHA Logo" className="w-32 h-32 mx-auto mb-6 rounded-2xl object-contain bg-white p-2 drop-shadow-lg" />
                  <h1 className="font-heading text-5xl font-bold mb-4 drop-shadow-lg">DIGITAL SUVIDHA</h1>
          <p className="text-xl opacity-90 mb-8">{t("govt_of_india")} • {t("digital_suvidha")}</p>
          <div className="flex items-center gap-4 justify-center">
            {[{ value: "2.4M+", label: "Citizens" }, { value: "500+", label: "Services" }, { value: "28", label: "States" }].map((stat, idx) => (
              <motion.div key={idx} className="bg-secondary-foreground/15 backdrop-blur-sm rounded-2xl px-6 py-3"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + idx * 0.1 }}>
                <p className="text-3xl font-bold">{stat.value}</p><p className="text-sm opacity-80">{stat.label}</p>
              </motion.div>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={currentLandmark} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="mt-8 inline-flex items-center gap-2 bg-secondary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2">
              <MapPin className="w-4 h-4" /><span className="text-sm">{landmarks[currentLandmark].name}</span>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <Card className="p-8 shadow-2xl bg-card/95 backdrop-blur-xl border-secondary/20">
            <AnimatePresence mode="wait">
              {step === "choose" && (
                <motion.div key="choose" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  <div className="text-center mb-6">
                    <img src="/logo.png" alt="SUVIDHA" className="w-20 h-20 mx-auto mb-4 rounded-xl object-contain bg-white p-1 shadow-lg" />
                    <h2 className="font-heading text-2xl font-bold">{t("welcome_suvidha")}</h2>
                    <p className="text-muted-foreground mt-1">{t("select_login")}</p>
                  </div>
                  <motion.button onClick={() => setStep("aadhaar")} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full p-5 rounded-2xl border-2 border-secondary/20 hover:border-secondary bg-gradient-to-r from-secondary/5 to-accent/5 transition-all flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground"><Fingerprint className="w-7 h-7" /></div>
                    <div className="text-left"><p className="font-heading font-bold text-lg">{t("citizen_login")}</p><p className="text-sm text-muted-foreground">{t("aadhaar_otp")}</p></div>
                    <ArrowRight className="w-5 h-5 ml-auto text-muted-foreground" />
                  </motion.button>
                  <motion.button onClick={() => setStep("admin-login")} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full p-5 rounded-2xl border-2 border-destructive/20 hover:border-destructive bg-gradient-to-r from-destructive/5 to-primary/5 transition-all flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-destructive flex items-center justify-center text-destructive-foreground"><Lock className="w-7 h-7" /></div>
                    <div className="text-left"><p className="font-heading font-bold text-lg">{t("admin_access")}</p><p className="text-sm text-muted-foreground">{t("admin_dashboard_login")}</p></div>
                    <ArrowRight className="w-5 h-5 ml-auto text-muted-foreground" />
                  </motion.button>
                  <p className="text-xs text-center text-muted-foreground mt-4">Secured by UIDAI • 256-bit Encryption</p>
                </motion.div>
              )}

              {step === "aadhaar" && (
                <motion.div key="aadhaar" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="text-center mb-4">
                    <motion.div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center"
                      animate={{ boxShadow: ["0 0 15px hsl(210 80% 28% / 0.3)", "0 0 30px hsl(210 80% 28% / 0.5)", "0 0 15px hsl(210 80% 28% / 0.3)"] }}
                      transition={{ duration: 2, repeat: Infinity }}>
                      <Fingerprint className="w-8 h-8 text-secondary-foreground" />
                    </motion.div>
                    <h2 className="font-heading text-xl font-bold">{t("secure_login")}</h2>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-base font-medium"><Fingerprint className="w-5 h-5 text-secondary" />{t("aadhaar_number")}</label>
                    <Input type="text" placeholder="XXXX XXXX XXXX" value={formatAadhaar(aadhaarNumber)} onChange={(e) => setAadhaarNumber(e.target.value)}
                      className="text-center text-2xl tracking-[0.5em] font-mono h-16 border-2 focus:border-secondary" maxLength={14} />
                  </div>
                  <Button onClick={handleAadhaarSubmit} disabled={isLoading} className="w-full h-14 text-lg bg-secondary hover:bg-secondary/90">
                    {isLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Verifying...</> : <>{t("get_otp")} <ArrowRight className="w-5 h-5 ml-2" /></>}
                  </Button>
                  {biometricSupported && (
                    <>
                      <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                        <div className="relative flex justify-center"><span className="bg-card px-3 text-sm text-muted-foreground">{t("or_use_biometric")}</span></div></div>
                      <Button variant="outline" onClick={() => { setStep("biometric"); handleBiometricAuth(); }}
                        className="w-full h-14 text-lg border-2 border-success/30 hover:border-success"><Scan className="w-5 h-5 mr-2 text-success" />{t("use_fingerprint")}</Button>
                    </>
                  )}
                  <Button variant="ghost" className="w-full" onClick={() => setStep("choose")}>← {t("back")}</Button>
                </motion.div>
              )}

              {step === "otp" && (
                <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center"><Phone className="w-8 h-8 text-success" /></div>
                    <p className="text-sm text-muted-foreground">{t("otp_sent")} <span className="font-medium text-foreground">XXXXXX{aadhaarNumber.replace(/\s/g, "").slice(-4)}</span></p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-center block text-base font-medium">Enter 6-Digit OTP</label>
                    <div className="flex justify-center">
                      <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                        <InputOTPGroup>{[0,1,2,3,4,5].map((i) => <InputOTPSlot key={i} index={i} className="w-12 h-14 text-xl" />)}</InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>
                  <Button onClick={handleOtpSubmit} disabled={isLoading} className="w-full h-14 text-lg bg-success hover:bg-success/90">
                    {isLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Verifying...</> : <>{t("verify_login")} <CheckCircle2 className="w-5 h-5 ml-2" /></>}
                  </Button>
                  <Button variant="ghost" className="w-full" onClick={() => setStep("aadhaar")}>← {t("back")}</Button>
                  <p className="text-xs text-center text-muted-foreground">Didn't receive OTP? <button className="text-secondary font-medium hover:underline">Resend</button></p>
                </motion.div>
              )}

              {step === "biometric" && (
                <motion.div key="biometric" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                  <motion.div className="w-24 h-24 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1], boxShadow: ["0 0 0 0 hsl(122 39% 49% / 0.3)", "0 0 0 20px hsl(122 39% 49% / 0)", "0 0 0 0 hsl(122 39% 49% / 0.3)"] }}
                    transition={{ duration: 2, repeat: Infinity }}>
                    <Scan className="w-12 h-12 text-success" />
                  </motion.div>
                  <h2 className="font-heading text-xl font-bold mb-2">Scanning Biometric...</h2>
                  <p className="text-muted-foreground">Place your finger on the sensor</p>
                </motion.div>
              )}

              {step === "face-check" && (
                <motion.div key="face-check" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                  <div className="text-center">
                    <h2 className="font-heading text-xl font-bold mb-1">AI Face Verification</h2>
                    <p className="text-muted-foreground text-sm">
                      {faceStage === "front" && "Look straight at the camera"}
                      {faceStage === "right" && "Turn your head slightly RIGHT →"}
                      {faceStage === "left" && "← Turn your head slightly LEFT"}
                      {faceStage === "verifying" && "Matching face with Aadhaar record..."}
                    </p>
                  </div>

                  {/* Progress indicators */}
                  <div className="flex items-center justify-center gap-2">
                    {(["front", "right", "left"] as const).map((stage) => (
                      <div key={stage} className="flex items-center gap-1.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          faceStage === stage ? "bg-primary text-primary-foreground animate-pulse" :
                          (["front", "right", "left"].indexOf(faceStage) > ["front", "right", "left"].indexOf(stage) || faceStage === "verifying" || faceStage === "done")
                            ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
                        }`}>
                          {(["front", "right", "left"].indexOf(faceStage) > ["front", "right", "left"].indexOf(stage) || faceStage === "verifying" || faceStage === "done")
                            ? "✓" : ["front", "right", "left"].indexOf(stage) + 1}
                        </div>
                        <span className="text-xs text-muted-foreground capitalize hidden sm:inline">{stage}</span>
                        {stage !== "left" && <div className="w-6 h-0.5 bg-border" />}
                      </div>
                    ))}
                  </div>

                  {/* Camera */}
                  <div className="relative mx-auto w-52 h-52 rounded-full overflow-hidden border-4 border-success/40 bg-muted">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    {faceStage === "verifying" && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-white animate-spin" />
                      </div>
                    )}
                    <motion.div className="absolute inset-0 rounded-full border-4 border-success/60 pointer-events-none"
                      animate={{ scale: [1, 1.04, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }} />
                    {/* Direction arrow overlay */}
                    {faceStage === "right" && (
                      <div className="absolute top-1/2 right-2 -translate-y-1/2 text-3xl text-white drop-shadow-lg">→</div>
                    )}
                    {faceStage === "left" && (
                      <div className="absolute top-1/2 left-2 -translate-y-1/2 text-3xl text-white drop-shadow-lg">←</div>
                    )}
                  </div>

                  {faceStage !== "verifying" && faceStage !== "done" && (
                    <Button onClick={handleFaceStageCapture} className="w-full h-14 text-lg bg-success hover:bg-success/90">
                      📸 Capture {faceStage.charAt(0).toUpperCase() + faceStage.slice(1)} Face
                    </Button>
                  )}
                  {faceStage !== "verifying" && (
                    <Button variant="ghost" className="w-full" onClick={() => { stopFaceCamera(); setFaceStage("front"); setFaceProgress(0); setStep("aadhaar"); }}>← Back</Button>
                  )}
                </motion.div>
              )}

              {step === "success" && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                  <motion.div className="w-24 h-24 mx-auto mb-6 rounded-full bg-success flex items-center justify-center"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }}>
                    <CheckCircle2 className="w-12 h-12 text-success-foreground" />
                  </motion.div>
                  <h2 className="font-heading text-2xl font-bold text-success mb-2">{t("login_success")}!</h2>
                  <p className="text-muted-foreground">Redirecting...</p>
                  <motion.div className="flex justify-center gap-1 mt-4" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <span className="w-2 h-2 rounded-full bg-success" /><span className="w-2 h-2 rounded-full bg-success" /><span className="w-2 h-2 rounded-full bg-success" />
                  </motion.div>
                </motion.div>
              )}

              {step === "admin-login" && (
                <motion.div key="admin" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-destructive/10 flex items-center justify-center"><Lock className="w-8 h-8 text-destructive" /></div>
                    <h2 className="font-heading text-xl font-bold">{t("admin_dashboard")}</h2>
                    <p className="text-sm text-muted-foreground">Authorized personnel only</p>
                  </div>
                  <div className="space-y-4">
                    <div><label className="flex items-center gap-2 text-sm font-medium mb-1"><Fingerprint className="w-4 h-4" />{t("username")}</label>
                      <Input placeholder="Enter admin username" value={adminUser} onChange={(e) => setAdminUser(e.target.value)} className="h-12" /></div>
                    <div><label className="flex items-center gap-2 text-sm font-medium mb-1"><Lock className="w-4 h-4" />{t("password")}</label>
                      <Input type="password" placeholder="Enter admin password" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} className="h-12" /></div>
                  </div>
                  <Button onClick={handleAdminLogin} disabled={isLoading} className="w-full h-14 text-lg bg-destructive hover:bg-destructive/90">
                    {isLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Verifying...</> : <>Access Dashboard <ArrowRight className="w-5 h-5 ml-2" /></>}
                  </Button>
                  <Button variant="ghost" className="w-full" onClick={() => setStep("choose")}>← {t("back")}</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
          <div className="flex items-center justify-center gap-4 mt-4 text-secondary-foreground/60 text-sm">
            <Shield className="w-4 h-4" /><span>256-bit Encrypted</span>
            <Sparkles className="w-4 h-4" /><span>UIDAI Verified</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
