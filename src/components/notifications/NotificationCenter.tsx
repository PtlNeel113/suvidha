import { useState, useEffect, useCallback } from "react";
import { Bell, CheckCircle2, AlertTriangle, CreditCard, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: string;
  type: "complaint" | "payment" | "certificate";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { aadhaar, isLoggedIn } = useAuth();

  const fetchNotifications = useCallback(async () => {
    if (!aadhaar) return;
    const hash = aadhaar.replace(/\s/g, "");

    // Fetch recent complaints
    const { data: complaints } = await supabase
      .from("complaints")
      .select("id, complaint_number, status, type, updated_at")
      .eq("aadhaar_hash", hash)
      .order("updated_at", { ascending: false })
      .limit(5);

    // Fetch recent transactions
    const { data: transactions } = await supabase
      .from("transactions")
      .select("id, service_type, amount, status, created_at")
      .eq("aadhaar_hash", hash)
      .order("created_at", { ascending: false })
      .limit(5);

    const items: Notification[] = [];

    complaints?.forEach((c) => {
      items.push({
        id: c.id,
        type: "complaint",
        title: `Complaint ${c.complaint_number}`,
        message: `Status: ${c.status.toUpperCase()} — ${c.type}`,
        time: new Date(c.updated_at).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" }),
        read: false,
      });
    });

    transactions?.forEach((t) => {
      items.push({
        id: t.id,
        type: "payment",
        title: `${t.service_type} Payment`,
        message: `₹${t.amount} — ${t.status}`,
        time: new Date(t.created_at).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" }),
        read: false,
      });
    });

    // Sort by time desc
    items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    setNotifications(items.slice(0, 10));
  }, [aadhaar]);

  useEffect(() => {
    if (!isLoggedIn || !aadhaar) return;
    fetchNotifications();

    // Real-time subscription
    const channel = supabase
      .channel("notifications")
      .on("postgres_changes", { event: "*", schema: "public", table: "complaints" }, fetchNotifications)
      .on("postgres_changes", { event: "*", schema: "public", table: "transactions" }, fetchNotifications)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isLoggedIn, aadhaar, fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "complaint": return <AlertTriangle className="w-4 h-4 text-primary" />;
      case "payment": return <CreditCard className="w-4 h-4 text-success" />;
      default: return <CheckCircle2 className="w-4 h-4 text-accent" />;
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => { setOpen(!open); if (!open) markAllRead(); }}
        className="bg-secondary-foreground/10 border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground/20 touch-target relative"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground border-0">
            {unreadCount}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
              <h3 className="font-heading font-semibold text-sm">Notifications</h3>
              <button onClick={() => setOpen(false)}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-sm">
                  No notifications yet
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-border/50 last:border-0 transition-colors ${
                      !n.read ? "bg-accent/5" : ""
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">{n.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
