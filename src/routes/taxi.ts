import { Router } from "express";
import { authGuard } from "@/middleware/authGuard";
import { connectToDatabase } from "@/db/db";
import { Taxi } from "@/db/table";

const taxiRouter = Router();

// 생성
taxiRouter.post("/api/taxi", authGuard, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const { passengers_id, departure, destination, departureTime } = req.body;

    const taxi: Taxi = {
      passengers_id,
      departure,
      destination,
      departureTime: new Date(departureTime),
      createdAt: new Date(),
    };

    const result = await db.collection("Taxi").insertOne(taxi);
    res.json({ success: true, insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Failed to create taxi" });
  }
});

// 목록 조회
taxiRouter.get("/api/taxi", authGuard, async (_req, res) => {
  try {
    const { db } = await connectToDatabase();
    const taxis = await db.collection("Taxi").find({}).toArray();
    res.json(taxis);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch taxis" });
  }
});

export default taxiRouter;
