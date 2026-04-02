import { Router } from "express";
import { authGuard } from "@/server/middleware/authGuard";
import { connectToDatabase } from "@/server/db/db";

const userRouter = Router();

// 단건 조회
userRouter.get("/api/users/:id", authGuard, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const { id } = req.params;

    const user = await db.collection("User").findOne({ id }); // id 필드로 조회

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default userRouter;
