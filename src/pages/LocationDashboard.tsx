import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import KioskLayout from "@/components/layout/KioskLayout";
import PageTransition from "@/components/effects/PageTransition";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  MapPin, AlertTriangle, Trophy, Bus, MessageSquare,
  Sun, Zap, Droplets, Navigation, Clock, Phone,
  Shield, Heart, Wifi, WifiOff, Bell, ChevronRight,
  Hospital, Fuel, Users, TrendingUp, Building2,
  Thermometer, Wind, CloudRain,
} from "lucide-react";

// Mock data
const emergencyNumbers = [
  { icon: <Phone className="w-4 h-4" />, number: "108", label: "🚑 Ambulance", color: "destructive" as const },
  { icon: <Shield className="w-4 h-4" />, number: "100", label: "🚨 Police", color: "destructive" as const },
  { icon: <AlertTriangle className="w-4 h-4" />, number: "101", label: "🔥 Fire", color: "destructive" as const },
];

const nearbyServices = [
  { icon: <Hospital className="w-5 h-5" />, name: "Civil Hospital", distance: "1.2 km", type: "Hospital" },
  { icon: <Fuel className="w-5 h-5" />, name: "Indian Oil Pump", distance: "800m", type: "Petrol" },
  { icon: <Building2 className="w-5 h-5" />, name: "SBI Branch", distance: "500m", type: "Bank" },
  { icon: <Building2 className="w-5 h-5" />, name: "Post Office", distance: "350m", type: "Post" },
];

const wardLeaderboard = [
  { ward: "Ward 8", score: 92, rank: 1, trend: "↑", bills: 24 },
  { ward: "Ward 3", score: 88, rank: 2, trend: "↑", bills: 19 },
  { ward: "Ward 12", score: 85, rank: 3, trend: "↓", bills: 22 },
  { ward: "Ward 5", score: 78, rank: 4, trend: "↑", bills: 15 },
  { ward: "Ward 15", score: 72, rank: 5, trend: "↓", bills: 11 },
];

const alerts = [
  { id: 1, type: "warning", message: "Water supply cut in Ward 8 (2PM-6PM)", time: "30 min ago" },
  { id: 2, type: "alert", message: "Heavy rain expected tomorrow", time: "1 hr ago" },
  { id: 3, type: "info", message: "New PM Awas applications open", time: "2 hrs ago" },
];

const predictiveAlerts = [
  { icon: <Zap className="w-5 h-5" />, title: "Power Cut Expected", detail: "Ward 8 • In 38 minutes", severity: "high" },
  { icon: <CloudRain className="w-5 h-5" />, title: "Heavy Rain Alert", detail: "Today 4PM-8PM", severity: "medium" },
  { icon: <Droplets className="w-5 h-5" />, title: "Water Maintenance", detail: "Tomorrow 6AM-10AM", severity: "low" },
];

export default function LocationDashboard() {
  const navigate = useNavigate();
  const [location, setLocation] = useState({ area: "Maninagar", city: "Ahmedabad", ward: "Ward 8" });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [sosActive, setSosActive] = useState(false);
  const [sosTimer, setSosTimer] = useState(0);
  const [sosInterval, setSosIntervalState] = useState<NodeJS.Timeout | null>(null);
  const [weather] = useState({ temp: 34, condition: "Partly Cloudy", humidity: 65, wind: 12 });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleSOSStart = () => {
    setSosTimer(0);
    const interval = setInterval(() => {
      setSosTimer((prev) => {
        if (prev >= 3) {
          clearInterval(interval);
          setSosActive(true);
          return 3;
        }
        return prev + 1;
      });
    }, 1000);
    setSosIntervalState(interval);
  };

  const handleSOSRelease = () => {
    if (sosInterval) clearInterval(sosInterval);
    if (sosTimer < 3) {
      setSosTimer(0);
    }
  };

  const queueData = {
    counter: { wait: "25 min", people: 12 },
    kiosk: { wait: "2 min", people: 1 },
  };

  return (
    <PageTransition>
      <KioskLayout title="📍 Location Dashboard">
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          {/* Location Header with Weather */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <MapPin className="w-6 h-6 text-secondary-foreground" />
              </motion.div>
              <div>
                <h2 className="font-heading text-2xl font-bold">
                  📍 {location.area}, {location.city}
                </h2>
                <p className="text-muted-foreground text-sm flex items-center gap-2">
                  {location.ward} •{" "}
                  {isOnline ? (
                    <span className="flex items-center gap-1 text-success"><Wifi className="w-3 h-3" /> Online</span>
                  ) : (
                    <span className="flex items-center gap-1 text-destructive"><WifiOff className="w-3 h-3" /> Offline</span>
                  )}
                </p>
              </div>
            </div>

            {/* Weather */}
            <div className="flex items-center gap-4 bg-card rounded-2xl px-5 py-3 border border-border">
              <div className="flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-destructive" />
                <span className="font-heading text-xl font-bold">{weather.temp}°C</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center gap-1"><Sun className="w-3 h-3" /> {weather.condition}</div>
                <div className="flex items-center gap-1"><Wind className="w-3 h-3" /> {weather.wind} km/h</div>
              </div>
            </div>
          </motion.div>

          {/* Emergency Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-destructive/10 border-2 border-destructive/30 rounded-2xl p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="font-heading font-bold text-destructive">EMERGENCY</span>
                {emergencyNumbers.map((em) => (
                  <motion.a
                    key={em.number}
                    href={`tel:${em.number}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive text-destructive-foreground font-bold text-sm"
                  >
                    {em.label} {em.number}
                  </motion.a>
                ))}
              </div>

              {/* SOS Button */}
              <motion.button
                onMouseDown={handleSOSStart}
                onMouseUp={handleSOSRelease}
                onTouchStart={handleSOSStart}
                onTouchEnd={handleSOSRelease}
                whileTap={{ scale: 0.95 }}
                className={`relative w-16 h-16 rounded-full font-heading font-bold text-sm ${sosActive
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-destructive/20 text-destructive border-2 border-destructive"
                  }`}
              >
                {sosActive ? "SENT!" : "SOS"}
                {sosTimer > 0 && sosTimer < 3 && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-destructive"
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.3, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.button>
            </div>
            <p className="text-xs text-destructive/70 mt-2">Hold SOS for 3 seconds to alert police + family via WhatsApp</p>
          </motion.div>

          {/* Active Alerts */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="p-4">
              <h3 className="font-heading font-semibold flex items-center gap-2 mb-3">
                <Bell className="w-5 h-5 text-primary" /> Active Alerts
              </h3>
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className={`flex items-center justify-between p-3 rounded-xl text-sm ${alert.type === "warning" ? "bg-primary/10 border border-primary/20" :
                      alert.type === "alert" ? "bg-destructive/10 border border-destructive/20" :
                        "bg-accent/10 border border-accent/20"
                      }`}
                  >
                    <span className="font-medium">{alert.message}</span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{alert.time}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Main Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Ward Leaderboard */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="p-4 h-full">
                <h3 className="font-heading font-semibold flex items-center gap-2 mb-4">
                  <Trophy className="w-5 h-5 text-primary" /> Ward Leaderboard
                </h3>
                <div className="space-y-3">
                  {wardLeaderboard.map((ward) => (
                    <div key={ward.ward} className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${ward.rank === 1 ? "bg-primary text-primary-foreground" :
                        ward.rank === 2 ? "bg-secondary text-secondary-foreground" :
                          ward.rank === 3 ? "bg-accent text-accent-foreground" :
                            "bg-muted text-muted-foreground"
                        }`}>
                        {ward.rank === 1 ? "🥇" : ward.rank === 2 ? "🥈" : ward.rank === 3 ? "🥉" : `#${ward.rank}`}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{ward.ward}</span>
                          <span className="text-xs text-muted-foreground">{ward.score}% Clean {ward.trend}</span>
                        </div>
                        <Progress value={ward.score} className="h-2" />
                      </div>
                      <Badge variant="outline" className="text-xs">{ward.bills} bills</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Local Updates */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <Card className="p-4 h-full">
                <h3 className="font-heading font-semibold flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-accent" /> Local Updates
                </h3>
                <div className="space-y-3">
                  {predictiveAlerts.map((alert, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      className={`flex items-center gap-3 p-3 rounded-xl border ${alert.severity === "high" ? "border-destructive/30 bg-destructive/5" :
                        alert.severity === "medium" ? "border-primary/30 bg-primary/5" :
                          "border-accent/30 bg-accent/5"
                        }`}
                    >
                      <div className={`p-2 rounded-lg ${alert.severity === "high" ? "bg-destructive/20 text-destructive" :
                        alert.severity === "medium" ? "bg-primary/20 text-primary" :
                          "bg-accent/20 text-accent"
                        }`}>{alert.icon}</div>
                      <div>
                        <p className="font-medium text-sm">{alert.title}</p>
                        <p className="text-xs text-muted-foreground">{alert.detail}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Queue Predictor */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="p-4 h-full">
                <h3 className="font-heading font-semibold flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-success" /> Queue Predictor
                </h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">🏛️ Government Counter</span>
                      <Badge variant="outline" className="text-destructive border-destructive/30">{queueData.counter.people} people</Badge>
                    </div>
                    <p className="text-2xl font-heading font-bold text-destructive">{queueData.counter.wait}</p>
                    <p className="text-xs text-muted-foreground">Estimated wait time</p>
                  </div>

                  <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">📱 Digital Kiosk</span>
                      <Badge variant="outline" className="text-success border-success/30">{queueData.kiosk.people} person</Badge>
                    </div>
                    <p className="text-2xl font-heading font-bold text-success">{queueData.kiosk.wait}</p>
                    <p className="text-xs text-muted-foreground">Save 23 minutes!</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>



          {/* Nearest Services & Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Nearest Map */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
              <Card className="p-4">
                <h3 className="font-heading font-semibold flex items-center gap-2 mb-4">
                  <Navigation className="w-5 h-5 text-secondary" /> Nearest Services
                </h3>
                <div className="space-y-3">
                  {nearbyServices.map((service, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ x: 4 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-secondary/10 text-secondary">{service.icon}</div>
                        <div>
                          <p className="font-medium text-sm">{service.name}</p>
                          <p className="text-xs text-muted-foreground">{service.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{service.distance}</Badge>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Quick Action Orbs */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
              <Card className="p-4">
                <h3 className="font-heading font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: <Bus className="w-6 h-6" />, label: "Bus/Metro QR", path: "/bus-pass", color: "bg-secondary" },
                    { icon: <MessageSquare className="w-6 h-6" />, label: "Ward Chat", path: "/ward-chat", color: "bg-success" },
                    { icon: <Heart className="w-6 h-6" />, label: "Health Card", path: "/health", color: "bg-destructive" },
                    { icon: <Sun className="w-6 h-6" />, label: "Solar Scheme", path: "/schemes", color: "bg-primary" },
                    { icon: <Users className="w-6 h-6" />, label: "Municipal Chat", path: "/municipal", color: "bg-accent" },
                    { icon: <Zap className="w-6 h-6" />, label: "Pay Bills", path: "/electricity", color: "bg-secondary" },
                  ].map((action, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => navigate(action.path)}
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border hover:border-secondary/30 transition-colors"
                    >
                      <div className={`w-12 h-12 rounded-full ${action.color} text-white flex items-center justify-center`}>
                        {action.icon}
                      </div>
                      <span className="text-xs font-medium text-center">{action.label}</span>
                    </motion.button>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center gap-4"
          >
            <Button
              size="lg"
              onClick={() => navigate("/")}
              className="bg-secondary hover:bg-secondary/90 min-h-[56px] px-8"
            >
              🏠 All Services
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/schemes")}
              className="min-h-[56px] px-8"
            >
              🏛️ Check Schemes
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/complaints")}
              className="min-h-[56px] px-8"
            >
              📝 File Complaint
            </Button>
          </motion.div>
        </div>
      </KioskLayout>
    </PageTransition>
  );
}
