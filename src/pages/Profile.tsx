import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import KioskLayout from "@/components/layout/KioskLayout";
import PageTransition from "@/components/effects/PageTransition";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { QRCodeSVG } from "qrcode.react";
import {
    User,
    Phone,
    CreditCard,
    Shield,
    LogOut,
    CheckCircle2,
    MapPin
} from "lucide-react";

export default function Profile() {
    const navigate = useNavigate();
    const { user, logout } = useUser();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (!user) {
        return (
            <KioskLayout title="Profile">
                <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
                    <h2 className="text-2xl font-heading font-bold mb-4">Please Login</h2>
                    <Button onClick={() => navigate("/login")}>Go to Login</Button>
                </div>
            </KioskLayout>
        );
    }

    return (
        <PageTransition>
            <KioskLayout title="My Profile">
                <div className="max-w-3xl mx-auto px-6 py-8">

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8"
                    >
                        {/* Digital ID Card */}
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl border border-slate-700">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/20 to-green-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                            <div className="relative p-8 mb-6">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-10">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                                            alt="Emblem"
                                            className="h-16 w-auto opacity-90"
                                        />
                                        <div>
                                            <h2 className="font-heading text-xl font-bold tracking-wide uppercase">Digital Suvidha Card</h2>
                                            <p className="text-xs text-slate-400 uppercase tracking-widest">Government of India</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                                        <span className="flex items-center gap-2 text-green-400 font-bold text-sm">
                                            <CheckCircle2 className="w-4 h-4" /> Verified Citizen
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="relative">
                                        <div className="w-32 h-32 rounded-2xl bg-gradient-to-b from-slate-200 to-slate-400 p-1">
                                            <div className="w-full h-full bg-slate-300 rounded-xl overflow-hidden flex items-center justify-center">
                                                <User className="w-16 h-16 text-slate-500" />
                                            </div>
                                        </div>
                                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-blue-600 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                            CITIZEN
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-4 w-full text-center md:text-left">
                                        <div>
                                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Name</p>
                                            <p className="text-2xl font-heading font-bold">{user.name}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Phone Number</p>
                                                <p className="text-lg font-mono tracking-wide">{user.phoneNumber}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Aadhaar (Last 4)</p>
                                                <p className="text-lg font-mono tracking-wide">XXXX XXXX {user.aadhaar.slice(-4)}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Address</p>
                                            <p className="text-sm text-slate-300 flex items-center justify-center md:justify-start gap-1">
                                                <MapPin className="w-3 h-3" /> Maninagar, Ahmedabad, Gujarat - 380008
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-white p-2 rounded-xl">
                                        <QRCodeSVG value={`SUVIDHA:${user.aadhaar}`} size={100} />
                                    </div>
                                </div>
                            </div>

                            {/* Footer Strip */}
                            <div className="bg-gradient-to-r from-orange-600 via-white to-green-600 h-2 w-full" />
                        </div>
                    </motion.div>

                    {/* Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline" className="h-14 justify-start gap-4 text-lg" onClick={() => navigate("/dashboard")}>
                            <CreditCard className="w-5 h-5 text-blue-600" />
                            View Benefit History
                        </Button>
                        <Button variant="outline" className="h-14 justify-start gap-4 text-lg">
                            <Shield className="w-5 h-5 text-green-600" />
                            Privacy Settings
                        </Button>
                        <Button
                            variant="destructive"
                            className="h-14 justify-start gap-4 text-lg col-span-1 md:col-span-2 mt-4"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-5 h-5" />
                            Secure Logout
                        </Button>
                    </div>

                </div>
            </KioskLayout>
        </PageTransition>
    );
}
