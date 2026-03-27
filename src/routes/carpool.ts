import { Router } from "express";
import { connectToDatabase } from "@/db/db";
import { Carpool } from "@/db/table";

const carpoolRouter = Router();

// 생성
carpoolRouter.post("/api/carpool", async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const { driver_id, passengers_id, departure, destination, departureTime } =
      req.body;

    const carpool: Carpool = {
      driver_id,
      passengers_id: Array.isArray(passengers_id)
        ? passengers_id
        : [passengers_id],
      departure,
      destination,
      departureTime: new Date(departureTime),
      createdAt: new Date(),
    };

    const result = await db.collection("Carpool").insertOne(carpool);
    res.json({ success: true, insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Failed to create carpool" });
  }
});

// 목록 조회
carpoolRouter.get("/api/carpool", async (_req, res) => {
  try {
    const { db } = await connectToDatabase();
    const carpools = await db.collection("Carpool").find({}).toArray();
    res.json(carpools);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch carpools" });
  }
});

export default carpoolRouter;
