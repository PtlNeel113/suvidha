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
  Settings2,
  LogIn,
} from "lucide-react";
import KioskLayout from "@/components/layout/KioskLayout";
import ServiceTile from "@/components/home/ServiceTile";
import MetricCard from "@/components/home/MetricCard";
import { Button } from "@/components/ui/button";
import PageTransition, { StaggerContainer, StaggerItem } from "@/components/effects/PageTransition";

export default function Index() {
  const navigate = useNavigate();

  const utilityServices = [
    {
      icon: <Zap className="w-7 h-7" />,
      title: "Electricity",
      description: "Pay bill in 30 sec",
      color: "saffron" as const,
      path: "/electricity",
    },
    {
      icon: <Droplets className="w-7 h-7" />,
      title: "Water",
      description: "AMC/Municipal bill",
      color: "navy" as const,
      path: "/water",
    },
    {
      icon: <Flame className="w-7 h-7" />,
      title: "Gas",
      description: "Book LPG cylinder",
      color: "red" as const,
      path: "/gas",
    },
    {
      icon: <Trash2 className="w-7 h-7" />,
      title: "Waste",
      description: "Property tax & waste",
      color: "green" as const,
      path: "/waste",
    },
  ];

  const govtServices = [
    {
      icon: <FileText className="w-7 h-7" />,
      title: "Certificates",
      description: "Income, Caste, Domicile",
      color: "navy" as const,
      badge: "25+",
      path: "/certificates",
    },
    {
      icon: <Landmark className="w-7 h-7" />,
      title: "Schemes",
      description: "Check eligibility",
      color: "green" as const,
      badge: "500+",
      path: "/schemes",
    },
    {
      icon: <AlertTriangle className="w-7 h-7" />,
      title: "Complaints",
      description: "AI-verified grievance",
      color: "red" as const,
      path: "/complaints",
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: "Ration Card",
      description: "Apply or update",
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
      label: "Bills Paid Today",
      trend: "↑ 15% vs yesterday",
    },
    {
      icon: <FileText className="w-5 h-5" />,
      value: "43",
      label: "Certificates Issued",
      trend: "↑ 8% vs yesterday",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      value: "18 hrs",
      label: "Queue Time Saved",
    },
    {
      icon: <IndianRupee className="w-5 h-5" />,
      value: "₹2.4L",
      label: "Govt. Processing Saved",
    },
  ];

  return (
    <PageTransition>
      <KioskLayout>
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Quick Action Buttons */}
          <motion.div 
            className="flex justify-end gap-3 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="outline"
              onClick={() => navigate("/login")}
              className="flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2"
            >
              <Settings2 className="w-4 h-4" />
              Admin
            </Button>
          </motion.div>

          {/* Hero Section */}
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">
              Digital <span className="text-secondary">SUVIDHA</span> Kiosk
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              All government services at your fingertips. Pay bills, get certificates, 
              check scheme eligibility - in minutes, not days.
            </p>
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
              <h2 className="font-heading text-2xl font-bold">Utility Bills</h2>
              <span className="text-sm text-muted-foreground">Pay in 30 seconds</span>
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
              <h2 className="font-heading text-2xl font-bold">Government Services</h2>
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
              <h2 className="font-heading text-2xl font-bold">Quick Access</h2>
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

          {/* CTA Banner */}
          <motion.section 
            className="govt-card bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground p-8 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            whileHover={{ scale: 1.01 }}
          >
            <h2 className="font-heading text-2xl font-bold mb-2">
              First time here? 👋
            </h2>
            <p className="text-secondary-foreground/80 mb-6 max-w-xl mx-auto">
              Just tap the service you need. Our AI assistant Suvidha Tai will guide you 
              through every step - even in your local language!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button 
                className="kiosk-btn kiosk-btn-success px-8 py-4 rounded-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/schemes")}
              >
                <span className="font-heading font-bold">Check Scheme Eligibility</span>
              </motion.button>
              <motion.button 
                className="kiosk-btn kiosk-btn-warning px-8 py-4 rounded-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="font-heading font-bold">Talk to AI Assistant</span>
              </motion.button>
            </div>
          </motion.section>
        </div>
      </KioskLayout>
    </PageTransition>
  );
}
