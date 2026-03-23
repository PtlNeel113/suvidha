import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend,
} from "recharts";
import {
  AlertTriangle, CheckCircle2, Clock, Download, Filter, MapPin,
  Search, TrendingUp, Users, FileText, Eye, RefreshCw,
  LogOut, Shield, Bell, BarChart3, Home, Zap, Droplets, Flame,
  MonitorSmartphone, Activity, IndianRupee, Wifi, WifiOff,
  CircleAlert, ArrowUpRight, ArrowDownRight, Trash2, Award,
  FileCheck, Landmark, Heart, GraduationCap, ChevronRight,
} from "lucide-react";
import PageTransition from "@/components/effects/PageTransition";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AdminNotificationsTab from "@/components/admin/AdminNotificationsTab";

type Complaint = {
  id: string;
  complaint_number: string;
  citizen_name: string;
  type: string;
  description: string;
  ward: string;
  location: string | null;
  priority: string;
  status: string;
  ai_fraud_score: number | null;
  created_at: string;
  resolved_at: string | null;
};

type Transaction = {
  id: string;
  citizen_name: string;
  service_type: string;
  amount: number;
  status: string;
  provider: string | null;
  reference_id: string | null;
  ward: string | null;
  created_at: string;
};

type Kiosk = {
  id: string;
  kiosk_id: string;
  location: string;
  ward: string;
  status: string;
  total_transactions: number;
  last_active_at: string | null;
};

type CertApp = {
  id: string;
  application_number: string;
  citizen_name: string;
  certificate_type: string;
  status: string;
  ward: string | null;
  created_at: string;
};

type SchemeApp = {
  id: string;
  application_number: string;
  citizen_name: string;
  scheme_name: string;
  eligibility_status: string;
  amount: number | null;
  ward: string | null;
  created_at: string;
};

type Analytics = {
  ward: string | null;
  bills_paid: number;
  certificates_issued: number;
  complaints_filed: number;
  complaints_resolved: number;
  schemes_applied: number;
  revenue: number;
  avg_queue_time_saved: number;
};

const statusColors: Record<string, string> = {
  pending: "bg-primary/20 text-primary",
  in_progress: "bg-accent/20 text-accent",
  resolved: "bg-success/20 text-success",
  escalated: "bg-destructive/20 text-destructive",
  rejected: "bg-muted text-muted-foreground",
  submitted: "bg-primary/20 text-primary",
  under_review: "bg-accent/20 text-accent",
  approved: "bg-success/20 text-success",
  ready_for_collection: "bg-success/30 text-success",
  checking: "bg-primary/20 text-primary",
  eligible: "bg-accent/20 text-accent",
  not_eligible: "bg-destructive/20 text-destructive",
  disbursed: "bg-success/20 text-success",
  completed: "bg-success/20 text-success",
  processing: "bg-accent/20 text-accent",
  failed: "bg-destructive/20 text-destructive",
  online: "bg-success/20 text-success",
  offline: "bg-destructive/20 text-destructive",
  maintenance: "bg-primary/20 text-primary",
  critical: "bg-destructive/20 text-destructive",
};

const priorityIcons: Record<string, JSX.Element> = {
  critical: <CircleAlert className="w-4 h-4 text-destructive" />,
  high: <AlertTriangle className="w-4 h-4 text-destructive" />,
  medium: <Clock className="w-4 h-4 text-primary" />,
  low: <CheckCircle2 className="w-4 h-4 text-success" />,
};

const complaintTypeColors = [
  "hsl(var(--destructive))", "hsl(var(--accent))", "hsl(var(--success))",
  "hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--muted-foreground))",
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [kiosks, setKiosks] = useState<Kiosk[]>([]);
  const [certApps, setCertApps] = useState<CertApp[]>([]);
  const [schemeApps, setSchemeApps] = useState<SchemeApp[]>([]);
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [wardFilter, setWardFilter] = useState("all");
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [cRes, tRes, kRes, certRes, schRes, aRes] = await Promise.all([
      supabase.from("complaints").select("*").order("created_at", { ascending: false }),
      supabase.from("transactions").select("*").order("created_at", { ascending: false }),
      supabase.from("kiosks").select("*").order("kiosk_id"),
      supabase.from("certificate_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("scheme_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("daily_analytics").select("*").order("date", { ascending: false }),
    ]);
    if (cRes.data) setComplaints(cRes.data);
    if (tRes.data) setTransactions(tRes.data);
    if (kRes.data) setKiosks(kRes.data);
    if (certRes.data) setCertApps(certRes.data);
    if (schRes.data) setSchemeApps(schRes.data);
    if (aRes.data) setAnalytics(aRes.data);
    setLoading(false);
    setLastRefresh(new Date());
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Realtime subscription for complaints
  useEffect(() => {
    const channel = supabase
      .channel("admin-complaints")
      .on("postgres_changes", { event: "*", schema: "public", table: "complaints" }, () => fetchAll())
      .on("postgres_changes", { event: "*", schema: "public", table: "transactions" }, () => fetchAll())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchAll]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    await supabase.from("complaints").update({
      status: newStatus,
      updated_at: new Date().toISOString(),
      ...(newStatus === "resolved" ? { resolved_at: new Date().toISOString() } : {}),
      ...(newStatus === "escalated" ? { escalated_at: new Date().toISOString() } : {}),
    }).eq("id", id);
    fetchAll();
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  // Compute stats
  const totalRevenue = transactions.reduce((s, t) => s + Number(t.amount), 0);
  const todayTxns = transactions.filter(t => new Date(t.created_at).toDateString() === new Date().toDateString());
  const todayRevenue = todayTxns.reduce((s, t) => s + Number(t.amount), 0);
  const pendingComplaints = complaints.filter(c => c.status === "pending").length;
  const resolvedComplaints = complaints.filter(c => c.status === "resolved").length;
  const escalatedComplaints = complaints.filter(c => c.status === "escalated").length;
  const fraudAlerts = complaints.filter(c => (c.ai_fraud_score || 0) > 0.7).length;
  const onlineKiosks = kiosks.filter(k => k.status === "online").length;

  // Ward chart data
  const wardChartData = analytics
    .filter(a => a.ward && new Date().toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10))
    .reduce((acc, a) => {
      const existing = acc.find(x => x.ward === a.ward);
      if (existing) { existing.bills += a.bills_paid; existing.certs += a.certificates_issued; existing.complaints += a.complaints_filed; existing.revenue += Number(a.revenue); }
      else acc.push({ ward: a.ward || "Unknown", bills: a.bills_paid, certs: a.certificates_issued, complaints: a.complaints_filed, revenue: Number(a.revenue) });
      return acc;
    }, [] as { ward: string; bills: number; certs: number; complaints: number; revenue: number }[]);

  // Complaint type distribution
  const complaintTypeData = complaints.reduce((acc, c) => {
    const existing = acc.find(x => x.name === c.type);
    if (existing) existing.value++;
    else acc.push({ name: c.type, value: 1 });
    return acc;
  }, [] as { name: string; value: number }[]);

  // Service type distribution
  const serviceTypeData = transactions.reduce((acc, t) => {
    const existing = acc.find(x => x.name === t.service_type);
    if (existing) { existing.count++; existing.revenue += Number(t.amount); }
    else acc.push({ name: t.service_type, count: 1, revenue: Number(t.amount) });
    return acc;
  }, [] as { name: string; count: number; revenue: number }[]);

  // Filtered complaints
  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.complaint_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.citizen_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.location || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    const matchesWard = wardFilter === "all" || c.ward === wardFilter;
    return matchesSearch && matchesStatus && matchesWard;
  });

  const wards = [...new Set(complaints.map(c => c.ward))].sort();

  const metricCards = [
    { icon: <IndianRupee className="w-6 h-6" />, value: `₹${todayRevenue.toLocaleString()}`, label: "Today's Revenue", trend: "+12%", up: true, color: "success" },
    { icon: <Zap className="w-6 h-6" />, value: todayTxns.length, label: "Today's Transactions", trend: "+8%", up: true, color: "secondary" },
    { icon: <FileText className="w-6 h-6" />, value: complaints.length, label: "Total Complaints", trend: `${pendingComplaints} pending`, up: false, color: "primary" },
    { icon: <AlertTriangle className="w-6 h-6" />, value: escalatedComplaints, label: "Escalated", trend: "72hr rule", up: false, color: "destructive" },
    { icon: <Shield className="w-6 h-6" />, value: fraudAlerts, label: "AI Fraud Alerts", trend: "Auto-flagged", up: false, color: "destructive" },
    { icon: <MonitorSmartphone className="w-6 h-6" />, value: `${onlineKiosks}/${kiosks.length}`, label: "Kiosks Online", trend: "Live status", up: true, color: "accent" },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <div className="tricolor-bar" />
        
        {/* Admin Header */}
        <header className="bg-gradient-to-r from-secondary via-secondary to-accent text-secondary-foreground px-6 py-4 sticky top-0 z-40">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="SUVIDHA" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h1 className="font-heading text-xl font-bold">SUVIDHA Admin Panel</h1>
                <p className="text-xs opacity-80">Government Administration • Real-Time Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5 text-xs">
                <Activity className="w-3 h-3 text-success animate-pulse" />
                <span>Live • Updated {lastRefresh.toLocaleTimeString()}</span>
              </div>
              <Button variant="ghost" size="icon" className="text-secondary-foreground hover:bg-white/10 relative" onClick={fetchAll}>
                <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" className="text-secondary-foreground hover:bg-white/10 relative">
                <Bell className="w-5 h-5" />
                {pendingComplaints > 0 && <span className="absolute top-0 right-0 w-5 h-5 bg-destructive rounded-full text-[10px] flex items-center justify-center">{pendingComplaints}</span>}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="text-secondary-foreground hover:bg-white/10">
                <Home className="w-4 h-4 mr-1" /> Kiosk
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-secondary-foreground hover:bg-white/10">
                <LogOut className="w-4 h-4 mr-1" /> Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-[1400px] mx-auto p-6">
          {/* Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {metricCards.map((m, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-xl bg-${m.color}/10 text-${m.color}`}>{m.icon}</div>
                    <span className={`text-xs flex items-center gap-0.5 ${m.up ? "text-success" : "text-muted-foreground"}`}>
                      {m.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {m.trend}
                    </span>
                  </div>
                  <p className="font-heading text-2xl font-bold">{m.value}</p>
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 flex-wrap h-auto gap-1">
              <TabsTrigger value="overview" className="gap-1.5"><BarChart3 className="w-4 h-4" /> Overview</TabsTrigger>
              <TabsTrigger value="complaints" className="gap-1.5"><AlertTriangle className="w-4 h-4" /> Complaints</TabsTrigger>
              <TabsTrigger value="transactions" className="gap-1.5"><IndianRupee className="w-4 h-4" /> Transactions</TabsTrigger>
              <TabsTrigger value="certificates" className="gap-1.5"><FileCheck className="w-4 h-4" /> Certificates</TabsTrigger>
              <TabsTrigger value="schemes" className="gap-1.5"><Landmark className="w-4 h-4" /> Schemes</TabsTrigger>
              <TabsTrigger value="kiosks" className="gap-1.5"><MonitorSmartphone className="w-4 h-4" /> Kiosks</TabsTrigger>
              <TabsTrigger value="notifications" className="gap-1.5"><Bell className="w-4 h-4" /> Notifications</TabsTrigger>
            </TabsList>

            {/* OVERVIEW TAB */}
            <TabsContent value="overview">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <Card className="p-5 md:col-span-2">
                  <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-secondary" /> Ward-wise Performance
                  </h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={wardChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="ward" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
                      <Legend />
                      <Bar dataKey="bills" name="Bills Paid" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="certs" name="Certificates" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="complaints" name="Complaints" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-5">
                  <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-secondary" /> Complaint Types
                  </h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie data={complaintTypeData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                        {complaintTypeData.map((_, i) => <Cell key={i} fill={complaintTypeColors[i % complaintTypeColors.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card className="p-5">
                  <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" /> Revenue by Service
                  </h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={serviceTypeData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" fontSize={12} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                      <YAxis type="category" dataKey="name" fontSize={12} width={80} />
                      <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
                      <Bar dataKey="revenue" fill="hsl(var(--secondary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                {/* AI Fraud Detection */}
                <Card className="p-5">
                  <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-destructive" /> AI Fraud Detection
                  </h3>
                  <div className="space-y-3">
                    {complaints.filter(c => (c.ai_fraud_score || 0) > 0.5).slice(0, 4).map(c => (
                      <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-destructive/5 border border-destructive/15">
                        <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-destructive" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{c.citizen_name} • {c.complaint_number}</p>
                          <p className="text-xs text-muted-foreground">{c.type} — Fraud Score: {((c.ai_fraud_score || 0) * 100).toFixed(0)}%</p>
                        </div>
                        <Badge className="bg-destructive/20 text-destructive">⚠️ Flagged</Badge>
                      </div>
                    ))}
                    {complaints.filter(c => (c.ai_fraud_score || 0) > 0.5).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-success" />
                        <p>No fraud alerts detected</p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="p-5">
                <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-accent" /> Recent Activity Feed
                </h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {[...transactions.slice(0, 5).map(t => ({
                    time: new Date(t.created_at).toLocaleTimeString(),
                    text: `${t.citizen_name} paid ₹${Number(t.amount).toLocaleString()} for ${t.service_type}`,
                    icon: <IndianRupee className="w-4 h-4" />, color: "success",
                  })),
                  ...complaints.slice(0, 3).map(c => ({
                    time: new Date(c.created_at).toLocaleTimeString(),
                    text: `${c.citizen_name} filed ${c.type} complaint in ${c.ward}`,
                    icon: <AlertTriangle className="w-4 h-4" />, color: "primary",
                  })),
                  ...certApps.slice(0, 2).map(c => ({
                    time: new Date(c.created_at).toLocaleTimeString(),
                    text: `${c.citizen_name} applied for ${c.certificate_type} certificate`,
                    icon: <FileText className="w-4 h-4" />, color: "accent",
                  }))].sort(() => Math.random() - 0.5).map((item, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                      <div className={`p-2 rounded-lg bg-${item.color}/10 text-${item.color}`}>{item.icon}</div>
                      <div className="flex-1"><p className="text-sm">{item.text}</p></div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* COMPLAINTS TAB */}
            <TabsContent value="complaints">
              <Card className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                  <h3 className="font-heading text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-secondary" /> Complaint Management ({complaints.length})
                  </h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 w-48" />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-36"><Filter className="w-4 h-4 mr-2" /><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="escalated">Escalated</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={wardFilter} onValueChange={setWardFilter}>
                      <SelectTrigger className="w-36"><MapPin className="w-4 h-4 mr-2" /><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Wards</SelectItem>
                        {wards.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" onClick={fetchAll}><RefreshCw className="w-4 h-4" /></Button>
                    <Button className="bg-success hover:bg-success/90"><Download className="w-4 h-4 mr-2" />Export</Button>
                  </div>
                </div>

                <div className="rounded-xl border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Ward</TableHead>
                        <TableHead>Citizen</TableHead>
                        <TableHead className="hidden md:table-cell">Location</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Fraud</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredComplaints.map((c) => (
                        <TableRow key={c.id} className="hover:bg-muted/30">
                          <TableCell className="font-mono text-xs">{c.complaint_number}</TableCell>
                          <TableCell className="font-medium">{c.type}</TableCell>
                          <TableCell>{c.ward}</TableCell>
                          <TableCell>{c.citizen_name}</TableCell>
                          <TableCell className="max-w-[150px] truncate hidden md:table-cell text-muted-foreground">{c.location}</TableCell>
                          <TableCell>{priorityIcons[c.priority] || priorityIcons.medium}</TableCell>
                          <TableCell>
                            <span className={`text-xs font-mono ${(c.ai_fraud_score || 0) > 0.7 ? "text-destructive font-bold" : "text-muted-foreground"}`}>
                              {((c.ai_fraud_score || 0) * 100).toFixed(0)}%
                            </span>
                          </TableCell>
                          <TableCell><Badge className={statusColors[c.status] || ""}>{c.status.replace("_", " ")}</Badge></TableCell>
                          <TableCell>
                            <Select onValueChange={(v) => handleStatusChange(c.id, v)}>
                              <SelectTrigger className="w-28 h-8 text-xs"><SelectValue placeholder="Action" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="in_progress">Start Work</SelectItem>
                                <SelectItem value="resolved">Resolve</SelectItem>
                                <SelectItem value="escalated">Escalate</SelectItem>
                                <SelectItem value="rejected">Reject</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>

            {/* TRANSACTIONS TAB */}
            <TabsContent value="transactions">
              <Card className="p-5">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-heading text-lg font-semibold flex items-center gap-2">
                    <IndianRupee className="w-5 h-5 text-secondary" /> Transaction History ({transactions.length})
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-sm">Total: ₹{totalRevenue.toLocaleString()}</Badge>
                    <Button className="bg-success hover:bg-success/90" size="sm"><Download className="w-4 h-4 mr-1" />Export</Button>
                  </div>
                </div>
                <div className="rounded-xl border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Reference</TableHead>
                        <TableHead>Citizen</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Ward</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map(t => (
                        <TableRow key={t.id} className="hover:bg-muted/30">
                          <TableCell className="font-mono text-xs">{t.reference_id}</TableCell>
                          <TableCell className="font-medium">{t.citizen_name}</TableCell>
                          <TableCell><Badge variant="outline" className="capitalize">{t.service_type}</Badge></TableCell>
                          <TableCell className="font-bold">₹{Number(t.amount).toLocaleString()}</TableCell>
                          <TableCell className="text-muted-foreground">{t.provider}</TableCell>
                          <TableCell>{t.ward}</TableCell>
                          <TableCell><Badge className={statusColors[t.status] || ""}>{t.status}</Badge></TableCell>
                          <TableCell className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>

            {/* CERTIFICATES TAB */}
            <TabsContent value="certificates">
              <Card className="p-5">
                <h3 className="font-heading text-lg font-semibold flex items-center gap-2 mb-5">
                  <FileCheck className="w-5 h-5 text-secondary" /> Certificate Applications ({certApps.length})
                </h3>
                <div className="rounded-xl border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Application No</TableHead>
                        <TableHead>Citizen</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Ward</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Applied</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {certApps.map(c => (
                        <TableRow key={c.id} className="hover:bg-muted/30">
                          <TableCell className="font-mono text-xs">{c.application_number}</TableCell>
                          <TableCell className="font-medium">{c.citizen_name}</TableCell>
                          <TableCell><Badge variant="outline" className="capitalize">{c.certificate_type}</Badge></TableCell>
                          <TableCell>{c.ward}</TableCell>
                          <TableCell><Badge className={statusColors[c.status] || ""}>{c.status.replace("_", " ")}</Badge></TableCell>
                          <TableCell className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Select onValueChange={async (v) => {
                              await supabase.from("certificate_applications").update({ status: v, updated_at: new Date().toISOString() }).eq("id", c.id);
                              fetchAll();
                            }}>
                              <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="Update" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="under_review">Review</SelectItem>
                                <SelectItem value="approved">Approve</SelectItem>
                                <SelectItem value="ready_for_collection">Ready</SelectItem>
                                <SelectItem value="rejected">Reject</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>

            {/* SCHEMES TAB */}
            <TabsContent value="schemes">
              <Card className="p-5">
                <h3 className="font-heading text-lg font-semibold flex items-center gap-2 mb-5">
                  <Landmark className="w-5 h-5 text-secondary" /> Scheme Applications ({schemeApps.length})
                </h3>
                <div className="rounded-xl border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Application No</TableHead>
                        <TableHead>Citizen</TableHead>
                        <TableHead>Scheme</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Ward</TableHead>
                        <TableHead>Eligibility</TableHead>
                        <TableHead>Applied</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schemeApps.map(s => (
                        <TableRow key={s.id} className="hover:bg-muted/30">
                          <TableCell className="font-mono text-xs">{s.application_number}</TableCell>
                          <TableCell className="font-medium">{s.citizen_name}</TableCell>
                          <TableCell><Badge variant="outline">{s.scheme_name}</Badge></TableCell>
                          <TableCell className="font-bold">{s.amount ? `₹${Number(s.amount).toLocaleString()}` : "—"}</TableCell>
                          <TableCell>{s.ward}</TableCell>
                          <TableCell><Badge className={statusColors[s.eligibility_status] || ""}>{s.eligibility_status.replace("_", " ")}</Badge></TableCell>
                          <TableCell className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>

            {/* KIOSKS TAB */}
            <TabsContent value="kiosks">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {kiosks.map(k => (
                  <motion.div key={k.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="p-5 hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${k.status === "online" ? "bg-success/10" : k.status === "maintenance" ? "bg-primary/10" : "bg-destructive/10"}`}>
                            <MonitorSmartphone className={`w-6 h-6 ${k.status === "online" ? "text-success" : k.status === "maintenance" ? "text-primary" : "text-destructive"}`} />
                          </div>
                          <div>
                            <p className="font-heading font-bold">{k.kiosk_id}</p>
                            <p className="text-xs text-muted-foreground">{k.location}</p>
                          </div>
                        </div>
                        <Badge className={statusColors[k.status]}>
                          {k.status === "online" ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
                          {k.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-2 bg-muted/50 rounded-xl">
                          <p className="font-bold text-lg">{k.total_transactions}</p>
                          <p className="text-[10px] text-muted-foreground">Transactions</p>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded-xl">
                          <p className="font-bold text-lg">{k.ward}</p>
                          <p className="text-[10px] text-muted-foreground">Ward</p>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded-xl">
                          <p className="font-bold text-lg">{k.status === "online" ? "✅" : "⚠️"}</p>
                          <p className="text-[10px] text-muted-foreground">Health</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* NOTIFICATIONS TAB */}
            <TabsContent value="notifications">
              <AdminNotificationsTab
                complaints={complaints}
                transactions={transactions}
                certApps={certApps}
                schemeApps={schemeApps}
                onStatusChange={handleStatusChange}
              />
            </TabsContent>
          </Tabs>
        </div>

        <footer className="bg-secondary/5 border-t border-border px-6 py-3 mt-6">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between text-sm text-muted-foreground">
            <span>SUVIDHA Admin v3.0 • Government of India</span>
            <span>Real-time data • Last synced: {lastRefresh.toLocaleTimeString()}</span>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}
