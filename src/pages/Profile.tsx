import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import KioskLayout from "@/components/layout/KioskLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  User, Phone, Mail, MapPin, Heart, Shield, CreditCard, Camera,
  Edit2, Save, FileText, Wallet, AlertTriangle, CheckCircle2,
  Download, Share2, QrCode, Calendar, Building2, Hash, LogOut,
  History, Lock,
} from "lucide-react";

interface CitizenProfile {
  id: string;
  aadhaar_hash: string;
  full_name: string;
  father_name: string;
  dob: string;
  gender: string;
  address: string;
  ward: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  photo_url: string;
  blood_group: string;
  suvidha_card_id: string;
  total_transactions: number;
  total_bills_paid: number;
  complaints_filed: number;
  certificates_applied: number;
}

export default function Profile() {
  const navigate = useNavigate();
  const { userName, aadhaar, logout } = useAuth();
  const { t: _t } = useLanguage();
  const { toast } = useToast();
  const [profile, setProfile] = useState<CitizenProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<CitizenProfile>>({});
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aadhaar) return;
    fetchOrCreateProfile();
  }, [aadhaar]);

  const fetchOrCreateProfile = async () => {
    const hash = aadhaar.replace(/\s/g, "");
    const { data } = await supabase
      .from("citizen_profiles")
      .select("*")
      .eq("aadhaar_hash", hash)
      .maybeSingle();

    if (data) {
      setProfile(data as CitizenProfile);
      setEditData(data as CitizenProfile);
    } else {
      const newProfile = {
        aadhaar_hash: hash,
        full_name: userName || "Citizen",
        ward: "Ward 8",
        city: "Ahmedabad",
        state: "Gujarat",
      };
      const { data: created } = await supabase
        .from("citizen_profiles")
        .insert(newProfile)
        .select()
        .single();
      if (created) {
        setProfile(created as CitizenProfile);
        setEditData(created as CitizenProfile);
      }
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    const { error } = await supabase
      .from("citizen_profiles")
      .update({
        full_name: editData.full_name,
        father_name: editData.father_name,
        dob: editData.dob,
        gender: editData.gender,
        address: editData.address,
        ward: editData.ward,
        city: editData.city,
        state: editData.state,
        pincode: editData.pincode,
        phone: editData.phone,
        email: editData.email,
        blood_group: editData.blood_group,
      })
      .eq("id", profile.id);

    if (!error) {
      setProfile({ ...profile, ...editData } as CitizenProfile);
      setIsEditing(false);
      toast({ title: "✅ Profile Updated!" });
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${profile.aadhaar_hash}/avatar.${ext}`;
    const { error } = await supabase.storage.from("profile-photos").upload(path, file, { upsert: true });
    if (!error) {
      const { data: urlData } = supabase.storage.from("profile-photos").getPublicUrl(path);
      await supabase.from("citizen_profiles").update({ photo_url: urlData.publicUrl }).eq("id", profile.id);
      setProfile({ ...profile, photo_url: urlData.publicUrl });
      toast({ title: "📸 Photo Updated!" });
    }
    setUploading(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;
    toast({ title: "📄 Generating PDF..." });
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: [90, 55] });
      pdf.addImage(imgData, "PNG", 0, 0, 90, 55);
      pdf.save(`SUVIDHA-Card-${profile?.suvidha_card_id || "card"}.pdf`);
      toast({ title: "✅ Card saved as PDF!" });
    } catch {
      toast({ variant: "destructive", title: "Failed to generate PDF" });
    }
  };

  const maskedAadhaar = aadhaar ? `XXXX XXXX ${aadhaar.replace(/\s/g, "").slice(-4)}` : "XXXX XXXX XXXX";

  const fieldRows = [
    { key: "full_name", label: "Full Name", icon: <User className="w-4 h-4" /> },
    { key: "father_name", label: "Father's Name", icon: <User className="w-4 h-4" /> },
    { key: "dob", label: "Date of Birth", icon: <Calendar className="w-4 h-4" />, type: "date" },
    { key: "gender", label: "Gender", icon: <User className="w-4 h-4" /> },
    { key: "phone", label: "Mobile Number", icon: <Phone className="w-4 h-4" /> },
    { key: "email", label: "Email", icon: <Mail className="w-4 h-4" /> },
    { key: "address", label: "Address", icon: <MapPin className="w-4 h-4" /> },
    { key: "ward", label: "Ward", icon: <Building2 className="w-4 h-4" /> },
    { key: "city", label: "City", icon: <Building2 className="w-4 h-4" /> },
    { key: "state", label: "State", icon: <Building2 className="w-4 h-4" /> },
    { key: "pincode", label: "Pincode", icon: <Hash className="w-4 h-4" /> },
    { key: "blood_group", label: "Blood Group", icon: <Heart className="w-4 h-4" /> },
  ];

  return (
    <KioskLayout showBackButton onBack={() => navigate("/dashboard")} title="My Profile">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* ─── SUVIDHA DIGITAL CARD ─── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden border-0 shadow-2xl">
            <div ref={cardRef} className="relative bg-gradient-to-br from-[hsl(210,80%,18%)] via-[hsl(210,70%,22%)] to-[hsl(210,60%,28%)] p-8 min-h-[300px]">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full object-contain bg-white/10 p-0.5" />
                  <div>
                    <h2 className="font-heading text-lg font-bold text-white tracking-wide">DIGITAL SUVIDHA CARD</h2>
                    <p className="text-white/50 text-xs uppercase tracking-widest">GOVERNMENT OF INDIA</p>
                  </div>
                </div>
                <Badge className="bg-success/20 text-success border-success/30 px-3 py-1">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Verified Citizen
                </Badge>
              </div>

              {/* Body */}
              <div className="flex items-start gap-6">
                {/* Photo */}
                <div className="relative group flex-shrink-0">
                  <div className="w-28 h-32 rounded-xl overflow-hidden bg-white/10 border-2 border-white/20 flex items-center justify-center">
                    {profile?.photo_url ? (
                      <img src={profile.photo_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-white/40" />
                    )}
                  </div>
                  <button onClick={() => fileRef.current?.click()}
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-secondary text-xs text-white font-medium shadow-lg hover:bg-secondary/80 transition-colors">
                    <Camera className="w-3 h-3 inline mr-1" />Upload
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" capture="user" onChange={handlePhotoUpload} className="hidden" />
                  {uploading && (
                    <div className="absolute inset-0 rounded-xl bg-black/60 flex items-center justify-center">
                      <div className="chakra-spinner !w-6 !h-6" />
                    </div>
                  )}
                  {profile?.blood_group && (
                    <Badge className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground text-[10px] px-1.5">
                      {profile.blood_group}
                    </Badge>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white/50 text-xs uppercase tracking-wider">NAME</p>
                  <h3 className="font-heading text-2xl font-bold text-white mt-0.5">{profile?.full_name || userName}</h3>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-4">
                    <div>
                      <p className="text-white/50 text-xs uppercase tracking-wider">PHONE NUMBER</p>
                      <p className="text-white font-semibold text-base mt-0.5">{profile?.phone || "—"}</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-xs uppercase tracking-wider">AADHAAR (LAST 4)</p>
                      <p className="text-white font-mono font-semibold text-base mt-0.5 tracking-widest">{maskedAadhaar}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-white/50 text-xs uppercase tracking-wider">ADDRESS</p>
                    <p className="text-white/80 text-sm mt-0.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      {[profile?.address, profile?.city, profile?.state, profile?.pincode].filter(Boolean).join(", ") || "—"}
                    </p>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex-shrink-0 bg-white p-3 rounded-xl shadow-lg">
                  <QRCodeSVG
                    value={JSON.stringify({
                      card: profile?.suvidha_card_id,
                      name: profile?.full_name,
                      aadhaar: maskedAadhaar,
                      ward: profile?.ward,
                      city: profile?.city,
                    })}
                    size={100}
                    level="M"
                  />
                </div>
              </div>

              {/* Bottom tricolor strip */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-white to-success" />
            </div>

            {/* Card Footer */}
            <div className="p-4 bg-muted/50 flex items-center justify-between">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <QrCode className="w-4 h-4" /> Scan QR at any kiosk or bill counter
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleDownloadPDF}><Download className="w-4 h-4 mr-1" /> Save PDF</Button>
                <Button variant="outline" size="sm"><Share2 className="w-4 h-4 mr-1" /> Share</Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* ─── ACTION BUTTONS ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 flex items-center gap-4 cursor-pointer hover:shadow-lg transition-shadow govt-card-hover"
            onClick={() => navigate("/dashboard")}>
            <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <History className="w-6 h-6" />
            </div>
            <div>
              <p className="font-heading font-semibold text-lg">View Benefit History</p>
              <p className="text-sm text-muted-foreground">Track all your transactions & applications</p>
            </div>
          </Card>
          <Card className="p-5 flex items-center gap-4 cursor-pointer hover:shadow-lg transition-shadow govt-card-hover"
            onClick={() => setIsEditing(!isEditing)}>
            <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <p className="font-heading font-semibold text-lg">{isEditing ? "Cancel Editing" : "Privacy Settings"}</p>
              <p className="text-sm text-muted-foreground">Manage your personal information</p>
            </div>
          </Card>
        </div>

        {/* ─── EDITABLE DETAILS (shown only when editing) ─── */}
        {isEditing && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-xl font-bold flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-secondary" /> Edit Personal Details
                </h2>
                <Button onClick={handleSave} className="bg-success hover:bg-success/90">
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {fieldRows.map((field) => (
                  <div key={field.key} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
                      {field.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">{field.label}</p>
                      <Input
                        type={field.type || "text"}
                        value={(editData as any)[field.key] || ""}
                        onChange={(e) => setEditData({ ...editData, [field.key]: e.target.value })}
                        className="h-9 mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* ─── SECURE LOGOUT ─── */}
        <Button onClick={handleLogout} variant="destructive" className="w-full h-14 text-lg">
          <LogOut className="w-5 h-5 mr-2" /> Secure Logout
        </Button>
      </div>
    </KioskLayout>
  );
}
