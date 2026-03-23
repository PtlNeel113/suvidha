import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import KioskLayout from "@/components/layout/KioskLayout";
import PageTransition from "@/components/effects/PageTransition";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle2, IndianRupee, Calendar, ArrowRight, Users } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const pensionSchemes = [
  { name: "Atal Pension Yojana (APY)", benefit: "₹1,000 - ₹5,000/month", age: "18-40 years", contribution: "₹42 - ₹1,454/month", icon: "🏦" },
  { name: "PM Vaya Vandana Yojana", benefit: "8% guaranteed return", age: "60+ years", contribution: "Lump sum ₹1.5L - ₹15L", icon: "👴" },
  { name: "National Pension System (NPS)", benefit: "Market-linked returns", age: "18-65 years", contribution: "Min ₹500/month", icon: "📊" },
  { name: "Indira Gandhi Old Age Pension", benefit: "₹200 - ₹500/month", age: "60+ years (BPL)", contribution: "Free - Government funded", icon: "🇮🇳" },
  { name: "Widow Pension Scheme", benefit: "₹300 - ₹1,000/month", age: "18+ (widowed women)", contribution: "Free - Government funded", icon: "👩" },
];

export default function Pension() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedScheme, setSelectedScheme] = useState<number | null>(null);

  return (
    <PageTransition>
      <KioskLayout showBackButton onBack={() => selectedScheme !== null ? setSelectedScheme(null) : navigate("/dashboard")} title={t("pension")}>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-secondary" />
            </div>
            <h1 className="font-heading text-3xl font-bold mb-2">Pension Schemes</h1>
            <p className="text-muted-foreground">Secure your retirement with government pension schemes</p>
          </div>

          {selectedScheme === null ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {pensionSchemes.map((scheme, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.08 }}>
                  <Card className="p-5 cursor-pointer hover:border-secondary/30 transition-all hover:shadow-lg" onClick={() => setSelectedScheme(idx)}>
                    <div className="flex items-start gap-4">
                      <span className="text-4xl">{scheme.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-heading font-bold text-lg">{scheme.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge className="bg-success/20 text-success"><IndianRupee className="w-3 h-3 mr-1" />{scheme.benefit}</Badge>
                          <Badge variant="outline"><Users className="w-3 h-3 mr-1" />{scheme.age}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">Contribution: {scheme.contribution}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card className="p-6 border-secondary/30 bg-secondary/5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-5xl">{pensionSchemes[selectedScheme].icon}</span>
                  <div>
                    <h2 className="font-heading text-2xl font-bold">{pensionSchemes[selectedScheme].name}</h2>
                    <Badge className="bg-success/20 text-success mt-1">{pensionSchemes[selectedScheme].benefit}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-card rounded-xl"><p className="text-sm text-muted-foreground">Age Group</p><p className="font-bold">{pensionSchemes[selectedScheme].age}</p></div>
                  <div className="p-3 bg-card rounded-xl"><p className="text-sm text-muted-foreground">Contribution</p><p className="font-bold">{pensionSchemes[selectedScheme].contribution}</p></div>
                </div>
              </Card>
              <Card className="p-6">
                <h3 className="font-heading font-bold mb-4">Apply Now</h3>
                <div className="space-y-4">
                  <Input placeholder="Full Name" className="h-12" />
                  <Input placeholder="Aadhaar Number" className="h-12" />
                  <Input placeholder="Date of Birth" type="date" className="h-12" />
                  <Input placeholder="Mobile Number" className="h-12" />
                  <Input placeholder="Bank Account Number" className="h-12" />
                  <Input placeholder="IFSC Code" className="h-12" />
                  <Button className="w-full h-14 text-lg bg-secondary hover:bg-secondary/90">
                    Submit Application <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </KioskLayout>
    </PageTransition>
  );
}
