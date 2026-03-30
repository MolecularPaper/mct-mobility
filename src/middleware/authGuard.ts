// server/middleware/authGuard.ts
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

// Request에 user 타입 추가
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string };
    }
  }
}

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["access_token"];

  if (!token) {
    window.location.reload();
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
