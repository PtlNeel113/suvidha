import { useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export function useInactivityLogout() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = useCallback(() => {
    if (!isLoggedIn) return;

    if (warningRef.current) clearTimeout(warningRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);

    // Show warning at 4 min
    warningRef.current = setTimeout(() => {
      toast({
        title: "⏰ Session expiring soon",
        description: "You'll be logged out in 1 minute due to inactivity. Touch screen to stay active.",
      });
    }, INACTIVITY_TIMEOUT - 60_000);

    // Logout at 5 min
    timerRef.current = setTimeout(() => {
      logout();
      navigate("/login", { replace: true });
      toast({
        title: "🔒 Session Expired",
        description: "You were logged out due to 5 minutes of inactivity.",
      });
    }, INACTIVITY_TIMEOUT);
  }, [isLoggedIn, logout, navigate, toast]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const events = ["mousedown", "mousemove", "keydown", "touchstart", "scroll", "click"];
    const handler = () => resetTimer();

    events.forEach((e) => window.addEventListener(e, handler, { passive: true }));
    resetTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, handler));
      if (timerRef.current) clearTimeout(timerRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
    };
  }, [isLoggedIn, resetTimer]);
}
