import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import KioskLayout from "@/components/layout/KioskLayout";
import PageTransition from "@/components/effects/PageTransition";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import {
  MapPin, AlertTriangle, Trophy, Sun, Zap, Droplets, Navigation, Clock,
  Shield, Heart, Wifi, WifiOff, Bell, ChevronRight,
  Hospital, Fuel, Building2, Users, TrendingUp,
  Thermometer, CloudRain, LocateFixed,
  FileText, Landmark, Wallet, GraduationCap, Flame, Trash2,
  LogOut, Sparkles, ArrowRight, Phone, User,
} from "lucide-react";

const emergencyNumbers = [
  { number: "108", label: "🚑 Ambulance", color: "bg-destructive" },
  { number: "100", label: "🚨 Police", color: "bg-secondary" },
  { number: "101", label: "🔥 Fire", color: "bg-primary" },
];

const nearbyServices = [
  { icon: <Hospital className="w-6 h-6" />, name: "Civil Hospital", distance: "1.2 km", type: "Hospital" },
  { icon: <Fuel className="w-6 h-6" />, name: "Indian Oil Pump", distance: "800m", type: "Petrol" },
  { icon: <Building2 className="w-6 h-6" />, name: "SBI Branch", distance: "500m", type: "Bank" },
  { icon: <Building2 className="w-6 h-6" />, name: "Post Office", distance: "350m", type: "Post" },
];

const wardLeaderboard = [
  { ward: "Ward 8", score: 92, rank: 1, trend: "↑", bills: 24 },
  { ward: "Ward 3", score: 88, rank: 2, trend: "↑", bills: 19 },
  { ward: "Ward 12", score: 85, rank: 3, trend: "↓", bills: 22 },
];

const alerts = [
  { id: 1, type: "warning", icon: "⚡", message: "Water supply cut in Ward 8 (2PM-6PM)", time: "30m" },
  { id: 2, type: "alert", icon: "🌧️", message: "Heavy rain expected tomorrow", time: "1h" },
  { id: 3, type: "info", icon: "🏠", message: "New PM Awas applications open", time: "2h" },
];

const predictiveAlerts = [
  { icon: <Zap className="w-6 h-6" />, title: "Power Cut Expected", detail: "Ward 8 • In 38 min", severity: "high" },
  { icon: <CloudRain className="w-6 h-6" />, title: "Heavy Rain Alert", detail: "Today 4PM-8PM", severity: "medium" },
  { icon: <Droplets className="w-6 h-6" />, title: "Water Maintenance", detail: "Tomorrow 6AM-10AM", severity: "low" },
];

const availableAreas = [
  { area: "Maninagar", city: "Ahmedabad", ward: "Ward 8" },
  { area: "Navrangpura", city: "Ahmedabad", ward: "Ward 3" },
  { area: "Satellite", city: "Ahmedabad", ward: "Ward 12" },
  { area: "Paldi", city: "Ahmedabad", ward: "Ward 5" },
  { area: "Borivali", city: "Mumbai", ward: "Ward 7" },
  { area: "Connaught Place", city: "Delhi", ward: "Ward 1" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { userName, logout } = useAuth();
  const [location, setLocation] = useState({ area: "Maninagar", city: "Ahmedabad", ward: "Ward 8" });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [sosActive, setSosActive] = useState(false);
  const [sosTimer, setSosTimer] = useState(0);
  const [sosInterval, setSosIntervalState] = useState<ReturnType<typeof setInterval> | null>(null);
  const [weather] = useState({ temp: 34, condition: "Partly Cloudy", humidity: 65 });
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  const handleDetectLocation = () => {
    setDetectingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => { const idx = Math.floor(Math.random() * availableAreas.length); setLocation(availableAreas[idx]); setDetectingLocation(false); setShowLocationPicker(false); },
        () => { setLocation(availableAreas[0]); setDetectingLocation(false); setShowLocationPicker(false); },
        { timeout: 5000 }
      );
    }
  };

  const handleSOSStart = () => {
    setSosTimer(0);
    const interval = setInterval(() => {
      setSosTimer((prev) => {
        if (prev >= 3) { clearInterval(interval); setSosActive(true); return 3; }
        return prev + 1;
      });
    }, 1000);
    setSosIntervalState(interval);
  };

  const handleSOSRelease = () => {
    if (sosInterval) clearInterval(sosInterval);
    if (sosTimer < 3) setSosTimer(0);
  };

  const handleLogout = () => { logout(); navigate("/"); };

  const getGreeting = () => {
    const h = currentTime.getHours();
    if (h < 12) return "🌅 " + t("app_title");
    if (h < 17) return "☀️ " + t("app_title");
    return "🌙 " + t("app_title");
  };

  const serviceGrid = [
    { icon: <Zap className="w-8 h-8" />, label: t("electricity"), path: "/electricity", gradient: "from-amber-500 to-orange-600", desc: t("pay_in_30sec") },
    { icon: <Droplets className="w-8 h-8" />, label: t("water"), path: "/water", gradient: "from-blue-500 to-cyan-600", desc: t("amc_bill") },
    { icon: <Flame className="w-8 h-8" />, label: t("gas"), path: "/gas", gradient: "from-red-500 to-rose-600", desc: t("book_lpg") },
    { icon: <Trash2 className="w-8 h-8" />, label: t("waste"), path: "/waste", gradient: "from-emerald-500 to-green-600", desc: t("property_tax") },
    { icon: <FileText className="w-8 h-8" />, label: t("certificates"), path: "/certificates", gradient: "from-indigo-500 to-blue-600", desc: t("income_caste") },
    { icon: <Landmark className="w-8 h-8" />, label: t("schemes"), path: "/schemes", gradient: "from-teal-500 to-emerald-600", desc: t("check_eligibility") },
    { icon: <AlertTriangle className="w-8 h-8" />, label: t("complaints"), path: "/complaints", gradient: "from-orange-500 to-red-600", desc: t("ai_grievance") },
    { icon: <Users className="w-8 h-8" />, label: t("ration_card"), path: "/schemes", gradient: "from-violet-500 to-purple-600", desc: t("apply_update") },
    { icon: <Wallet className="w-8 h-8" />, label: t("pm_kisan"), path: "/pm-kisan", gradient: "from-green-500 to-lime-600", desc: "₹6000/year" },
    { icon: <Heart className="w-8 h-8" />, label: t("ayushman"), path: "/ayushman", gradient: "from-pink-500 to-rose-600", desc: "₹5L cover" },
    { icon: <GraduationCap className="w-8 h-8" />, label: t("scholarships"), path: "/schemes", gradient: "from-sky-500 to-blue-600", desc: t("apply_update") },
    { icon: <Shield className="w-8 h-8" />, label: t("pension"), path: "/pension", gradient: "from-slate-500 to-gray-600", desc: t("apply_update") },
  ];

  // Location picker overlay
  if (showLocationPicker) {
    return (
      <PageTransition>
        <KioskLayout>
          <div className="max-w-xl mx-auto px-4 py-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                <MapPin className="w-12 h-12 text-secondary" />
              </div>
              <h2 className="font-heading text-3xl font-bold mb-2">{t("choose_location")}</h2>
            </motion.div>
            <motion.button onClick={handleDetectLocation} disabled={detectingLocation} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full p-6 mb-4 rounded-2xl border-2 border-success/30 hover:border-success bg-gradient-to-r from-success/5 to-success/10 transition-all flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-success flex items-center justify-center text-success-foreground">
                <LocateFixed className="w-8 h-8" />
              </div>
              <div className="text-left">
                <p className="font-heading font-bold text-xl">{t("use_live_location")}</p>
                <p className="text-base text-muted-foreground">{detectingLocation ? t("detecting_location") : "Auto-detect GPS"}</p>
              </div>
            </motion.button>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center"><span className="bg-background px-3 text-base text-muted-foreground">{t("select_area")}</span></div>
            </div>
            <div className="grid gap-3">
              {availableAreas.map((area, idx) => (
                <motion.button key={idx} onClick={() => { setLocation(area); setShowLocationPicker(false); }}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} whileHover={{ x: 4 }}
                  className="w-full p-5 rounded-xl border-2 border-border hover:border-secondary/50 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-secondary" />
                    <div className="text-left">
                      <p className="font-medium text-lg">{area.area}, {area.city}</p>
                      <p className="text-sm text-muted-foreground">{area.ward}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 h-14 text-lg" onClick={() => setShowLocationPicker(false)}>← {t("back")}</Button>
          </div>
        </KioskLayout>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <KioskLayout>
        <div className="max-w-7xl mx-auto px-4 py-5 space-y-6">

          {/* Welcome Banner - Senior Friendly with larger text */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary via-secondary/95 to-accent p-6 md:p-8 text-secondary-foreground">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-accent/20 blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-success/10 blur-3xl translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <motion.div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 cursor-pointer"
                  animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }}
                  onClick={() => navigate("/profile")}>
                  <img src="/logo.png" alt="SUVIDHA" className="w-16 h-16 rounded-xl object-contain bg-white p-1" />
                </motion.div>
                <div>
                  <p className="text-lg opacity-90">{getGreeting()}</p>
                  <h1 className="font-heading text-3xl md:text-4xl font-bold">{userName || "Citizen"} 🙏</h1>
                  <div className="flex items-center gap-3 mt-2 text-base opacity-80">
                    <button onClick={() => setShowLocationPicker(true)} className="flex items-center gap-1.5 hover:opacity-100 transition-opacity">
                      <MapPin className="w-4 h-4" /> {location.area}, {location.city}
                    </button>
                    <span>•</span>
                    <span>{location.ward}</span>
                    <span>•</span>
                    {isOnline
                      ? <span className="flex items-center gap-1"><Wifi className="w-4 h-4" /> Online</span>
                      : <span className="flex items-center gap-1 text-destructive"><WifiOff className="w-4 h-4" /> Offline</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="lg" onClick={() => navigate("/profile")}
                  className="text-white/80 hover:text-white hover:bg-white/10 border border-white/15 rounded-xl h-14 px-5 text-base">
                  <User className="w-5 h-5 mr-2" /> Profile
                </Button>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/15">
                  <Thermometer className="w-5 h-5" />
                  <span className="font-bold text-2xl">{weather.temp}°</span>
                  <Sun className="w-5 h-5 text-primary" />
                </div>
                <Button variant="ghost" size="lg" onClick={handleLogout}
                  className="text-white/80 hover:text-white hover:bg-white/10 border border-white/15 rounded-xl h-14 px-5 text-base">
                  <LogOut className="w-5 h-5 mr-2" /> Logout
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Emergency Strip - Always visible, high contrast */}
          <div className="grid grid-cols-3 gap-3">
            {emergencyNumbers.map((em) => (
              <motion.a key={em.number} href={`tel:${em.number}`} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className={`flex items-center justify-center gap-3 p-4 rounded-2xl ${em.color} text-white font-bold text-lg shadow-lg transition-all`}>
                <span className="text-xl">{em.label}</span>
                <span className="text-2xl font-mono">{em.number}</span>
              </motion.a>
            ))}
          </div>

          {/* Services Grid - LARGE touch targets for seniors */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-2xl font-bold flex items-center gap-2">
                <Navigation className="w-6 h-6 text-secondary" /> {t("govt_services")}
              </h2>
              <Badge variant="outline" className="text-sm px-3 py-1">
                <Sparkles className="w-4 h-4 mr-1" /> 12 {t("govt_services")}
              </Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {serviceGrid.map((service, idx) => (
                <motion.button key={idx} onClick={() => navigate(service.path)}
                  whileHover={{ scale: 1.04, y: -4 }} whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.03 }}
                  className="group relative flex flex-col items-center gap-3 p-6 rounded-2xl bg-card border-2 border-border hover:border-secondary/50 transition-all shadow-sm hover:shadow-xl overflow-hidden min-h-[140px]">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-secondary/5 to-accent/5" />
                  <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} text-white flex items-center justify-center shadow-lg`}>
                    {service.icon}
                  </div>
                  <div className="relative text-center">
                    <span className="text-base font-bold leading-tight block">{service.label}</span>
                    <span className="text-xs text-muted-foreground mt-1 block">{service.desc}</span>
                  </div>
                  <ChevronRight className="absolute top-4 right-4 w-4 h-4 text-muted-foreground/30 group-hover:text-secondary transition-colors" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Live Alerts */}
          <Card className="p-5">
            <h3 className="font-heading text-xl font-semibold flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-primary" /> {t("alerts")}
            </h3>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <motion.div key={alert.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center gap-4 p-4 rounded-2xl text-base ${
                    alert.type === "warning" ? "bg-primary/8 border border-primary/15" :
                    alert.type === "alert" ? "bg-destructive/8 border border-destructive/15" :
                    "bg-accent/8 border border-accent/15"
                  }`}>
                  <span className="text-2xl">{alert.icon}</span>
                  <span className="flex-1 font-medium">{alert.message}</span>
                  <Badge variant="outline" className="text-sm shrink-0">{alert.time}</Badge>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Intelligence Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Ward Leaderboard */}
            <Card className="p-5">
              <h3 className="font-heading text-lg font-semibold flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-primary" /> {t("ward_leaderboard")}
              </h3>
              <div className="space-y-4">
                {wardLeaderboard.map((ward) => (
                  <div key={ward.ward} className="flex items-center gap-3">
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                      ward.rank === 1 ? "bg-primary text-primary-foreground" :
                      ward.rank === 2 ? "bg-secondary text-secondary-foreground" :
                      "bg-accent text-accent-foreground"
                    }`}>
                      {["🥇", "🥈", "🥉"][ward.rank - 1]}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-base">{ward.ward}</span>
                        <span className="text-sm text-muted-foreground">{ward.score}% {ward.trend}</span>
                      </div>
                      <Progress value={ward.score} className="h-2.5" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Predictive Alerts */}
            <Card className="p-5">
              <h3 className="font-heading text-lg font-semibold flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-accent" /> {t("predictive_alerts")}
              </h3>
              <div className="space-y-3">
                {predictiveAlerts.map((alert, idx) => (
                  <div key={idx} className={`flex items-center gap-4 p-4 rounded-2xl border ${
                    alert.severity === "high" ? "border-destructive/30 bg-destructive/5" :
                    alert.severity === "medium" ? "border-primary/30 bg-primary/5" :
                    "border-accent/30 bg-accent/5"
                  }`}>
                    <div className={`p-3 rounded-xl ${
                      alert.severity === "high" ? "bg-destructive/20 text-destructive" :
                      alert.severity === "medium" ? "bg-primary/20 text-primary" :
                      "bg-accent/20 text-accent"
                    }`}>{alert.icon}</div>
                    <div>
                      <p className="font-bold text-base">{alert.title}</p>
                      <p className="text-sm text-muted-foreground">{alert.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Nearby + Queue */}
            <Card className="p-5">
              <h3 className="font-heading text-lg font-semibold flex items-center gap-2 mb-4">
                <Navigation className="w-5 h-5 text-secondary" /> {t("nearest_services")}
              </h3>
              <div className="space-y-3 mb-5">
                {nearbyServices.map((service, idx) => (
                  <motion.div key={idx} whileHover={{ x: 3 }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary">{service.icon}</div>
                    <div className="flex-1">
                      <p className="font-medium text-base">{service.name}</p>
                      <p className="text-sm text-muted-foreground">{service.type}</p>
                    </div>
                    <Badge variant="outline" className="text-sm">{service.distance}</Badge>
                  </motion.div>
                ))}
              </div>
              <div className="border-t border-border pt-4">
                <h4 className="font-heading text-base font-semibold flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-success" /> {t("queue_predictor")}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-destructive/8 border border-destructive/15 text-center">
                    <p className="text-sm text-muted-foreground">🏛️ Counter</p>
                    <p className="font-heading font-bold text-2xl text-destructive">25 min</p>
                    <p className="text-sm text-muted-foreground">12 people</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-success/8 border border-success/15 text-center">
                    <p className="text-sm text-muted-foreground">📱 Kiosk</p>
                    <p className="font-heading font-bold text-2xl text-success">2 min</p>
                    <p className="text-sm text-success font-medium">Save 23 min! ✨</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* SOS Button - Fixed bottom for easy access */}
          <motion.button onMouseDown={handleSOSStart} onMouseUp={handleSOSRelease} onTouchStart={handleSOSStart} onTouchEnd={handleSOSRelease}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-5 rounded-2xl font-heading font-bold text-lg transition-all ${
              sosActive ? "bg-destructive text-destructive-foreground shadow-lg" : "bg-destructive/10 text-destructive border-2 border-dashed border-destructive/40 hover:border-destructive"
            }`}>
            {sosActive ? "✅ SOS SENT! Help is on the way." : `🆘 Hold 3 seconds for Emergency SOS ${sosTimer > 0 ? `(${3 - sosTimer}...)` : ""}`}
          </motion.button>
        </div>

        {/* NO AIAssistantEnhanced here - it's already in KioskLayout */}
      </KioskLayout>
    </PageTransition>
  );
}
