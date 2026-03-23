import { useState } from "react";
import { useNavigate } from "react-router-dom";
import KioskLayout from "@/components/layout/KioskLayout";
import PageTransition from "@/components/effects/PageTransition";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Droplets, CheckCircle2, ArrowRight, CreditCard } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Confetti from "@/components/effects/Confetti";

export default function Water() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { aadhaar, userName } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<"input" | "review" | "success">("input");
  const [accountNo, setAccountNo] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const billData = { name: userName || "Ramesh K. Patel", account: "AMC-WTR-456789", amount: 380, dueDate: "20 Mar 2026", usage: "12,500 L", period: "Feb 2026" };

  const handlePay = async () => {
    setIsLoading(true);
    const refId = `TXN-W-${Date.now().toString().slice(-6)}`;
    await supabase.from("transactions").insert({
      aadhaar_hash: aadhaar || "demo", citizen_name: userName || "Citizen",
      service_type: "water", amount: billData.amount, status: "completed",
      provider: "AMC Water", reference_id: refId, ward: "Ward 8",
    });
    setIsLoading(false);
    setStep("success");
    setShowConfetti(true);
    toast({ title: "✅ Payment Successful!", description: `₹${billData.amount} paid` });
  };

  return (
    <PageTransition>
      <KioskLayout showBackButton onBack={() => step === "input" ? navigate("/dashboard") : setStep("input")} title={t("water")}>
        <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Droplets className="w-12 h-12 text-accent" />
            </div>
            <h1 className="font-heading text-3xl font-bold mb-2">{t("water")} Bill Payment</h1>
            <p className="text-lg text-muted-foreground">AMC / Municipal water bill payment</p>
          </div>

          {step === "input" && (
            <Card className="p-6 max-w-2xl mx-auto">
              <div className="space-y-4">
                <Input placeholder="Enter Water Account Number" value={accountNo} onChange={(e) => setAccountNo(e.target.value)} className="h-16 text-xl" />
                <Button onClick={() => setStep("review")} disabled={accountNo.length < 5} className="w-full h-16 text-xl bg-accent hover:bg-accent/90">
                  Fetch Bill <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
              <div className="mt-6 pt-4 border-t"><p className="text-base text-muted-foreground text-center">Supported: AMC, BMC, NDMC, PCMC</p></div>
            </Card>
          )}

          {step === "review" && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <Card className="p-6">
                <div className="space-y-3">
                  {Object.entries({ "Account Holder": billData.name, "Account No": billData.account, "Billing Period": billData.period, "Water Usage": billData.usage, "Due Date": billData.dueDate }).map(([k, v]) => (
                    <div key={k} className="flex justify-between py-3 border-b border-border last:border-0 text-base">
                      <span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span>
                    </div>
                  ))}
                  <div className="bg-accent/5 rounded-2xl p-6 text-center mt-4">
                    <p className="text-base text-muted-foreground">Amount Payable</p>
                    <p className="font-heading text-5xl font-bold text-accent">₹{billData.amount}</p>
                  </div>
                </div>
              </Card>
              <Button onClick={handlePay} disabled={isLoading} className="w-full h-16 text-xl bg-success hover:bg-success/90">
                {isLoading ? "Processing..." : <><CreditCard className="w-5 h-5 mr-2" /> Pay ₹{billData.amount}</>}
              </Button>
            </div>
          )}

          {step === "success" && (
            <div className="text-center">
              <CheckCircle2 className="w-24 h-24 text-success mx-auto mb-4" />
              <h2 className="font-heading text-3xl font-bold text-success mb-2">Payment Successful! 🎉</h2>
              <p className="text-lg text-muted-foreground mb-6">Water bill of ₹{billData.amount} paid successfully</p>
              <Button variant="outline" className="h-14 px-8" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
            </div>
          )}
        </div>
      </KioskLayout>
    </PageTransition>
  );
}
