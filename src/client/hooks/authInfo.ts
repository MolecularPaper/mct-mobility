import { useEffect, useState } from "react";

export function useAuthInfo() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = 확인 중
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Unauthorized");
      })
      .then(({ data }) => {
        setIsLoggedIn(true);
        setUserId(data.id);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setUserId(null);
      });
  }, []);

  return { isLoggedIn, userId };
}
