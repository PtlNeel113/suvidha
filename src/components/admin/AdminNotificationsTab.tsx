import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertTriangle, CheckCircle2, CreditCard, FileCheck, Landmark,
  Search, Bell, BellOff, Clock, Filter, Shield, ChevronDown, ChevronUp,
  Eye, ExternalLink, ArrowUpRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Complaint {
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
}

interface Transaction {
  id: string;
  citizen_name: string;
  service_type: string;
  amount: number;
  status: string;
  provider: string | null;
  reference_id: string | null;
  ward: string | null;
  created_at: string;
}

interface CertApp {
  id: string;
  application_number: string;
  citizen_name: string;
  certificate_type: string;
  status: string;
  ward: string | null;
  created_at: string;
}

interface SchemeApp {
  id: string;
  application_number: string;
  citizen_name: string;
  scheme_name: string;
  eligibility_status: string;
  amount: number | null;
  ward: string | null;
  created_at: string;
}

type NotifCategory = "all" | "complaint" | "payment" | "certificate" | "scheme" | "fraud";

interface UnifiedNotification {
  id: string;
  category: "complaint" | "payment" | "certificate" | "scheme" | "fraud";
  title: string;
  message: string;
  citizen: string;
  ward: string;
  severity: "info" | "warning" | "critical" | "success";
  timestamp: string;
  status: string;
  rawId: string;
}

const severityConfig = {
  info: { color: "bg-primary/10 text-primary border-primary/20", icon: Bell },
  warning: { color: "bg-accent/10 text-accent border-accent/20", icon: AlertTriangle },
  critical: { color: "bg-destructive/10 text-destructive border-destructive/20", icon: Shield },
  success: { color: "bg-success/10 text-success border-success/20", icon: CheckCircle2 },
};

const categoryConfig = {
  complaint: { label: "Complaint", icon: AlertTriangle, color: "bg-destructive/10 text-destructive" },
  payment: { label: "Payment", icon: CreditCard, color: "bg-success/10 text-success" },
  certificate: { label: "Certificate", icon: FileCheck, color: "bg-accent/10 text-accent" },
  scheme: { label: "Scheme", icon: Landmark, color: "bg-primary/10 text-primary" },
  fraud: { label: "Fraud Alert", icon: Shield, color: "bg-destructive/10 text-destructive" },
};

interface Props {
  complaints: Complaint[];
  transactions: Transaction[];
  certApps: CertApp[];
  schemeApps: SchemeApp[];
  onStatusChange: (id: string, status: string) => void;
}

export default function AdminNotificationsTab({ complaints, transactions, certApps, schemeApps, onStatusChange }: Props) {
  const [categoryFilter, setCategoryFilter] = useState<NotifCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const notifications = useMemo<UnifiedNotification[]>(() => {
    const items: UnifiedNotification[] = [];

    // Complaints → notifications
    complaints.forEach((c) => {
      const isFraud = (c.ai_fraud_score || 0) > 0.7;
      if (isFraud) {
        items.push({
          id: `fraud-${c.id}`,
          category: "fraud",
          title: `🚨 AI Fraud Alert — ${c.complaint_number}`,
          message: `Fraud score ${((c.ai_fraud_score || 0) * 100).toFixed(0)}% on "${c.type}" complaint by ${c.citizen_name}. Requires manual review.`,
          citizen: c.citizen_name,
          ward: c.ward,
          severity: "critical",
          timestamp: c.created_at,
          status: c.status,
          rawId: c.id,
        });
      }
      items.push({
        id: `complaint-${c.id}`,
        category: "complaint",
        title: `${c.complaint_number} — ${c.type}`,
        message: `${c.description.slice(0, 120)}${c.description.length > 120 ? "..." : ""} | Priority: ${c.priority.toUpperCase()}`,
        citizen: c.citizen_name,
        ward: c.ward,
        severity: c.priority === "critical" ? "critical" : c.priority === "high" ? "warning" : "info",
        timestamp: c.created_at,
        status: c.status,
        rawId: c.id,
      });
    });

    // Transactions → notifications
    transactions.forEach((t) => {
      items.push({
        id: `payment-${t.id}`,
        category: "payment",
        title: `₹${Number(t.amount).toLocaleString()} ${t.service_type} payment`,
        message: `${t.citizen_name} paid via ${t.provider || "N/A"} • Ref: ${t.reference_id || "—"}`,
        citizen: t.citizen_name,
        ward: t.ward || "—",
        severity: t.status === "completed" ? "success" : t.status === "failed" ? "critical" : "info",
        timestamp: t.created_at,
        status: t.status,
        rawId: t.id,
      });
    });

    // Certificate applications → notifications
    certApps.forEach((c) => {
      items.push({
        id: `cert-${c.id}`,
        category: "certificate",
        title: `${c.application_number} — ${c.certificate_type.replace("_", " ").toUpperCase()}`,
        message: `${c.citizen_name} applied for ${c.certificate_type} certificate`,
        citizen: c.citizen_name,
        ward: c.ward || "—",
        severity: c.status === "approved" || c.status === "ready_for_collection" ? "success" : "info",
        timestamp: c.created_at,
        status: c.status,
        rawId: c.id,
      });
    });

    // Scheme applications → notifications
    schemeApps.forEach((s) => {
      items.push({
        id: `scheme-${s.id}`,
        category: "scheme",
        title: `${s.application_number} — ${s.scheme_name}`,
        message: `${s.citizen_name} • ₹${(s.amount || 0).toLocaleString()} • Status: ${s.eligibility_status}`,
        citizen: s.citizen_name,
        ward: s.ward || "—",
        severity: s.eligibility_status === "disbursed" ? "success" : s.eligibility_status === "not_eligible" ? "warning" : "info",
        timestamp: s.created_at,
        status: s.eligibility_status,
        rawId: s.id,
      });
    });

    items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return items;
  }, [complaints, transactions, certApps, schemeApps]);

  const filtered = notifications.filter((n) => {
    if (dismissedIds.has(n.id)) return false;
    if (categoryFilter !== "all" && n.category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.citizen.toLowerCase().includes(q) || n.ward.toLowerCase().includes(q);
    }
    return true;
  });

  const countByCategory = (cat: NotifCategory) =>
    cat === "all" ? notifications.length - dismissedIds.size : notifications.filter((n) => n.category === cat && !dismissedIds.has(n.id)).length;

  const criticalCount = notifications.filter((n) => n.severity === "critical" && !dismissedIds.has(n.id)).length;

  const dismiss = (id: string) => setDismissedIds((prev) => new Set(prev).add(id));
  const dismissAll = () => setDismissedIds(new Set(notifications.map((n) => n.id)));
  const restoreAll = () => setDismissedIds(new Set());

  const timeAgo = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {(["all", "complaint", "payment", "certificate", "scheme", "fraud"] as NotifCategory[]).map((cat) => {
          const isActive = categoryFilter === cat;
          const count = countByCategory(cat);
          const cfg = cat === "all" ? null : categoryConfig[cat];
          return (
            <motion.div key={cat} whileTap={{ scale: 0.97 }}>
              <Card
                className={`p-3 cursor-pointer transition-all border-2 ${
                  isActive ? "border-primary shadow-md" : "border-transparent hover:border-border"
                }`}
                onClick={() => setCategoryFilter(cat)}
              >
                <div className="flex items-center gap-2 mb-1">
                  {cfg ? <cfg.icon className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  <span className="text-xs font-medium capitalize">{cat === "all" ? "All" : cfg?.label}</span>
                </div>
                <p className="font-heading text-xl font-bold">{count}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Critical Alert Banner */}
      {criticalCount > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-4 border-destructive/30 bg-destructive/5 flex items-center gap-3">
            <Shield className="w-6 h-6 text-destructive animate-pulse" />
            <div className="flex-1">
              <p className="font-semibold text-destructive">{criticalCount} Critical Alert{criticalCount > 1 ? "s" : ""} Require Attention</p>
              <p className="text-xs text-muted-foreground">AI fraud flags and critical-priority complaints need immediate review</p>
            </div>
            <Button size="sm" variant="destructive" onClick={() => setCategoryFilter("fraud")}>
              View Alerts
            </Button>
          </Card>
        </motion.div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by citizen, ward, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as NotifCategory)}>
          <SelectTrigger className="w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="complaint">Complaints</SelectItem>
            <SelectItem value="payment">Payments</SelectItem>
            <SelectItem value="certificate">Certificates</SelectItem>
            <SelectItem value="scheme">Schemes</SelectItem>
            <SelectItem value="fraud">Fraud Alerts</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={dismissAll}>
          <BellOff className="w-4 h-4 mr-1" /> Dismiss All
        </Button>
        {dismissedIds.size > 0 && (
          <Button variant="ghost" size="sm" onClick={restoreAll}>
            Restore ({dismissedIds.size})
          </Button>
        )}
        <span className="text-sm text-muted-foreground ml-auto">{filtered.length} notification{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Notification Feed */}
      <div className="space-y-2">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <Card className="p-12 text-center text-muted-foreground">
              <BellOff className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No notifications to display</p>
              <p className="text-sm mt-1">All caught up! Change filters or restore dismissed items.</p>
            </Card>
          ) : (
            filtered.map((n, idx) => {
              const sev = severityConfig[n.severity];
              const cat = categoryConfig[n.category];
              const SevIcon = sev.icon;
              const CatIcon = cat.icon;
              const isExpanded = expandedId === n.id;

              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.02 }}
                >
                  <Card className={`border-l-4 overflow-hidden transition-all ${sev.color}`}>
                    <div
                      className="p-4 flex items-start gap-3 cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : n.id)}
                    >
                      <div className="w-9 h-9 rounded-xl bg-background flex items-center justify-center flex-shrink-0 shadow-sm">
                        <SevIcon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className={`text-[10px] ${cat.color} border-0`}>
                            <CatIcon className="w-3 h-3 mr-1" />
                            {cat.label}
                          </Badge>
                          <Badge variant="outline" className="text-[10px]">{n.ward}</Badge>
                          <Badge variant="outline" className="text-[10px] capitalize">{n.status.replace("_", " ")}</Badge>
                        </div>
                        <p className="font-medium text-sm mt-1 truncate">{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{n.message}</p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {timeAgo(n.timestamp)}
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-border/50"
                        >
                          <div className="p-4 bg-background/50 space-y-3">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                              <div>
                                <p className="text-muted-foreground text-xs">Citizen</p>
                                <p className="font-medium">{n.citizen}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">Ward</p>
                                <p className="font-medium">{n.ward}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">Status</p>
                                <p className="font-medium capitalize">{n.status.replace("_", " ")}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">Time</p>
                                <p className="font-medium">{new Date(n.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
                              </div>
                            </div>
                            <p className="text-sm">{n.message}</p>

                            <div className="flex items-center gap-2 pt-1">
                              {n.category === "complaint" && (
                                <>
                                  <Button size="sm" variant="outline" onClick={() => onStatusChange(n.rawId, "in_progress")}>
                                    Mark In Progress
                                  </Button>
                                  <Button size="sm" variant="default" onClick={() => onStatusChange(n.rawId, "resolved")}>
                                    <CheckCircle2 className="w-4 h-4 mr-1" /> Resolve
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => onStatusChange(n.rawId, "escalated")}>
                                    <ArrowUpRight className="w-4 h-4 mr-1" /> Escalate
                                  </Button>
                                </>
                              )}
                              {n.category === "fraud" && (
                                <>
                                  <Button size="sm" variant="destructive" onClick={() => onStatusChange(n.rawId, "rejected")}>
                                    Reject as Fraud
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => onStatusChange(n.rawId, "in_progress")}>
                                    Mark Legitimate
                                  </Button>
                                </>
                              )}
                              <Button size="sm" variant="ghost" onClick={() => dismiss(n.id)}>
                                <BellOff className="w-4 h-4 mr-1" /> Dismiss
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
