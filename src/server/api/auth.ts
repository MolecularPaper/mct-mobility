// server/routes/auth.ts
import { Router } from "express";
import bcrypt from "bcrypt";
import { connectToDatabase } from "@/server/db/db";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import { setTokenCookies, clearTokenCookies } from "../../utils/cookie";
import { authGuard } from "@/server/middleware/authGuard";

const authRouter = Router();
const SALT_ROUNDS = 12;

// 회원가입
authRouter.post("/api/auth/register", async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const { id, password, vc } = req.body;

    // 승인 코드 검증
    if (!process.env.REGISTER_CODE) {
      return res.status(500).json({ error: "Server configuration error" });
    }

    if (process.env.REGISTER_CODE.trim() !== vc.trim()) {
      return res.status(403).json({ error: "Invalid register code" });
    }

    if (!id || !password) {
      return res.status(400).json({ error: "id and password are required" });
    }

    // 중복 id 확인
    const existing = await db.collection("User").findOne({ id });
    if (existing) {
      return res.status(409).json({ error: "User already exists" });
    }

    // 비밀번호 해시
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await db.collection("User").insertOne({
      id,
      password: hashedPassword, // 해시된 값만 저장
      createdAt: new Date(),
    });

    res.status(201).json({ success: true });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

// 로그인
authRouter.post("/api/auth/login", async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const { id, password } = req.body;

    if (!id || !password) {
      return res.status(400).json({ error: "id and password are required" });
    }

    const user = await db.collection("User").findOne({ id });

    // 유저 없음과 비밀번호 틀림을 같은 메시지로 처리 (보안상 중요)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    setTokenCookies(res, accessToken, refreshToken);

    // 응답에 민감한 정보 제외
    res.status(200).json({ success: true, userId: user.id });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Access Token 재발급
authRouter.post("/api/auth/refresh", async (req, res) => {
  const token = req.cookies["refresh_token"];

  if (!token) {
    return res.status(401).json({ error: "No refresh token" });
  }

  try {
    const { userId } = verifyRefreshToken(token);
    const newAccessToken = signAccessToken(userId);

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({ success: true });
  } catch {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
});

// 로그아웃
authRouter.post("/api/auth/logout", (req, res) => {
  clearTokenCookies(res);
  res.status(200).json({ success: true });
});

// 내 정보 조회 (authGuard 적용 예시)
authRouter.get("/api/auth/me", authGuard, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const user = await db.collection("User").findOne(
      { id: req.user!.userId },
      { projection: { password: 0 } }, // 비밀번호 필드 제외
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ success: true, data: user });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default authRouter;
