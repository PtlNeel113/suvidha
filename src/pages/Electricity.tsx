import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, QrCode, CreditCard, CheckCircle2, Lightbulb, Printer, ArrowRight } from "lucide-react";
import KioskLayout from "@/components/layout/KioskLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Confetti from "@/components/effects/Confetti";
import PageTransition from "@/components/effects/PageTransition";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Step = "input" | "review" | "payment" | "success";

export default function Electricity() {
  const navigate = useNavigate();
  const { aadhaar, userName } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("input");
  const [consumerNumber, setConsumerNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [txnId, setTxnId] = useState("");

  const billData = {
    consumerName: userName || "Ramesh Kumar Patel",
    consumerNumber: "GUV123456789",
    provider: "GUVNL - Gujarat",
    amount: 1245,
    dueDate: "15 Mar 2026",
    units: 186,
    previousReading: 4521,
    currentReading: 4707,
    billingPeriod: "Feb 2026",
  };

  const handleScan = () => {
    setIsLoading(true);
    setTimeout(() => {
      setConsumerNumber(billData.consumerNumber);
      setIsLoading(false);
      setStep("review");
    }, 1500);
  };

  const handlePaymentSuccess = async () => {
    setIsLoading(true);
    const refId = `TXN-E-${Date.now().toString().slice(-6)}`;
    
    // Save real transaction to database
    const { error } = await supabase.from("transactions").insert({
      aadhaar_hash: aadhaar || "demo",
      citizen_name: userName || "Citizen",
      service_type: "electricity",
      amount: billData.amount,
      status: "completed",
      provider: billData.provider,
      reference_id: refId,
      ward: "Ward 8",
      metadata: { consumer_number: billData.consumerNumber, units: billData.units, billing_period: billData.billingPeriod },
    });

    if (error) {
      console.error("Transaction save error:", error);
      toast({ variant: "destructive", title: "Error", description: "Payment processing failed" });
      setIsLoading(false);
      return;
    }

    setTxnId(refId);
    setIsLoading(false);
    setStep("success");
    setShowConfetti(true);
    toast({ title: "✅ Payment Successful!", description: `₹${billData.amount} paid. Ref: ${refId}` });
  };

  return (
    <PageTransition>
      <KioskLayout showBackButton onBack={() => step === "input" ? navigate("/dashboard") : setStep("input")} title="Electricity Bill Payment">
        <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Progress Steps */}
          <motion.div className="flex items-center justify-center gap-2 mb-10" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            {["Enter Details", "Review Bill", "Payment", "Receipt"].map((label, idx) => {
              const stepIdx = ["input", "review", "payment", "success"].indexOf(step);
              const isActive = idx <= stepIdx;
              const isCurrent = idx === stepIdx;
              return (
                <div key={label} className="flex items-center">
                  <motion.div className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-colors ${
                    isCurrent ? "bg-secondary text-secondary-foreground" : isActive ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"
                  }`} animate={isCurrent ? { scale: [1, 1.05, 1] } : {}} transition={{ duration: 0.5, repeat: isCurrent ? Infinity : 0 }}>
                    <span className="w-7 h-7 rounded-full bg-current/20 flex items-center justify-center text-sm font-bold">
                      {isActive && idx < stepIdx ? "✓" : idx + 1}
                    </span>
                    <span className="hidden md:inline text-sm font-medium">{label}</span>
                  </motion.div>
                  {idx < 3 && <ArrowRight className="w-5 h-5 mx-2 text-muted-foreground" />}
                </div>
              );
            })}
          </motion.div>

          {step === "input" && (
            <div className="govt-card max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-12 h-12 text-primary" />
                </div>
                <h2 className="font-heading text-3xl font-bold mb-2">Pay Electricity Bill</h2>
                <p className="text-lg text-muted-foreground">Scan QR code or enter your consumer number</p>
              </div>
              <div className="space-y-6">
                <button onClick={handleScan} disabled={isLoading} className="w-full kiosk-btn kiosk-btn-primary flex items-center justify-center gap-4">
                  {isLoading ? <div className="chakra-spinner" /> : (
                    <><QrCode className="w-8 h-8" /><div className="text-left"><span className="block font-heading font-bold text-xl">Scan QR Code</span><span className="text-base opacity-80">Hold your bill in front of camera</span></div></>
                  )}
                </button>
                <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                  <div className="relative flex justify-center"><span className="bg-card px-4 text-base text-muted-foreground">OR</span></div></div>
                <div className="space-y-4">
                  <label className="block text-base font-medium mb-2">Consumer Number / Account ID</label>
                  <Input type="text" placeholder="Enter 12-digit consumer number" value={consumerNumber} onChange={(e) => setConsumerNumber(e.target.value)} className="h-16 text-xl" />
                  <Button onClick={() => setStep("review")} disabled={consumerNumber.length < 6} className="w-full h-16 text-xl font-heading font-bold bg-success hover:bg-success/90">
                    Fetch Bill Details
                  </Button>
                </div>
                <div className="pt-6 border-t border-border">
                  <p className="text-base text-muted-foreground text-center mb-4">Supported Providers</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {["GUVNL", "MSEDCL", "TPDDL", "BSES", "CESC"].map((p) => (
                      <span key={p} className="px-4 py-2 bg-muted rounded-xl text-base font-medium">{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === "review" && (
            <div className="space-y-6">
              <div className="govt-card max-w-2xl mx-auto">
                <div className="flex items-start justify-between mb-6">
                  <div><h2 className="font-heading text-2xl font-bold">Bill Details</h2><p className="text-muted-foreground text-lg">{billData.provider}</p></div>
                  <span className="px-4 py-1.5 bg-success/10 text-success rounded-full text-base font-medium">Active Account</span>
                </div>
                <div className="grid gap-4 mb-6">
                  {[["Consumer Name", billData.consumerName], ["Consumer Number", billData.consumerNumber], ["Billing Period", billData.billingPeriod],
                    ["Units Consumed", `${billData.units} units (${billData.previousReading} → ${billData.currentReading})`], ["Due Date", billData.dueDate]].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-3 border-b border-border text-base">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="font-medium">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-secondary/5 rounded-2xl p-6 text-center">
                  <p className="text-base text-muted-foreground mb-1">Amount Payable</p>
                  <p className="font-heading text-5xl font-bold text-secondary">₹{billData.amount.toLocaleString()}</p>
                </div>
              </div>
              <div className="govt-card max-w-2xl mx-auto bg-primary/5 border-primary/20">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center"><Lightbulb className="w-7 h-7 text-primary" /></div>
                  <div><h3 className="font-heading font-bold text-lg mb-1">💡 AI Energy Tip</h3>
                    <p className="text-base text-muted-foreground">Your usage is 15% higher than last month. Switch to LED bulbs and save up to ₹180/month!</p></div>
                </div>
              </div>
              <div className="flex gap-4 max-w-2xl mx-auto">
                <Button variant="outline" className="flex-1 h-16 text-lg" onClick={() => setStep("input")}>Back</Button>
                <Button className="flex-1 h-16 text-lg font-heading font-bold bg-success hover:bg-success/90" onClick={() => setStep("payment")}>
                  <CreditCard className="w-5 h-5 mr-2" /> Pay ₹{billData.amount}
                </Button>
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className="govt-card max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="font-heading text-2xl font-bold mb-2">Choose Payment Method</h2>
                <p className="text-lg text-muted-foreground">Amount: <span className="font-bold text-secondary">₹{billData.amount}</span></p>
              </div>
              <div className="grid gap-4 mb-8">
                {[{ icon: "📱", label: "UPI / Google Pay / PhonePe", desc: "Scan QR or enter UPI ID" },
                  { icon: "💳", label: "Debit / Credit Card", desc: "Visa, Mastercard, RuPay" },
                  { icon: "🏦", label: "Net Banking", desc: "All major banks supported" },
                  { icon: "💰", label: "Cash (Kiosk Deposit)", desc: "Insert cash in machine" },
                ].map((m) => (
                  <button key={m.label} onClick={handlePaymentSuccess} disabled={isLoading}
                    className="kiosk-btn flex items-center gap-4 text-left">
                    <span className="text-4xl">{m.icon}</span>
                    <div><span className="block font-heading font-bold text-lg">{m.label}</span><span className="text-base text-muted-foreground">{m.desc}</span></div>
                  </button>
                ))}
              </div>
              {isLoading && <div className="text-center py-8"><div className="chakra-spinner mx-auto mb-4" /><p className="text-lg text-muted-foreground">Processing payment...</p></div>}
            </div>
          )}

          {step === "success" && (
            <div className="text-center">
              <div className="w-28 h-28 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-14 h-14 text-success" />
              </div>
              <h2 className="font-heading text-4xl font-bold text-success mb-2">Payment Successful! 🎉</h2>
              <p className="text-lg text-muted-foreground mb-8">Your electricity bill has been paid successfully</p>
              <div className="receipt mx-auto mb-8 text-left">
                <div className="text-center border-b border-dashed border-gray-300 pb-3 mb-3">
                  <p className="font-bold">DIGITAL SUVIDHA KIOSK</p><p className="text-xs">Government of India</p>
                </div>
                <div className="space-y-1 text-xs">
                  {[["Transaction ID:", txnId], ["Date & Time:", new Date().toLocaleString()], ["Consumer No:", billData.consumerNumber], ["Provider:", billData.provider]].map(([k, v]) => (
                    <div key={k} className="flex justify-between"><span>{k}</span><span>{v}</span></div>
                  ))}
                  <div className="flex justify-between font-bold border-t border-dashed border-gray-300 pt-2 mt-2">
                    <span>Amount Paid:</span><span>₹{billData.amount}</span>
                  </div>
                </div>
                <div className="text-center border-t border-dashed border-gray-300 pt-3 mt-3">
                  <p className="text-xs">Thank you for using Digital Suvidha!</p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="h-14 px-8 bg-secondary"><Printer className="w-5 h-5 mr-2" /> Print Receipt</Button>
                <Button variant="outline" className="h-14 px-8" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
              </div>
            </div>
          )}
        </div>
      </KioskLayout>
    </PageTransition>
  );
}
