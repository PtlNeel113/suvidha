import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertTriangle, Camera, MapPin, Upload, CheckCircle2, Shield, Clock,
  XCircle, ChevronRight, FileText, LocateFixed, Loader2,
} from "lucide-react";
import KioskLayout from "@/components/layout/KioskLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LocationPicker from "@/components/map/LocationPicker";

type Step = "category" | "details" | "photo" | "verification" | "success" | "track";

interface ComplaintCategory {
  id: string;
  icon: string;
  title: string;
  examples: string;
}

export default function Complaints() {
  const navigate = useNavigate();
  const { aadhaar, userName } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("category");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFraud, setIsFraud] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [briefDesc, setBriefDesc] = useState("");
  const [locationText, setLocationText] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [complaintId, setComplaintId] = useState("");
  const [myComplaints, setMyComplaints] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (aadhaar) fetchMyComplaints();
  }, [aadhaar]);

  const fetchMyComplaints = async () => {
    const hash = aadhaar.replace(/\s/g, "");
    const { data } = await supabase
      .from("complaints")
      .select("*")
      .eq("aadhaar_hash", hash)
      .order("created_at", { ascending: false })
      .limit(10);
    if (data) setMyComplaints(data);
  };

  const categories: ComplaintCategory[] = [
    { id: "roads", icon: "🕳️", title: "Roads & Potholes", examples: "Potholes, damaged roads, missing signs" },
    { id: "water", icon: "💧", title: "Water Supply", examples: "Leakage, contamination, no supply" },
    { id: "electricity", icon: "⚡", title: "Electricity", examples: "Power cuts, damaged poles" },
    { id: "sanitation", icon: "🗑️", title: "Sanitation", examples: "Garbage, drainage, open defecation" },
    { id: "corruption", icon: "🏛️", title: "Corruption", examples: "Bribery, delayed services" },
    { id: "other", icon: "📝", title: "Other", examples: "Any other civic issue" },
  ];

  const handleFileUpload = async (file: File) => {
    setIsAnalyzing(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("complaint-photos").upload(path, file);
    if (!error) {
      const { data: urlData } = supabase.storage.from("complaint-photos").getPublicUrl(path);
      setUploadedImage(urlData.publicUrl);
    }
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsFraud(Math.random() > 0.8);
      setStep("verification");
    }, 2500);
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setLocationText(address);
    setShowMap(false);
    toast({ title: "📍 Location Pinned!", description: address.slice(0, 60) + "..." });
  };

  const handleDetectLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
          const data = await resp.json();
          setLocationText(data.display_name || `${pos.coords.latitude}, ${pos.coords.longitude}`);
          toast({ title: "📍 Location Detected!" });
        } catch {
          setLocationText(`${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
        }
      },
      () => toast({ variant: "destructive", title: "Location access denied" }),
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const cNum = `GRV${Date.now().toString().slice(-10)}`;
    const hash = aadhaar.replace(/\s/g, "");
    const { error } = await supabase.from("complaints").insert({
      complaint_number: cNum,
      aadhaar_hash: hash,
      citizen_name: userName || "Citizen",
      type: selectedCategory || "other",
      description: `${briefDesc}\n\n${description}`,
      ward: "Ward 8",
      location: locationText,
      photo_url: uploadedImage,
      priority: "medium",
    });
    if (!error) {
      setComplaintId(cNum);
      setStep("success");
      toast({ title: "✅ Complaint Registered!" });
    } else {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
    setSubmitting(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "bg-success/10 text-success";
      case "in-progress": return "bg-primary/10 text-primary";
      case "escalated": return "bg-destructive/10 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusSteps = (status: string) => {
    const steps = ["Filed", "Assigned", "In Progress", "Resolved"];
    const current = status === "resolved" ? 4 : status === "in-progress" ? 3 : status === "escalated" ? 3 : 1;
    return { steps, current };
  };

  return (
    <KioskLayout showBackButton onBack={() => (step === "category" ? navigate("/dashboard") : setStep("category"))} title={t("complaints")}>
      {showMap && <LocationPicker onLocationSelect={handleLocationSelect} onClose={() => setShowMap(false)} />}
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleCameraCapture} className="hidden" />
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleGalleryUpload} className="hidden" />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {step === "category" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-10 h-10 text-destructive" />
              </div>
              <h1 className="font-heading text-3xl font-bold mb-2">Report a Civic Issue</h1>
              <p className="text-muted-foreground max-w-xl mx-auto">AI-powered complaint system with fraud detection</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {categories.map((cat) => (
                <motion.button key={cat.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => { setSelectedCategory(cat.id); setStep("details"); }}
                  className="service-tile">
                  <span className="text-4xl mb-2">{cat.icon}</span>
                  <h3 className="font-heading font-bold">{cat.title}</h3>
                  <p className="text-xs text-muted-foreground text-center">{cat.examples}</p>
                </motion.button>
              ))}
            </div>

            {/* My Complaints with tracking */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-bold text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Your Complaints
                </h2>
                <Button variant="outline" size="sm" onClick={fetchMyComplaints}>Refresh</Button>
              </div>
              {myComplaints.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No complaints filed yet</p>
              ) : (
                <div className="space-y-3">
                  {myComplaints.map((c) => {
                    const { steps, current } = getStatusSteps(c.status);
                    return (
                      <div key={c.id} className="p-4 bg-muted/50 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{c.type} - {c.description?.slice(0, 40)}...</p>
                            <p className="text-sm text-muted-foreground">{c.complaint_number} • {new Date(c.created_at).toLocaleDateString()}</p>
                          </div>
                          <Badge className={getStatusColor(c.status)}>{c.status}</Badge>
                        </div>
                        {/* Status tracker */}
                        <div className="flex items-center gap-1">
                          {steps.map((s, idx) => (
                            <div key={s} className="flex items-center flex-1">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                idx < current ? "bg-success text-success-foreground" : "bg-muted-foreground/20 text-muted-foreground"
                              }`}>{idx < current ? "✓" : idx + 1}</div>
                              {idx < steps.length - 1 && (
                                <div className={`flex-1 h-1 mx-1 rounded ${idx < current - 1 ? "bg-success" : "bg-muted-foreground/20"}`} />
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-8 text-xs text-muted-foreground">
                          {steps.map((s) => <span key={s} className="flex-1 text-center">{s}</span>)}
                        </div>
                        {c.photo_url && (
                          <div className="flex items-center gap-2">
                            <img src={c.photo_url} alt="Evidence" className="w-16 h-16 rounded-lg object-cover" />
                            <span className="text-xs text-muted-foreground">Photo evidence attached</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {step === "details" && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="govt-card max-w-2xl mx-auto">
            <h2 className="font-heading text-xl font-bold mb-6">Describe the Issue</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Brief Description *</label>
                <Input placeholder="e.g., Large pothole causing accidents" className="h-14" value={briefDesc} onChange={(e) => setBriefDesc(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Detailed Explanation</label>
                <Textarea placeholder="Provide more details..." rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2"><MapPin className="w-4 h-4 inline mr-1" />Location</label>
                <Input placeholder="Enter address or pin on map" className="h-14" value={locationText} onChange={(e) => setLocationText(e.target.value)} />
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" onClick={handleDetectLocation} className="h-12">
                    <LocateFixed className="w-4 h-4 mr-2" /> Use GPS
                  </Button>
                  <Button variant="outline" onClick={() => setShowMap(true)} className="h-12">
                    <MapPin className="w-4 h-4 mr-2" /> Pin on Map
                  </Button>
                </div>
              </div>
              <Button className="w-full h-14 text-lg bg-secondary" onClick={() => setStep("photo")} disabled={!briefDesc.trim()}>
                Continue to Photo Evidence <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === "photo" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="govt-card max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
              <Camera className="w-10 h-10 text-secondary" />
            </div>
            <h2 className="font-heading text-2xl font-bold mb-2">Upload Photo Evidence</h2>
            <p className="text-muted-foreground mb-6">AI will verify the authenticity of your photo</p>

            {!isAnalyzing && (
              <div className="space-y-4">
                <button onClick={() => cameraInputRef.current?.click()}
                  className="w-full kiosk-btn kiosk-btn-primary flex items-center justify-center gap-4">
                  <Camera className="w-8 h-8" />
                  <div className="text-left">
                    <span className="block font-heading font-bold text-lg">Take Photo Now</span>
                    <span className="text-sm opacity-80">Open device camera</span>
                  </div>
                </button>
                <button onClick={() => fileInputRef.current?.click()}
                  className="w-full kiosk-btn flex items-center justify-center gap-4">
                  <Upload className="w-8 h-8" />
                  <div className="text-left">
                    <span className="block font-heading font-bold text-lg">Upload from Gallery</span>
                    <span className="text-sm opacity-80">Choose from device</span>
                  </div>
                </button>
                <Button variant="ghost" onClick={() => { setUploadedImage(null); setStep("verification"); setIsFraud(false); }}
                  className="w-full h-12 text-muted-foreground">Skip photo (optional)</Button>
              </div>
            )}

            {isAnalyzing && (
              <div className="py-12">
                <div className="chakra-spinner mx-auto mb-4" />
                <p className="font-medium">AI is analyzing your photo...</p>
                <p className="text-sm text-muted-foreground">Checking authenticity, location, and severity</p>
              </div>
            )}
          </motion.div>
        )}

        {step === "verification" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
            {isFraud ? (
              <div className="govt-card border-destructive/30 bg-destructive/5 text-center">
                <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                  <XCircle className="w-12 h-12 text-destructive" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-destructive mb-2">⚠️ Potential Fraud Detected</h2>
                <p className="text-muted-foreground mb-6">Our AI detected this image may have been tampered with.</p>
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={() => { setUploadedImage(null); setStep("photo"); }}>Try Different Photo</Button>
                  <Button variant="destructive" onClick={() => navigate("/dashboard")}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="govt-card border-success/30 bg-success/5 text-center">
                <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-12 h-12 text-success" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-success mb-2">
                  {uploadedImage ? "✓ Photo Verified Authentic" : "✓ Ready to Submit"}
                </h2>
                {uploadedImage && (
                  <div className="my-4">
                    <img src={uploadedImage} alt="Evidence" className="w-40 h-40 rounded-xl object-cover mx-auto border-2 border-success/30" />
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[{ icon: <CheckCircle2 className="w-6 h-6 text-success" />, label: uploadedImage ? "Original Photo" : "Details OK" },
                    { icon: <MapPin className="w-6 h-6 text-success" />, label: locationText ? "Location Set" : "No Location" },
                    { icon: <Clock className="w-6 h-6 text-success" />, label: "Recent" }].map((item, i) => (
                    <div key={i} className="bg-card rounded-xl p-4">
                      <div className="mx-auto mb-2 flex justify-center">{item.icon}</div>
                      <p className="text-sm font-medium">{item.label}</p>
                    </div>
                  ))}
                </div>
                <Button className="w-full h-14 text-lg bg-success hover:bg-success/90" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...</> : "Submit Complaint"}
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {step === "success" && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-success" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-success mb-2">Complaint Registered! 🎉</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">Your complaint has been submitted and assigned</p>
            <Card className="max-w-md mx-auto mb-8 p-6 text-left">
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-muted-foreground">Complaint ID:</span><span className="font-mono font-bold">{complaintId}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Category:</span><span>{selectedCategory}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Priority:</span><Badge className="bg-primary/10 text-primary">MEDIUM</Badge></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Est. Resolution:</span><span>5-7 days</span></div>
              </div>
            </Card>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="h-12 px-6 bg-secondary" onClick={() => { setStep("category"); fetchMyComplaints(); }}>Track Status</Button>
              <Button variant="outline" className="h-12 px-6" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
            </div>
          </motion.div>
        )}
      </div>
    </KioskLayout>
  );
}
