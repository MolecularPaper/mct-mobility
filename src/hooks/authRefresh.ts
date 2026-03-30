import { useEffect, useRef } from "react";
import { refreshToken } from "@/utils/auth";

const REFRESH_INTERVAL = 10 * 60 * 1000; // 10분 (Access Token 만료 15분 기준)
const ACTIVITY_EVENTS = [
  "click",
  "keydown",
  "mousemove",
  "scroll",
  "touchstart",
];

export const useAuthRefresh = () => {
  const lastActivityRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = () => {
    lastActivityRef.current = Date.now();

    // 기존 타이머 초기화
    if (timerRef.current) clearTimeout(timerRef.current);

    // 활동 감지 후 일정 시간 뒤 갱신
    timerRef.current = setTimeout(async () => {
      const success = await refreshToken();

      if (!success) {
        // 갱신 실패 시 로그인 페이지로
        window.location.href = "/login";
      }
    }, REFRESH_INTERVAL);
  };

  useEffect(() => {
    // 활동 이벤트 등록
    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    // 첫 진입 시 타이머 시작
    resetTimer();

    return () => {
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });

      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
};
