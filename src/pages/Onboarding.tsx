import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Loader2 } from "lucide-react";

export default function Onboarding() {
  const navigate = useNavigate();
  const { aadhaar, updateUserName, completeOnboarding } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!fullName.trim()) {
      toast({ variant: "destructive", title: "Required", description: "Please enter your full name" });
      return;
    }
    setIsLoading(true);

    const hash = aadhaar.replace(/\s/g, "");

    // Update or create profile
    const { data: existing } = await supabase
      .from("citizen_profiles")
      .select("id")
      .eq("aadhaar_hash", hash)
      .maybeSingle();

    if (existing) {
      await supabase.from("citizen_profiles").update({ full_name: fullName, phone }).eq("id", existing.id);
    } else {
      await supabase.from("citizen_profiles").insert({
        aadhaar_hash: hash,
        full_name: fullName,
        phone,
        ward: "Ward 8",
        city: "Ahmedabad",
        state: "Gujarat",
      });
    }

    updateUserName(fullName);
    completeOnboarding();
    setIsLoading(false);
    toast({ title: "✅ Welcome, " + fullName + "!" });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?w=1920&q=80)" }} />
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/75 to-secondary/50" />
      <div className="absolute top-0 left-0 right-0 h-2 z-20">
        <div className="h-full bg-gradient-to-r from-primary via-white to-success" />
      </div>

      {/* Left branding */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center p-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center text-secondary-foreground">
          <img src="/logo.png" alt="SUVIDHA" className="w-32 h-32 mx-auto mb-6 rounded-full object-cover drop-shadow-lg" />
          <h1 className="font-heading text-5xl font-bold mb-4 drop-shadow-lg">DIGITAL SUVIDHA</h1>
          <p className="text-xl opacity-90">{t("govt_of_india")} • {t("digital_suvidha")}</p>
          <div className="flex items-center gap-4 justify-center mt-8">
            {[{ value: "2.4M+", label: "Citizens Served" }, { value: "500+", label: "Government Services" }, { value: "28", label: "States" }].map((stat, idx) => (
              <motion.div key={idx} className="bg-secondary-foreground/15 backdrop-blur-sm rounded-2xl px-6 py-3"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + idx * 0.1 }}>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm opacity-80">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <Card className="p-8 shadow-2xl bg-card/95 backdrop-blur-xl border-secondary/20">
            <div className="text-center mb-8">
              <h2 className="font-heading text-2xl font-bold">One Last Step!</h2>
              <p className="text-muted-foreground mt-1">Please tell us a bit about yourself</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                <Input
                  placeholder="e.g. Rajesh Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-14 text-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Phone Number</label>
                <Input
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="h-14 text-lg"
                  type="tel"
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isLoading ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving...</>
                ) : (
                  <>Verify & Login <ArrowRight className="w-5 h-5 ml-2" /></>
                )}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
