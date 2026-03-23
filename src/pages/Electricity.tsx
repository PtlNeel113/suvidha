import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Zap,
  QrCode,
  CreditCard,
  CheckCircle2,
  Lightbulb,
  Printer,
  ArrowRight,
  Download,
  MapPin
} from "lucide-react";
import KioskLayout from "@/components/layout/KioskLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Confetti from "@/components/effects/Confetti";
import PageTransition from "@/components/effects/PageTransition";
import { useUser } from "@/contexts/UserContext";
import { LocationPicker } from "@/components/common/LocationPicker";

type Step = "input" | "review" | "payment" | "success";

export default function Electricity() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [step, setStep] = useState<Step>("input");
  const [consumerNumber, setConsumerNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState("");

  // Mock bill data
  const billData = {
    consumerName: "Ramesh Kumar Patel",
    consumerNumber: "GUV123456789",
    provider: "GUVNL - Gujarat",
    amount: 1245,
    dueDate: "15 Feb 2026",
    units: 186,
    previousReading: 4521,
    currentReading: 4707,
    billingPeriod: "Jan 2026",
  };

  const handleScan = () => {
    setIsLoading(true);
    setTimeout(() => {
      setConsumerNumber(billData.consumerNumber);
      setIsLoading(false);
      setStep("review");
    }, 1500);
  };

  const [showConfetti, setShowConfetti] = useState(false);

  // Trigger confetti when success
  const handlePaymentSuccess = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("success");
      setShowConfetti(true);
    }, 2000);
  };

  const handleReceiptDownload = () => {
    window.print();
  };

  return (
    <PageTransition>
      <KioskLayout
        showBackButton
        onBack={() => (step === "input" ? navigate("/") : setStep("input"))}
        title="Electricity Bill Payment"
      >
        <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />

        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Progress Steps */}
          <motion.div
            className="flex items-center justify-center gap-2 mb-10 print:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {["Enter Details", "Review Bill", "Payment", "Receipt"].map((label, idx) => {
              const stepIdx = ["input", "review", "payment", "success"].indexOf(step);
              const isActive = idx <= stepIdx;
              const isCurrent = idx === stepIdx;
              return (
                <div key={label} className="flex items-center">
                  <motion.div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${isCurrent
                        ? "bg-secondary text-secondary-foreground"
                        : isActive
                          ? "bg-success/20 text-success"
                          : "bg-muted text-muted-foreground"
                      }`}
                    animate={isCurrent ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 0.5, repeat: isCurrent ? Infinity : 0 }}
                  >
                    <span className="w-6 h-6 rounded-full bg-current/20 flex items-center justify-center text-sm font-bold">
                      {isActive && idx < stepIdx ? "✓" : idx + 1}
                    </span>
                    <span className="hidden md:inline text-sm font-medium">{label}</span>
                  </motion.div>
                  {idx < 3 && (
                    <ArrowRight className="w-5 h-5 mx-2 text-muted-foreground" />
                  )}
                </div>
              );
            })}
          </motion.div>

          {/* Step 1: Input */}
          {step === "input" && (
            <div className="govt-card max-w-2xl mx-auto animate-fade-in">
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-10 h-10 text-primary" />
                </div>
                <h2 className="font-heading text-2xl font-bold mb-2">
                  Pay Electricity Bill
                </h2>
                <p className="text-muted-foreground">
                  Scan QR code or enter your consumer number
                </p>
              </div>

              <div className="space-y-6">
                {/* QR Scan Button */}
                <button
                  onClick={handleScan}
                  disabled={isLoading}
                  className="w-full kiosk-btn kiosk-btn-primary flex items-center justify-center gap-4"
                >
                  {isLoading ? (
                    <div className="chakra-spinner" />
                  ) : (
                    <>
                      <QrCode className="w-8 h-8" />
                      <div className="text-left">
                        <span className="block font-heading font-bold text-lg">
                          Scan QR Code
                        </span>
                        <span className="text-sm opacity-80">
                          Hold your bill in front of camera
                        </span>
                      </div>
                    </>
                  )}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-card px-4 text-sm text-muted-foreground">
                      OR
                    </span>
                  </div>
                </div>

                {/* Manual Entry */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Consumer Number / Account ID
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter 12-digit consumer number"
                      value={consumerNumber}
                      onChange={(e) => setConsumerNumber(e.target.value)}
                      className="h-14 text-lg"
                    />
                  </div>

                  <Button
                    onClick={() => setStep("review")}
                    disabled={consumerNumber.length < 6}
                    className="w-full h-14 text-lg font-heading font-bold bg-success hover:bg-success/90"
                  >
                    Fetch Bill Details
                  </Button>
                </div>

                {/* Location Picker (New Feature) */}
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Verify Location (Optional)
                  </label>
                  <div className="flex gap-2">
                    <Input value={location} readOnly placeholder="Location not set" className="flex-1" />
                    <LocationPicker onLocationSelect={(loc) => setLocation(loc)} />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === "review" && (
            <div className="space-y-6 animate-fade-in">
              <div className="govt-card max-w-2xl mx-auto">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="font-heading text-xl font-bold">Bill Details</h2>
                    <p className="text-muted-foreground">{billData.provider}</p>
                  </div>
                  <span className="px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium">
                    Active Account
                  </span>
                </div>

                <div className="grid gap-4 mb-6">
                  <div className="flex justify-between py-3 border-b border-border bg-muted/20 px-4 -mx-4">
                    <span className="text-muted-foreground">Payer Name</span>
                    <span className="font-heading font-bold text-lg text-primary">{user?.name || "Guest User"}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Consumer Name</span>
                    <span className="font-medium">{billData.consumerName}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Consumer Number</span>
                    <span className="font-mono">{billData.consumerNumber}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Billing Period</span>
                    <span>{billData.billingPeriod}</span>
                  </div>
                  {location && (
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Location Verified</span>
                      <span className="text-sm truncate max-w-[200px]">{location}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Due Date</span>
                    <span className="text-destructive font-medium">{billData.dueDate}</span>
                  </div>
                </div>

                <div className="bg-secondary/5 rounded-xl p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Amount Payable</p>
                  <p className="font-heading text-4xl font-bold text-secondary">
                    ₹{billData.amount.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 max-w-2xl mx-auto">
                <Button
                  variant="outline"
                  className="flex-1 h-14 text-lg"
                  onClick={() => setStep("input")}
                >
                  Back
                </Button>
                <Button
                  className="flex-1 h-14 text-lg font-heading font-bold bg-success hover:bg-success/90"
                  onClick={() => setStep("payment")}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay ₹{billData.amount}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === "payment" && (
            <div className="govt-card max-w-2xl mx-auto animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="font-heading text-2xl font-bold mb-2">
                  Choose Payment Method
                </h2>
                <p className="text-muted-foreground">
                  Amount: <span className="font-bold text-secondary">₹{billData.amount}</span>
                </p>
              </div>

              <div className="grid gap-4 mb-8">
                {[
                  { icon: "📱", label: "UPI / Google Pay / PhonePe", desc: "Scan QR or enter UPI ID" },
                  { icon: "💳", label: "Debit / Credit Card", desc: "Visa, Mastercard, RuPay" },
                  { icon: "🏦", label: "Net Banking", desc: "All major banks supported" },
                  { icon: "💰", label: "Cash (Kiosk Deposit)", desc: "Insert cash in machine" },
                ].map((method) => (
                  <button
                    key={method.label}
                    onClick={handlePaymentSuccess}
                    disabled={isLoading}
                    className="kiosk-btn flex items-center gap-4 text-left"
                  >
                    <span className="text-3xl">{method.icon}</span>
                    <div>
                      <span className="block font-heading font-bold">{method.label}</span>
                      <span className="text-sm text-muted-foreground">{method.desc}</span>
                    </div>
                  </button>
                ))}
              </div>

              {isLoading && (
                <div className="text-center py-8">
                  <div className="chakra-spinner mx-auto mb-4" />
                  <p className="text-muted-foreground">Processing payment...</p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Success */}
          {step === "success" && (
            <div className="text-center animate-fade-in">
              <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6 print:hidden">
                <CheckCircle2 className="w-12 h-12 text-success" />
              </div>
              <h2 className="font-heading text-3xl font-bold text-success mb-2 print:hidden">
                Payment Successful! 🎉
              </h2>
              <p className="text-muted-foreground mb-8 print:hidden">
                Your electricity bill has been paid successfully
              </p>

              {/* Receipt */}
              <div id="receipt" className="receipt mx-auto mb-8 text-left max-w-sm bg-white p-6 border border-gray-200 shadow-sm print:shadow-none print:border-0 print:w-full print:max-w-none">
                <div className="text-center border-b border-dashed border-gray-300 pb-3 mb-3">
                  <p className="font-bold text-lg">DIGITAL SUVIDHA KIOSK</p>
                  <p className="text-sm text-muted-foreground">Government of India</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction ID:</span>
                    <span className="font-mono">TXN{Date.now().toString().slice(-8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payer:</span>
                    <span className="font-bold">{user?.name || "Guest"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Consumer No:</span>
                    <span>{billData.consumerNumber}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-dashed border-gray-300 pt-2 mt-2 text-base">
                    <span>Amount Paid:</span>
                    <span>₹{billData.amount}</span>
                  </div>
                </div>
                <div className="text-center border-t border-dashed border-gray-300 pt-3 mt-3">
                  <p className="text-xs text-muted-foreground">Computer generated receipt.</p>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4 print:hidden">
                <Button className="h-14 px-8 bg-secondary" onClick={() => window.print()}>
                  <Printer className="w-5 h-5 mr-2" />
                  Print Receipt
                </Button>
                <Button variant="outline" className="h-14 px-8" onClick={handleReceiptDownload}>
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF
                </Button>
                <Button variant="ghost" className="h-14 px-8" onClick={() => navigate("/")}>
                  Back to Home
                </Button>
              </div>
            </div>
          )}
        </div>
      </KioskLayout>
    </PageTransition>
  );
}
