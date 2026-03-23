import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
} from "recharts";
import {
  AlertTriangle, CheckCircle2, Clock, Download, Filter, MapPin,
  Search, TrendingUp, Users, FileText, Eye, RefreshCw,
  LogOut, Shield, Bell, BarChart3, Settings, Home,
} from "lucide-react";
import PageTransition from "@/components/effects/PageTransition";

const mockComplaints = [
  { id: "CMP-2026-001", type: "Pothole", ward: "Ward 12", status: "pending", priority: "high", date: "2026-01-29", resolveTime: null, citizen: "Ramesh Kumar", location: "MG Road, Near Crossword" },
  { id: "CMP-2026-002", type: "Water Leakage", ward: "Ward 5", status: "in_progress", priority: "medium", date: "2026-01-28", resolveTime: null, citizen: "Priya Sharma", location: "SG Highway, Thaltej" },
  { id: "CMP-2026-003", type: "Street Light", ward: "Ward 8", status: "resolved", priority: "low", date: "2026-01-25", resolveTime: "48 hrs", citizen: "Abdul Rahman", location: "Navrangpura Area" },
  { id: "CMP-2026-004", type: "Garbage", ward: "Ward 12", status: "resolved", priority: "high", date: "2026-01-24", resolveTime: "24 hrs", citizen: "Meena Patel", location: "Paldi Junction" },
  { id: "CMP-2026-005", type: "Drainage", ward: "Ward 3", status: "escalated", priority: "high", date: "2026-01-20", resolveTime: null, citizen: "Vikram Singh", location: "Maninagar East" },
  { id: "CMP-2026-006", type: "Road Damage", ward: "Ward 15", status: "pending", priority: "medium", date: "2026-01-30", resolveTime: null, citizen: "Sunita Devi", location: "Satellite Road" },
  { id: "CMP-2026-007", type: "Illegal Parking", ward: "Ward 8", status: "pending", priority: "low", date: "2026-02-01", resolveTime: null, citizen: "Rajesh Gupta", location: "Law Garden" },
  { id: "CMP-2026-008", type: "Noise Pollution", ward: "Ward 3", status: "in_progress", priority: "medium", date: "2026-02-02", resolveTime: null, citizen: "Fatima Begum", location: "Jamalpur" },
];

const wardData = [
  { name: "W1", complaints: 45, resolved: 38, pending: 7 },
  { name: "W3", complaints: 62, resolved: 45, pending: 17 },
  { name: "W5", complaints: 38, resolved: 30, pending: 8 },
  { name: "W8", complaints: 55, resolved: 48, pending: 7 },
  { name: "W12", complaints: 78, resolved: 55, pending: 23 },
  { name: "W15", complaints: 42, resolved: 35, pending: 7 },
];

const resolutionTimeData = [
  { day: "Mon", avgTime: 36, target: 24 },
  { day: "Tue", avgTime: 28, target: 24 },
  { day: "Wed", avgTime: 42, target: 24 },
  { day: "Thu", avgTime: 24, target: 24 },
  { day: "Fri", avgTime: 32, target: 24 },
  { day: "Sat", avgTime: 48, target: 24 },
  { day: "Sun", avgTime: 56, target: 24 },
];

const monthlyTrend = [
  { month: "Aug", total: 180, resolved: 150 },
  { month: "Sep", total: 210, resolved: 175 },
  { month: "Oct", total: 195, resolved: 170 },
  { month: "Nov", total: 230, resolved: 200 },
  { month: "Dec", total: 260, resolved: 220 },
  { month: "Jan", total: 320, resolved: 265 },
];

const complaintTypeData = [
  { name: "Pothole", value: 35, color: "hsl(var(--destructive))" },
  { name: "Water", value: 25, color: "hsl(var(--accent))" },
  { name: "Garbage", value: 20, color: "hsl(var(--success))" },
  { name: "Light", value: 12, color: "hsl(var(--primary))" },
  { name: "Other", value: 8, color: "hsl(var(--muted-foreground))" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [wardFilter, setWardFilter] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);

  const filteredComplaints = mockComplaints.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.citizen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    const matchesWard = wardFilter === "all" || c.ward === wardFilter;
    return matchesSearch && matchesStatus && matchesWard;
  });

  const getStatusBadge = (status: string) => {
    const map: Record<string, { className: string; label: string }> = {
      pending: { className: "bg-primary/20 text-primary border-primary/30", label: "Pending" },
      in_progress: { className: "bg-accent/20 text-accent border-accent/30", label: "In Progress" },
      resolved: { className: "bg-success/20 text-success border-success/30", label: "Resolved" },
      escalated: { className: "bg-destructive/20 text-destructive border-destructive/30", label: "Escalated" },
    };
    const s = map[status] || { className: "", label: status };
    return <Badge className={s.className}>{s.label}</Badge>;
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === "high") return <AlertTriangle className="w-4 h-4 text-destructive" />;
    if (priority === "medium") return <Clock className="w-4 h-4 text-primary" />;
    return <CheckCircle2 className="w-4 h-4 text-success" />;
  };

  const stats = {
    total: mockComplaints.length,
    pending: mockComplaints.filter((c) => c.status === "pending").length,
    resolved: mockComplaints.filter((c) => c.status === "resolved").length,
    escalated: mockComplaints.filter((c) => c.status === "escalated").length,
    avgResolutionTime: "32 hrs",
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Admin Header - Separate from citizen UI */}
        <div className="tricolor-bar" />
        <header className="bg-gradient-to-r from-secondary via-secondary to-accent text-secondary-foreground px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-heading text-xl font-bold">SUVIDHA Admin Panel</h1>
                <p className="text-sm opacity-80">Government Administration Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-secondary-foreground hover:bg-secondary-foreground/10 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-secondary-foreground hover:bg-secondary-foreground/10">
                <Home className="w-4 h-4 mr-2" /> Kiosk View
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="text-secondary-foreground hover:bg-secondary-foreground/10">
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </div>
          </div>
        </header>

        <motion.div
          className="max-w-7xl mx-auto p-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Stats Cards */}
          <motion.div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6" variants={itemVariants}>
            {[
              { icon: <FileText className="w-5 h-5" />, value: stats.total, label: "Total", color: "secondary" },
              { icon: <Clock className="w-5 h-5" />, value: stats.pending, label: "Pending", color: "primary" },
              { icon: <CheckCircle2 className="w-5 h-5" />, value: stats.resolved, label: "Resolved", color: "success" },
              { icon: <AlertTriangle className="w-5 h-5" />, value: stats.escalated, label: "Escalated", color: "destructive" },
              { icon: <TrendingUp className="w-5 h-5" />, value: stats.avgResolutionTime, label: "Avg. Resolution", color: "accent" },
            ].map((stat, idx) => (
              <motion.div key={idx} whileHover={{ y: -2, scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className={`p-4 bg-gradient-to-br from-${stat.color}/10 to-${stat.color}/5 border-${stat.color}/20`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${stat.color}/20 text-${stat.color}`}>{stat.icon}</div>
                    <div>
                      <p className={`text-2xl font-bold text-${stat.color}`}>{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Charts Row */}
          <motion.div className="grid md:grid-cols-3 gap-6 mb-6" variants={itemVariants}>
            <Card className="p-4 md:col-span-2">
              <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-secondary" /> Ward-wise Complaints
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={wardData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Bar dataKey="resolved" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-4">
              <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-secondary" /> By Category
              </h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={complaintTypeData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {complaintTypeData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Resolution & Monthly Trend */}
          <motion.div className="grid md:grid-cols-2 gap-6 mb-6" variants={itemVariants}>
            <Card className="p-4">
              <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-secondary" /> Resolution Time (hrs)
              </h3>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={resolutionTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Line type="monotone" dataKey="avgTime" stroke="hsl(var(--secondary))" strokeWidth={3} dot={{ fill: "hsl(var(--secondary))", r: 4 }} />
                  <Line type="monotone" dataKey="target" stroke="hsl(var(--success))" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-4">
              <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-secondary" /> Monthly Trend
              </h3>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Area type="monotone" dataKey="total" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary)/0.2)" strokeWidth={2} />
                  <Area type="monotone" dataKey="resolved" stroke="hsl(var(--success))" fill="hsl(var(--success)/0.2)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Complaints Table */}
          <motion.div variants={itemVariants}>
            <Card className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h3 className="font-heading font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-secondary" /> All Complaints
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 w-52" />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-36"><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="escalated">Escalated</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={wardFilter} onValueChange={setWardFilter}>
                    <SelectTrigger className="w-36"><MapPin className="w-4 h-4 mr-2" /><SelectValue placeholder="Ward" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Wards</SelectItem>
                      <SelectItem value="Ward 3">Ward 3</SelectItem>
                      <SelectItem value="Ward 5">Ward 5</SelectItem>
                      <SelectItem value="Ward 8">Ward 8</SelectItem>
                      <SelectItem value="Ward 12">Ward 12</SelectItem>
                      <SelectItem value="Ward 15">Ward 15</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon"><RefreshCw className="w-4 h-4" /></Button>
                  <Button className="bg-success hover:bg-success/90"><Download className="w-4 h-4 mr-2" />Export</Button>
                </div>
              </div>

              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Ward</TableHead>
                      <TableHead>Citizen</TableHead>
                      <TableHead className="hidden md:table-cell">Location</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Resolution</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {filteredComplaints.map((complaint, index) => (
                        <motion.tr
                          key={complaint.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.03 }}
                          className={`border-b cursor-pointer ${selectedComplaint === complaint.id ? "bg-secondary/10" : "hover:bg-muted/50"}`}
                          onClick={() => setSelectedComplaint(complaint.id)}
                        >
                          <TableCell className="font-mono text-sm font-medium">{complaint.id}</TableCell>
                          <TableCell>{complaint.type}</TableCell>
                          <TableCell>{complaint.ward}</TableCell>
                          <TableCell>{complaint.citizen}</TableCell>
                          <TableCell className="max-w-[200px] truncate hidden md:table-cell">{complaint.location}</TableCell>
                          <TableCell>{getPriorityIcon(complaint.priority)}</TableCell>
                          <TableCell>{getStatusBadge(complaint.status)}</TableCell>
                          <TableCell className="hidden md:table-cell">{complaint.resolveTime || <span className="text-muted-foreground">—</span>}</TableCell>
                          <TableCell><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Admin Footer */}
        <footer className="bg-secondary/5 border-t border-border px-6 py-3 mt-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
            <span>SUVIDHA Admin Panel v2.0</span>
            <span>Last synced: Just now</span>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}
