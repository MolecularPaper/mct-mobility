import { Router } from "express";
import { connectToDatabase } from "@/db/db";
import { User } from "@/db/table";

const userRouter = Router();

// 생성
userRouter.post("/api/users", async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const { id, password } = req.body;

    const user: User = {
      id,
      password, // 실제 서비스에선 bcrypt 등으로 해시 처리 필요
      createdAt: new Date(),
    };

    const result = await db.collection("User").insertOne(user);
    res.json({ success: true, insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

// 목록 조회
userRouter.get("/api/users", async (_req, res) => {
  try {
    const { db } = await connectToDatabase();
    const users = await db.collection("User").find({}).toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

export default userRouter;
