import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Shield,
  Fingerprint,
  Phone,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Building2,
  MapPin,
  Users,
  Sparkles,
  KeyRound,
  Lock,
  ChevronRight,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useLanguage } from "@/hooks/useLanguage";
import Confetti from "@/components/effects/Confetti";

const landmarks = [
  {
    name: "Red Fort, Delhi",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1920&q=80",
  },
  {
    name: "India Gate, Delhi",
    image: "https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?w=1920&q=80",
  },
  {
    name: "Parliament House, Delhi",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1920&q=80",
  },
  {
    name: "Gateway of India, Mumbai",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1920&q=80",
  },
  {
    name: "Taj Mahal, Agra",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1920&q=80",
  },
  {
    name: "Vidhan Soudha, Bangalore",
    image: "https://images.unsplash.com/photo-1600689320014-7a6ecbc25063?w=1920&q=80",
  },
];

const floatingIcons = [
  { icon: Building2, delay: 0 },
  { icon: MapPin, delay: 1.5 },
  { icon: Users, delay: 3 },
  { icon: Shield, delay: 4.5 },
];

type LoginMode = "citizen" | "admin";
type Step = "choose" | "aadhaar" | "otp" | "details" | "success" | "admin-login";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useUser();
  const { t } = useLanguage();

  const [loginMode, setLoginMode] = useState<LoginMode>("citizen");
  const [step, setStep] = useState<Step>("choose");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentLandmark, setCurrentLandmark] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // New User Details State
  const [userDetails, setUserDetails] = useState({ name: "", phone: "" });

  // Smooth landmark rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLandmark((prev) => (prev + 1) % landmarks.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatAadhaar = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 12);
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.slice(i, i + 4));
    }
    return parts.join(" ");
  };

  const handleAadhaarSubmit = async () => {
    const digits = aadhaarNumber.replace(/\s/g, "");
    if (digits.length !== 12) {
      toast({
        variant: "destructive",
        title: "Invalid Aadhaar",
        description: "Please enter a valid 12-digit Aadhaar number",
      });
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep("otp");
    toast({
      title: t("otp_sent"),
      description: "A 6-digit OTP has been sent to your registered mobile number",
    });
  };

  const handleOtpSubmit = async () => {
    if (otp.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please enter the 6-digit OTP",
      });
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);

    // Proceed to details step for citizens
    if (loginMode === "citizen") {
      setStep("details");
    } else {
      setStep("success");
      setShowConfetti(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2500);
    }
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDetails.name || !userDetails.phone) {
      toast({
        variant: "destructive",
        title: "Missing Details",
        description: "Please enter both Name and Phone Number",
      });
      return;
    }

    login({
      name: userDetails.name,
      phoneNumber: userDetails.phone,
      aadhaar: aadhaarNumber
    });

    setStep("success");
    setShowConfetti(true);
    setTimeout(() => {
      navigate("/dashboard");
    }, 2500);
  };

  const handleAdminLogin = async () => {
    if (!adminUser.trim() || !adminPass.trim()) {
      toast({ variant: "destructive", title: "Required", description: "Enter username and password" });
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);

    if (adminUser === "admin" && adminPass === "250707@NJ") {
      toast({ title: t("login_success"), description: "Redirecting to Admin Dashboard..." });
      setStep("success");
      login({
        name: "Administrator",
        phoneNumber: "N/A",
        aadhaar: "N/A"
      });
      setTimeout(() => navigate("/admin"), 2000);
    } else {
      toast({ variant: "destructive", title: "Access Denied", description: "Invalid admin credentials" });
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Background - Smooth crossfade */}
      {landmarks.map((landmark, idx) => (
        <motion.div
          key={idx}
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: currentLandmark === idx ? 1 : 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{ zIndex: currentLandmark === idx ? 1 : 0 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${landmark.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/75 to-secondary/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-secondary/30" />
        </motion.div>
      ))}

      {/* Floating Icons - Subtle & smooth */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            className="absolute text-secondary-foreground/5"
            animate={{
              opacity: [0.05, 0.15, 0.05],
              y: [-10, -60, -10],
              x: [0, 15, 0],
            }}
            transition={{
              duration: 12,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${15 + index * 22}%`,
              top: `${55 + index * 8}%`,
            }}
          >
            <item.icon className="w-20 h-20" />
          </motion.div>
        ))}
      </div>

      {/* Tricolor Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-2 z-20">
        <div className="h-full bg-gradient-to-r from-primary via-white to-success" />
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-secondary-foreground"
        >
          <motion.div
            className="text-8xl mb-6"
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            🇮🇳
          </motion.div>
          <h1 className="font-heading text-5xl font-bold mb-4 drop-shadow-lg">
            {t("app_title")}
          </h1>
          <p className="text-xl opacity-90 mb-8">
            {t("govt_of_india")} • {t("digital_suvidha")}
          </p>

          <div className="flex items-center gap-4 justify-center">
            {[
              { value: "2.4M+", label: "Citizens Served" },
              { value: "500+", label: t("govt_services") },
              { value: "28", label: "States" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className="bg-secondary-foreground/15 backdrop-blur-sm rounded-2xl px-6 py-3"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
              >
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm opacity-80">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Current Landmark - Smooth */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentLandmark}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="mt-8 inline-flex items-center gap-2 bg-secondary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2"
            >
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{landmarks[currentLandmark].name}</span>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 shadow-2xl bg-card/95 backdrop-blur-xl border-secondary/20">
            <AnimatePresence mode="wait">
              {/* Choose Mode */}
              {step === "choose" && (
                <motion.div
                  key="choose"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <motion.div
                      className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center"
                      animate={{
                        boxShadow: [
                          "0 0 20px hsl(210 80% 28% / 0.2)",
                          "0 0 40px hsl(210 80% 28% / 0.4)",
                          "0 0 20px hsl(210 80% 28% / 0.2)",
                        ],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Shield className="w-10 h-10 text-secondary-foreground" />
                    </motion.div>
                    <h2 className="font-heading text-2xl font-bold text-foreground">{t("app_title")}</h2>
                    <p className="text-muted-foreground mt-1">Select your login method</p>
                  </div>

                  <motion.button
                    onClick={() => { setLoginMode("citizen"); setStep("aadhaar"); }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-5 rounded-2xl border-2 border-secondary/20 hover:border-secondary bg-gradient-to-r from-secondary/5 to-accent/5 transition-all flex items-center gap-4"
                  >
                    <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground">
                      <Fingerprint className="w-7 h-7" />
                    </div>
                    <div className="text-left">
                      <p className="font-heading font-bold text-lg">{t("login")}</p>
                      <p className="text-sm text-muted-foreground">{t("secure_login")}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 ml-auto text-muted-foreground" />
                  </motion.button>

                  <motion.button
                    onClick={() => { setLoginMode("admin"); setStep("admin-login"); }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-5 rounded-2xl border-2 border-destructive/20 hover:border-destructive bg-gradient-to-r from-destructive/5 to-primary/5 transition-all flex items-center gap-4"
                  >
                    <div className="w-14 h-14 rounded-full bg-destructive flex items-center justify-center text-destructive-foreground">
                      <Lock className="w-7 h-7" />
                    </div>
                    <div className="text-left">
                      <p className="font-heading font-bold text-lg">{t("admin_login")}</p>
                      <p className="text-sm text-muted-foreground">Administrative Dashboard Login</p>
                    </div>
                    <ArrowRight className="w-5 h-5 ml-auto text-muted-foreground" />
                  </motion.button>

                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Secured by UIDAI • 256-bit Encryption
                  </p>
                </motion.div>
              )}

              {/* Aadhaar Input */}
              {step === "aadhaar" && (
                <motion.div
                  key="aadhaar"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-4">
                    <motion.div
                      className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center"
                      animate={{ boxShadow: ["0 0 15px hsl(210 80% 28% / 0.3)", "0 0 30px hsl(210 80% 28% / 0.5)", "0 0 15px hsl(210 80% 28% / 0.3)"] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Fingerprint className="w-8 h-8 text-secondary-foreground" />
                    </motion.div>
                    <h2 className="font-heading text-xl font-bold">{t("secure_login")}</h2>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-base">
                      <Fingerprint className="w-5 h-5 text-secondary" />
                      {t("aadhaar_number")}
                    </Label>
                    <Input
                      type="text"
                      placeholder="XXXX XXXX XXXX"
                      value={formatAadhaar(aadhaarNumber)}
                      onChange={(e) => setAadhaarNumber(e.target.value)}
                      className="text-center text-2xl tracking-[0.5em] font-mono h-16 border-2 focus:border-secondary"
                      maxLength={14}
                    />
                  </div>

                  <Button onClick={handleAadhaarSubmit} disabled={isLoading} className="w-full h-14 text-lg bg-secondary hover:bg-secondary/90">
                    {isLoading ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" />Verifying...</>) : (<>{t("get_otp")} <ArrowRight className="w-5 h-5 ml-2" /></>)}
                  </Button>

                  <Button variant="ghost" className="w-full" onClick={() => setStep("choose")}>← {t("back")}</Button>
                </motion.div>
              )}

              {/* OTP Input */}
              {step === "otp" && (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center">
                      <Phone className="w-8 h-8 text-success" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      OTP sent to <span className="font-medium text-foreground">XXXXXX7890</span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-center block text-base">Enter 6-Digit OTP</Label>
                    <div className="flex justify-center">
                      <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                        <InputOTPGroup>
                          {[0, 1, 2, 3, 4, 5].map((i) => (
                            <InputOTPSlot key={i} index={i} className="w-12 h-14 text-xl" />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>

                  <Button onClick={handleOtpSubmit} disabled={isLoading} className="w-full h-14 text-lg bg-success hover:bg-success/90">
                    {isLoading ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" />Verifying...</>) : (<>{t("verify_login")} <CheckCircle2 className="w-5 h-5 ml-2" /></>)}
                  </Button>

                  <Button variant="ghost" className="w-full" onClick={() => setStep("aadhaar")}>← {t("back")}</Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Didn't receive OTP? <button className="text-secondary hover:underline">Resend</button>
                  </p>
                </motion.div>
              )}

              {/* Details Input */}
              {step === "details" && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-2">
                    <h2 className="font-heading text-2xl font-bold">One Last Step!</h2>
                    <p className="text-muted-foreground">Please tell us a bit about yourself</p>
                  </div>

                  <form onSubmit={handleDetailsSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Full Name</Label>
                      <Input
                        value={userDetails.name}
                        onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                        placeholder="e.g. Rajesh Kumar"
                        className="h-12 text-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Phone Number</Label>
                      <Input
                        value={userDetails.phone}
                        onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
                        placeholder="e.g. 9876543210"
                        maxLength={10}
                        className="h-12 text-lg tracking-widest"
                      />
                    </div>

                    <Button type="submit" className="w-full h-12 text-lg">
                      {t("verify_login")} <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                  </form>
                </motion.div>
              )}

              {/* Admin Login */}
              {step === "admin-login" && (
                <motion.div
                  key="admin-login"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-destructive/20 flex items-center justify-center">
                      <Lock className="w-8 h-8 text-destructive" />
                    </div>
                    <h2 className="font-heading text-xl font-bold">{t("admin_dashboard")}</h2>
                    <p className="text-sm text-muted-foreground">Authorized personnel only</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-secondary" />
                        {t("username")}
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter admin username"
                        value={adminUser}
                        onChange={(e) => setAdminUser(e.target.value)}
                        className="h-12 border-2 focus:border-destructive"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-secondary" />
                        {t("password")}
                      </Label>
                      <Input
                        type="password"
                        placeholder="Enter admin password"
                        value={adminPass}
                        onChange={(e) => setAdminPass(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
                        className="h-12 border-2 focus:border-destructive"
                      />
                    </div>
                  </div>

                  <Button onClick={handleAdminLogin} disabled={isLoading} className="w-full h-14 text-lg bg-destructive hover:bg-destructive/90">
                    {isLoading ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" />Authenticating...</>) : (<>Access Dashboard <ArrowRight className="w-5 h-5 ml-2" /></>)}
                  </Button>

                  <Button variant="ghost" className="w-full" onClick={() => setStep("choose")}>← {t("back")}</Button>
                </motion.div>
              )}

              {/* Success */}
              {step === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-24 h-24 mx-auto mb-6 rounded-full bg-success flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-12 h-12 text-success-foreground" />
                  </motion.div>
                  <h3 className="font-heading text-2xl font-bold text-success mb-2">
                    {t("login_success")}
                  </h3>
                  <p className="text-muted-foreground">
                    Redirecting to {loginMode === "admin" ? "admin dashboard" : "Main Dashboard"}...
                  </p>
                  <motion.div className="flex justify-center gap-1 mt-4">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-success"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.6, delay: i * 0.2, repeat: Infinity }}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-6 mt-6"
            style={{ zIndex: 30 }}
          >
            <div className="flex items-center gap-2 text-secondary-foreground/80 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
              <Shield className="w-4 h-4" />
              <span className="text-xs font-semibold">256-bit Encrypted</span>
            </div>
            <div className="flex items-center gap-2 text-secondary-foreground/80 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-semibold">UIDAI Verified</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
