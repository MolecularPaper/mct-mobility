// server/utils/cookie.ts
import { Response } from "express";

export const setTokenCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
) => {
  const cookieOptions = {
    httpOnly: true, // JS 접근 불가
    secure: process.env.NODE_ENV === "production", // HTTPS에서만 전송
    sameSite: "strict" as const, // CSRF 방지
  };

  res.cookie("access_token", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15분
  });

  res.cookie("refresh_token", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
  });
};

export const clearTokenCookies = (res: Response) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
};
