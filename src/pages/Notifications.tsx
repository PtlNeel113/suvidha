import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import KioskLayout from "@/components/layout/KioskLayout";
import PageTransition from "@/components/effects/PageTransition";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Zap, Droplets, CheckCircle2, AlertCircle, ChevronRight, X } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export default function Notifications() {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const notifications = [
        {
            id: 1,
            type: "bill_due",
            icon: <Zap className="w-6 h-6 text-saffron" />,
            title: "Electricity Bill Due",
            message: "Your bill of ₹1,245 is due on 15 Feb. Pay now to avoid late fees.",
            time: "2 hours ago",
            action: "/electricity",
            actionText: "Pay Now",
            read: false
        },
        {
            id: 2,
            type: "success",
            icon: <CheckCircle2 className="w-6 h-6 text-success" />,
            title: "Complaint Resolved",
            message: "Your complaint regarding 'Pothole on MG Road' has been resolved by PWD.",
            time: "Yesterday",
            action: "/complaints",
            actionText: "View Details",
            read: true
        },
        {
            id: 3,
            type: "alert",
            icon: <Droplets className="w-6 h-6 text-blue-500" />,
            title: "Water Supply Maintenance",
            message: "Water supply will be interrupted tomorrow from 10 AM to 2 PM in your area.",
            time: "2 days ago",
            action: null,
            actionText: null,
            read: true
        }
    ];

    return (
        <PageTransition>
            <KioskLayout showBackButton onBack={() => navigate(-1)} title="Notifications">
                <div className="max-w-3xl mx-auto px-6 py-8">

                    <div className="flex items-center justify-between mb-6">
                        <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
                            <Bell className="w-6 h-6" /> Your Alerts
                        </h1>
                        <Button variant="ghost" className="text-sm text-muted-foreground">
                            Mark all as read
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {notifications.map((notif, index) => (
                            <motion.div
                                key={notif.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className={`p-5 flex gap-4 ${!notif.read ? 'bg-secondary/5 border-l-4 border-l-secondary' : 'opacity-80'}`}>
                                    <div className={`p-3 rounded-full h-fit flex-shrink-0 ${!notif.read ? 'bg-white' : 'bg-muted'}`}>
                                        {notif.icon}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-heading font-bold text-lg">{notif.title}</h3>
                                            <span className="text-xs text-muted-foreground">{notif.time}</span>
                                        </div>
                                        <p className="text-muted-foreground mb-3">{notif.message}</p>

                                        {notif.action && (
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="rounded-full"
                                                onClick={() => navigate(notif.action)}
                                            >
                                                {notif.actionText} <ChevronRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        )}
                                    </div>

                                    <button className="text-muted-foreground hover:text-foreground h-fit">
                                        <X className="w-4 h-4" />
                                    </button>
                                </Card>
                            </motion.div>
                        ))}

                        {notifications.length === 0 && (
                            <div className="text-center py-20 opacity-50">
                                <Bell className="w-16 h-16 mx-auto mb-4" />
                                <p>No new notifications</p>
                            </div>
                        )}
                    </div>

                </div>
            </KioskLayout>
        </PageTransition>
    );
}
