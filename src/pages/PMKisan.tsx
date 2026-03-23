import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import KioskLayout from "@/components/layout/KioskLayout";
import PageTransition from "@/components/effects/PageTransition";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Tractor, IndianRupee, Calendar, FileText, ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export default function PMKisan() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [step, setStep] = useState<"check" | "status" | "apply">("check");
  const [aadhaar, setAadhaar] = useState("");

  const installments = [
    { period: "Apr-Jul 2025", amount: "₹2,000", status: "paid", date: "15 May 2025" },
    { period: "Aug-Nov 2025", amount: "₹2,000", status: "paid", date: "12 Sep 2025" },
    { period: "Dec-Mar 2026", amount: "₹2,000", status: "pending", date: "Expected Feb 2026" },
  ];

  return (
    <PageTransition>
      <KioskLayout showBackButton onBack={() => step === "check" ? navigate("/dashboard") : setStep("check")} title={t("pm_kisan")}>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
              <Tractor className="w-10 h-10 text-success" />
            </div>
            <h1 className="font-heading text-3xl font-bold mb-2">PM Kisan Samman Nidhi</h1>
            <p className="text-muted-foreground">₹6,000/year direct income support for farmer families</p>
          </div>

          {step === "check" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card className="p-6">
                <h2 className="font-heading text-xl font-bold mb-4">Check Beneficiary Status</h2>
                <div className="space-y-4">
                  <Input placeholder="Enter Aadhaar Number" value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} className="h-14 text-lg" />
                  <Button onClick={() => setStep("status")} className="w-full h-14 text-lg bg-success hover:bg-success/90" disabled={aadhaar.length < 10}>
                    Check Status <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-r from-success/10 to-success/5 border-success/20">
                <h3 className="font-heading font-bold mb-3">Eligibility Criteria</h3>
                <ul className="space-y-2 text-sm">
                  {["Small and marginal farmer families", "Must have cultivable land", "Family income should not exceed limits", "Not a government employee or taxpayer"].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-success mt-0.5" />{item}</li>
                  ))}
                </ul>
              </Card>

              <Button variant="outline" onClick={() => setStep("apply")} className="w-full h-14 text-lg">
                <FileText className="w-5 h-5 mr-2" /> New Application
              </Button>
            </motion.div>
          )}

          {step === "status" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card className="p-6 border-success/30 bg-success/5">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="w-8 h-8 text-success" />
                  <div>
                    <h3 className="font-heading font-bold text-success">Active Beneficiary</h3>
                    <p className="text-sm text-muted-foreground">Ramesh Kumar Patel • AADHAAR XXXX9012</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center p-3 bg-card rounded-xl">
                    <IndianRupee className="w-5 h-5 mx-auto mb-1 text-success" />
                    <p className="font-bold">₹16,000</p>
                    <p className="text-xs text-muted-foreground">Total Received</p>
                  </div>
                  <div className="text-center p-3 bg-card rounded-xl">
                    <Calendar className="w-5 h-5 mx-auto mb-1 text-secondary" />
                    <p className="font-bold">8th</p>
                    <p className="text-xs text-muted-foreground">Installment</p>
                  </div>
                  <div className="text-center p-3 bg-card rounded-xl">
                    <Tractor className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <p className="font-bold">2.5 ha</p>
                    <p className="text-xs text-muted-foreground">Land Area</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-heading font-bold mb-4">Recent Installments</h3>
                <div className="space-y-3">
                  {installments.map((inst, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                      <div>
                        <p className="font-medium">{inst.period}</p>
                        <p className="text-sm text-muted-foreground">{inst.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold">{inst.amount}</span>
                        <Badge className={inst.status === "paid" ? "bg-success/20 text-success" : "bg-primary/20 text-primary"}>
                          {inst.status === "paid" ? "✅ Paid" : "⏳ Pending"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {step === "apply" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6">
                <h2 className="font-heading text-xl font-bold mb-6">New Application</h2>
                <div className="space-y-4">
                  <Input placeholder="Full Name (as per Aadhaar)" className="h-12" />
                  <Input placeholder="Aadhaar Number" className="h-12" />
                  <Input placeholder="Mobile Number" className="h-12" />
                  <Input placeholder="Bank Account Number" className="h-12" />
                  <Input placeholder="IFSC Code" className="h-12" />
                  <Input placeholder="Total Land Area (in hectares)" className="h-12" />
                  <Input placeholder="Village/Town" className="h-12" />
                  <Input placeholder="District, State" className="h-12" />
                  <Button className="w-full h-14 text-lg bg-success hover:bg-success/90">
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
