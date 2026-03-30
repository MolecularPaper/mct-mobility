// server/utils/jwt.ts
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const signAccessToken = (userId: string) =>
  jwt.sign({ userId }, ACCESS_SECRET, {
    expiresIn: "15m",
    algorithm: "HS256",
  });

export const signRefreshToken = (userId: string) =>
  jwt.sign({ userId }, REFRESH_SECRET, {
    expiresIn: "7d",
    algorithm: "HS256",
  });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, ACCESS_SECRET, { algorithms: ["HS256"] }) as {
    userId: string;
  };

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, REFRESH_SECRET, { algorithms: ["HS256"] }) as {
    userId: string;
  };
