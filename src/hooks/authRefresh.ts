import { useEffect, useRef } from "react";
import { logout, refreshToken } from "@/utils/auth";

const REFRESH_INTERVAL = 10 * 60 * 1000;
const INACTIVE_TIMEOUT = 30 * 60 * 1000;
const ACTIVITY_EVENTS = [
  "click",
  "keydown",
  "mousemove",
  "scroll",
  "touchstart",
];

export function useAuthRefresh() {
  const lastActivityRef = useRef<number>(Date.now());
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function resetTimer() {
    lastActivityRef.current = Date.now();

    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);

    refreshTimerRef.current = setTimeout(async () => {
      const success = await refreshToken();
      if (!success) window.location.href = "/login";
    }, REFRESH_INTERVAL);

    logoutTimerRef.current = setTimeout(async () => {
      await logout();
    }, INACTIVE_TIMEOUT);
  }

  useEffect(() => {
    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    resetTimer();

    return () => {
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });

      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, []);
}
