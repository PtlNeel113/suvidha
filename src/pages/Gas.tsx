import { useState } from "react";
import { useNavigate } from "react-router-dom";
import KioskLayout from "@/components/layout/KioskLayout";
import PageTransition from "@/components/effects/PageTransition";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Flame, CheckCircle2, ArrowRight, MapPin, Truck } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Confetti from "@/components/effects/Confetti";

export default function Gas() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { aadhaar, userName } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<"home" | "book" | "success">("home");
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const distributors = [
    { name: "Indane Gas Agency", distance: "1.5 km", price: "₹903", delivery: "2-3 days" },
    { name: "HP Gas Distributor", distance: "2.8 km", price: "₹903", delivery: "3-4 days" },
    { name: "Bharat Gas Point", distance: "3.2 km", price: "₹903", delivery: "2-3 days" },
  ];

  const handleBook = async () => {
    setIsLoading(true);
    const refId = `TXN-G-${Date.now().toString().slice(-6)}`;
    await supabase.from("transactions").insert({
      aadhaar_hash: aadhaar || "demo", citizen_name: userName || "Citizen",
      service_type: "gas", amount: 903, status: "completed",
      provider: "HP Gas", reference_id: refId, ward: "Ward 8",
    });
    setIsLoading(false);
    setStep("success");
    setShowConfetti(true);
    toast({ title: "✅ LPG Refill Booked!", description: `Ref: ${refId}` });
  };

  return (
    <PageTransition>
      <KioskLayout showBackButton onBack={() => step === "home" ? navigate("/dashboard") : setStep("home")} title={t("gas")}>
        <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <Flame className="w-12 h-12 text-destructive" />
            </div>
            <h1 className="font-heading text-3xl font-bold mb-2">LPG Gas Services</h1>
            <p className="text-lg text-muted-foreground">Book LPG refill, check subsidy, find dealers</p>
          </div>

          {step === "home" && (
            <div className="space-y-6">
              <Card className="p-6 bg-gradient-to-r from-destructive/10 to-destructive/5 border-destructive/20">
                <h3 className="font-heading font-bold text-xl mb-3">Your LPG Account</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[["HP Gas", "Provider"], ["₹903", "Refill Price"], ["₹200", "Subsidy/cyl"]].map(([v, l]) => (
                    <div key={l} className="text-center p-4 bg-card rounded-xl"><p className="font-bold text-xl">{v}</p><p className="text-sm text-muted-foreground">{l}</p></div>
                  ))}
                </div>
              </Card>
              <Button onClick={() => setStep("book")} className="w-full h-16 text-xl bg-destructive hover:bg-destructive/90">
                <Truck className="w-6 h-6 mr-2" /> Book LPG Refill
              </Button>
              <Card className="p-6">
                <h3 className="font-heading font-bold text-xl mb-4">Nearest Distributors</h3>
                <div className="space-y-3">
                  {distributors.map((d, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                      <div><p className="font-medium text-base">{d.name}</p><p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{d.distance} • Delivery: {d.delivery}</p></div>
                      <Badge variant="outline" className="text-base">{d.price}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {step === "book" && (
            <Card className="p-6 max-w-2xl mx-auto">
              <h2 className="font-heading text-xl font-bold mb-4">Book LPG Refill</h2>
              <div className="space-y-4">
                <Input placeholder="Consumer Number / LPG ID" className="h-14 text-lg" />
                <Input placeholder="Registered Mobile Number" className="h-14 text-lg" />
                <div className="p-5 bg-muted/50 rounded-xl">
                  <p className="text-base"><strong>Amount:</strong> ₹903 (₹200 subsidy applied)</p>
                  <p className="text-base"><strong>Delivery:</strong> 2-3 working days</p>
                </div>
                <Button onClick={handleBook} disabled={isLoading} className="w-full h-16 text-xl bg-success hover:bg-success/90">
                  {isLoading ? "Processing..." : <>Confirm Booking <ArrowRight className="w-5 h-5 ml-2" /></>}
                </Button>
              </div>
            </Card>
          )}

          {step === "success" && (
            <div className="text-center">
              <CheckCircle2 className="w-24 h-24 text-success mx-auto mb-4" />
              <h2 className="font-heading text-3xl font-bold text-success mb-2">Refill Booked! 🎉</h2>
              <p className="text-lg text-muted-foreground mb-2">Booking confirmed with HP Gas</p>
              <p className="text-muted-foreground mb-6">Expected delivery in 2-3 working days</p>
              <Button variant="outline" className="h-14 px-8" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
            </div>
          )}
        </div>
      </KioskLayout>
    </PageTransition>
  );
}
