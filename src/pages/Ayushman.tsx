import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import KioskLayout from "@/components/layout/KioskLayout";
import PageTransition from "@/components/effects/PageTransition";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Heart, CheckCircle2, Hospital, Shield, IndianRupee, MapPin, ArrowRight, Search } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const hospitals = [
  { name: "Civil Hospital", type: "Government", distance: "1.2 km", beds: 45, empanelled: true },
  { name: "Apollo Hospital", type: "Private", distance: "3.5 km", beds: 120, empanelled: true },
  { name: "Sterling Hospital", type: "Private", distance: "5.0 km", beds: 80, empanelled: true },
  { name: "Sola Civil Hospital", type: "Government", distance: "7.2 km", beds: 200, empanelled: true },
];

const treatments = [
  "Cardiology", "Orthopedics", "Oncology", "Neurology", "Eye Care", "Dental",
  "General Surgery", "Maternity", "Pediatrics", "Dialysis", "Burns", "Mental Health",
];

export default function Ayushman() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [step, setStep] = useState<"info" | "check" | "hospitals">("info");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <PageTransition>
      <KioskLayout showBackButton onBack={() => step === "info" ? navigate("/dashboard") : setStep("info")} title={t("ayushman")}>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-destructive" />
            </div>
            <h1 className="font-heading text-3xl font-bold mb-2">Ayushman Bharat - PMJAY</h1>
            <p className="text-muted-foreground">₹5 Lakh free health insurance per family per year</p>
          </div>

          {step === "info" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card className="p-6 bg-gradient-to-r from-destructive/10 to-destructive/5 border-destructive/20">
                <div className="flex items-center gap-4 mb-4">
                  <Shield className="w-10 h-10 text-destructive" />
                  <div>
                    <h2 className="font-heading text-2xl font-bold">₹5,00,000</h2>
                    <p className="text-muted-foreground">Annual health coverage per family</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center p-3 bg-card rounded-xl">
                    <p className="font-bold text-lg">1,500+</p>
                    <p className="text-xs text-muted-foreground">Treatments Covered</p>
                  </div>
                  <div className="text-center p-3 bg-card rounded-xl">
                    <p className="font-bold text-lg">25,000+</p>
                    <p className="text-xs text-muted-foreground">Hospitals</p>
                  </div>
                  <div className="text-center p-3 bg-card rounded-xl">
                    <p className="font-bold text-lg">55 Cr+</p>
                    <p className="text-xs text-muted-foreground">Beneficiaries</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-heading font-bold mb-3">Covered Treatments</h3>
                <div className="flex flex-wrap gap-2">
                  {treatments.map((t, idx) => (
                    <Badge key={idx} variant="outline" className="px-3 py-1">{t}</Badge>
                  ))}
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Button onClick={() => setStep("check")} className="h-14 text-lg bg-destructive hover:bg-destructive/90">
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Check Eligibility
                </Button>
                <Button onClick={() => setStep("hospitals")} variant="outline" className="h-14 text-lg">
                  <Hospital className="w-5 h-5 mr-2" /> Find Hospitals
                </Button>
              </div>
            </motion.div>
          )}

          {step === "check" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card className="p-6">
                <h2 className="font-heading text-xl font-bold mb-4">Check Your Eligibility</h2>
                <div className="space-y-4">
                  <Input placeholder="Aadhaar Number or Ration Card Number" className="h-14 text-lg" />
                  <Input placeholder="Mobile Number" className="h-12" />
                  <Button className="w-full h-14 text-lg bg-destructive hover:bg-destructive/90">
                    Verify Eligibility <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </Card>
              <Card className="p-6 border-success/30 bg-success/5">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-success" />
                  <div>
                    <h3 className="font-heading font-bold text-success">You are Eligible! ✅</h3>
                    <p className="text-sm text-muted-foreground">PMJAY Card Number: AB-GJ-2026-XXXXXX</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="p-3 bg-card rounded-xl text-center">
                    <IndianRupee className="w-5 h-5 mx-auto mb-1 text-success" />
                    <p className="font-bold">₹5,00,000</p>
                    <p className="text-xs text-muted-foreground">Available Balance</p>
                  </div>
                  <div className="p-3 bg-card rounded-xl text-center">
                    <Heart className="w-5 h-5 mx-auto mb-1 text-destructive" />
                    <p className="font-bold">Family of 5</p>
                    <p className="text-xs text-muted-foreground">Members Covered</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {step === "hospitals" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input placeholder="Search hospitals near you..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 h-14 text-lg" />
              </div>
              <div className="space-y-4">
                {hospitals.map((h, idx) => (
                  <Card key={idx} className="p-4 hover:border-destructive/30 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-destructive/10"><Hospital className="w-6 h-6 text-destructive" /></div>
                        <div>
                          <h4 className="font-heading font-bold">{h.name}</h4>
                          <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{h.distance}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{h.type}</Badge>
                            <Badge className="bg-success/20 text-success">Empanelled</Badge>
                            <Badge variant="outline">{h.beds} beds available</Badge>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Navigate</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </KioskLayout>
    </PageTransition>
  );
}
