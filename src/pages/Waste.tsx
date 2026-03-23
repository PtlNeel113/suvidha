import { useState } from "react";
import { useNavigate } from "react-router-dom";
import KioskLayout from "@/components/layout/KioskLayout";
import PageTransition from "@/components/effects/PageTransition";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, CheckCircle2, ArrowRight, CreditCard, MapPin, Calendar, Truck } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import Confetti from "@/components/effects/Confetti";

export default function Waste() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [step, setStep] = useState<"home" | "pay" | "schedule" | "success">("home");
  const [showConfetti, setShowConfetti] = useState(false);

  const collectionSchedule = [
    { day: "Monday", type: "Dry Waste", time: "7:00 AM - 9:00 AM", status: "collected" },
    { day: "Wednesday", type: "Wet Waste", time: "7:00 AM - 9:00 AM", status: "upcoming" },
    { day: "Friday", type: "Mixed Waste", time: "7:00 AM - 9:00 AM", status: "upcoming" },
    { day: "Saturday", type: "E-Waste / Hazardous", time: "10:00 AM - 12:00 PM", status: "upcoming" },
  ];

  return (
    <PageTransition>
      <KioskLayout showBackButton onBack={() => step === "home" ? navigate("/dashboard") : setStep("home")} title={t("waste")}>
        <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-10 h-10 text-success" />
            </div>
            <h1 className="font-heading text-3xl font-bold mb-2">Waste Management</h1>
            <p className="text-muted-foreground">Property tax, waste collection schedule & complaints</p>
          </div>

          {step === "home" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Button onClick={() => setStep("pay")} className="h-20 text-lg bg-success hover:bg-success/90 flex flex-col gap-1">
                  <CreditCard className="w-6 h-6" /> Pay Property Tax
                </Button>
                <Button onClick={() => setStep("schedule")} variant="outline" className="h-20 text-lg flex flex-col gap-1">
                  <Calendar className="w-6 h-6" /> Collection Schedule
                </Button>
              </div>

              <Card className="p-6">
                <h3 className="font-heading font-bold mb-4 flex items-center gap-2"><Truck className="w-5 h-5" /> This Week's Schedule</h3>
                <div className="space-y-3">
                  {collectionSchedule.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                      <div>
                        <p className="font-medium">{item.day} - {item.type}</p>
                        <p className="text-sm text-muted-foreground">{item.time}</p>
                      </div>
                      <Badge className={item.status === "collected" ? "bg-success/20 text-success" : "bg-primary/20 text-primary"}>
                        {item.status === "collected" ? "✅ Done" : "⏳ Upcoming"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-r from-success/10 to-success/5 border-success/20">
                <h3 className="font-heading font-bold mb-2">♻️ Recycling Points Near You</h3>
                <div className="space-y-2">
                  {["Maninagar Recycling Center - 800m", "AMC Collection Point - 1.2 km", "E-Waste Drop-off - 2.5 km"].map((p, idx) => (
                    <p key={idx} className="text-sm flex items-center gap-2"><MapPin className="w-3 h-3 text-success" />{p}</p>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {step === "pay" && (
            <Card className="p-6 max-w-2xl mx-auto">
              <h2 className="font-heading text-xl font-bold mb-4">Property Tax Payment</h2>
              <div className="space-y-4">
                <Input placeholder="Property ID / Tax Number" className="h-12" />
                <Input placeholder="Owner Name" className="h-12" />
                <div className="p-4 bg-muted/50 rounded-xl">
                  <div className="flex justify-between"><span>Annual Tax:</span><span className="font-bold">₹4,500</span></div>
                  <div className="flex justify-between"><span>Waste Charges:</span><span className="font-bold">₹1,200</span></div>
                  <div className="flex justify-between border-t pt-2 mt-2"><span className="font-bold">Total:</span><span className="font-bold text-success">₹5,700</span></div>
                </div>
                <Button onClick={() => { setStep("success"); setShowConfetti(true); }} className="w-full h-14 text-lg bg-success hover:bg-success/90">
                  Pay ₹5,700 <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </Card>
          )}

          {step === "schedule" && (
            <Card className="p-6 max-w-2xl mx-auto">
              <h2 className="font-heading text-xl font-bold mb-4">Request Special Collection</h2>
              <div className="space-y-4">
                <Input placeholder="Address" className="h-12" />
                <Input placeholder="Type of Waste (e.g., E-waste, Construction)" className="h-12" />
                <Input placeholder="Preferred Date" type="date" className="h-12" />
                <Button className="w-full h-14 text-lg bg-secondary hover:bg-secondary/90">
                  Schedule Pickup <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </Card>
          )}

          {step === "success" && (
            <div className="text-center">
              <CheckCircle2 className="w-20 h-20 text-success mx-auto mb-4" />
              <h2 className="font-heading text-3xl font-bold text-success mb-2">Payment Successful! 🎉</h2>
              <p className="text-muted-foreground mb-6">Property tax of ₹5,700 paid</p>
              <Button variant="outline" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
            </div>
          )}
        </div>
      </KioskLayout>
    </PageTransition>
  );
}
