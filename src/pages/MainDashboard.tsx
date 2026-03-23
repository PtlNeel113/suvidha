import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Zap,
    Droplets,
    Flame,
    Trash2,
    FileText,
    Landmark,
    Users,
    AlertTriangle,
    Wallet,
    Shield,
    GraduationCap,
    Heart,
    Clock,
    CheckCircle2,
    IndianRupee,
    User,
    Bell,
    LogOut,
    MapPin,
    ChevronRight,
    Search,
} from "lucide-react";
import KioskLayout from "@/components/layout/KioskLayout";
import ServiceTile from "@/components/home/ServiceTile";
import MetricCard from "@/components/home/MetricCard";
import { Button } from "@/components/ui/button";
import PageTransition, { StaggerContainer, StaggerItem } from "@/components/effects/PageTransition";
import { useUser } from "@/contexts/UserContext";
import { useLanguage } from "@/hooks/useLanguage";

export default function MainDashboard() {
    const navigate = useNavigate();
    const { user, logout } = useUser();
    const { t } = useLanguage();

    const utilityServices = [
        {
            icon: <Zap className="w-7 h-7" />,
            title: t("electricity"),
            description: t("electricity_desc"),
            color: "saffron" as const,
            path: "/electricity",
        },
        {
            icon: <Droplets className="w-7 h-7" />,
            title: t("water"),
            description: t("water_desc"),
            color: "navy" as const,
            path: "/water",
        },
        {
            icon: <Flame className="w-7 h-7" />,
            title: t("gas"),
            description: t("gas_desc"),
            color: "red" as const,
            path: "/gas",
        },
        {
            icon: <Trash2 className="w-7 h-7" />,
            title: t("waste"),
            description: t("waste_desc"),
            color: "green" as const,
            path: "/waste",
        },
    ];

    const govtServices = [
        {
            icon: <FileText className="w-7 h-7" />,
            title: t("certificates"),
            description: t("certificates_desc"),
            color: "navy" as const,
            badge: "25+",
            path: "/certificates",
        },
        {
            icon: <Landmark className="w-7 h-7" />,
            title: t("schemes"),
            description: t("schemes_desc"),
            color: "green" as const,
            badge: "500+",
            path: "/schemes",
        },
        {
            icon: <AlertTriangle className="w-7 h-7" />,
            title: t("complaints"),
            description: t("complaints_desc"),
            color: "red" as const,
            path: "/complaints",
        },
        {
            icon: <Users className="w-7 h-7" />,
            title: t("ration_card"),
            description: t("ration_desc"),
            color: "saffron" as const,
            path: "/ration",
        },
    ];

    const additionalServices = [
        {
            icon: <Wallet className="w-6 h-6" />,
            title: "PM Kisan",
            color: "green" as const,
            path: "/pm-kisan",
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Ayushman",
            color: "navy" as const,
            path: "/ayushman",
        },
        {
            icon: <GraduationCap className="w-6 h-6" />,
            title: "Scholarships",
            color: "purple" as const,
            path: "/scholarships",
        },
        {
            icon: <Heart className="w-6 h-6" />,
            title: "Pension",
            color: "saffron" as const,
            path: "/pension",
        },
    ];

    const metrics = [
        {
            icon: <CheckCircle2 className="w-5 h-5" />,
            value: "247",
            label: t("bills_paid_today"),
            trend: "↑ 15% vs yesterday",
        },
        {
            icon: <FileText className="w-5 h-5" />,
            value: "43",
            label: t("certificates_issued"),
            trend: "↑ 8% vs yesterday",
        },
        {
            icon: <Clock className="w-5 h-5" />,
            value: "18 hrs",
            label: t("queue_saved"),
        },
        {
            icon: <IndianRupee className="w-5 h-5" />,
            value: "₹2.4L",
            label: t("processing_saved"),
        },
    ];

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <PageTransition>
            <KioskLayout>
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Header Section with Profile & Logout */}
                    <motion.div
                        className="flex justify-between items-center mb-10"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div>
                            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-2">
                                {t("namaste")}, <span className="text-secondary">{user?.name || "Citizen"}!</span> 🙏
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                {t("welcome_message")}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <div className="relative">
                                <Button variant="outline" size="icon" className="rounded-full w-12 h-12">
                                    <Bell className="w-5 h-5 text-slate-600" />
                                </Button>
                                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => navigate("/profile")}
                                className="flex items-center gap-2 h-12 rounded-full px-6"
                            >
                                <User className="w-5 h-5" />
                                {t("profile")}
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={handleLogout}
                                className="flex items-center gap-2 h-12 rounded-full px-4 text-destructive hover:bg-destructive/10"
                            >
                                <LogOut className="w-5 h-5" />
                            </Button>
                        </div>
                    </motion.div>

                    {/* Live Metrics */}
                    <StaggerContainer staggerDelay={0.1}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                            {metrics.map((metric, idx) => (
                                <StaggerItem key={idx}>
                                    <MetricCard {...metric} />
                                </StaggerItem>
                            ))}
                        </div>
                    </StaggerContainer>

                    {/* Utility Bills Section */}
                    <motion.section
                        className="mb-10"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-1 h-8 bg-primary rounded-full" />
                            <h2 className="font-heading text-2xl font-bold">{t("utility_bills")}</h2>
                            <span className="text-sm text-muted-foreground">{t("pay_bill")}</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {utilityServices.map((service, idx) => (
                                <motion.div
                                    key={service.title}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 + idx * 0.1 }}
                                    whileHover={{ scale: 1.03, y: -5 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <ServiceTile
                                        {...service}
                                        onClick={() => navigate(service.path)}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Government Services Section */}
                    <motion.section
                        className="mb-10"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-1 h-8 bg-secondary rounded-full" />
                            <h2 className="font-heading text-2xl font-bold">{t("govt_services")}</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {govtServices.map((service, idx) => (
                                <motion.div
                                    key={service.title}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.6 + idx * 0.1 }}
                                    whileHover={{ scale: 1.03, y: -5 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <ServiceTile
                                        {...service}
                                        size="large"
                                        onClick={() => navigate(service.path)}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Quick Access */}
                    <motion.section
                        className="mb-10"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                    >
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-1 h-8 bg-success rounded-full" />
                            <h2 className="font-heading text-2xl font-bold">{t("quick_access")}</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {additionalServices.map((service, idx) => (
                                <motion.div
                                    key={service.title}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.8 + idx * 0.1 }}
                                    whileHover={{ scale: 1.03, y: -5 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <ServiceTile
                                        {...service}
                                        onClick={() => navigate(service.path)}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Location Dashboard Banner */}
                    <motion.section
                        className="govt-card bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-3xl relative overflow-hidden cursor-pointer"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.9, duration: 0.5 }}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => navigate("/location-dashboard")}
                    >
                        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 mix-blend-overlay" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-left">
                                <h2 className="font-heading text-2xl font-bold mb-2">
                                    📍 {t("view_dashboard")}
                                </h2>
                                <p className="text-blue-100 max-w-xl">
                                    {t("location_dashboard_desc")}
                                </p>
                            </div>
                            <Button className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 h-12 rounded-xl">
                                {t("open_dashboard")}
                            </Button>
                        </div>
                    </motion.section>
                </div>
            </KioskLayout>
        </PageTransition>
    );
}
