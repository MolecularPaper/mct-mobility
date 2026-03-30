import { ObjectId } from "mongodb";
import { Router } from "express";
import { authGuard } from "@/middleware/authGuard";
import { connectToDatabase } from "@/db/db";
import { Carpool } from "@/db/table";

const carpoolRouter = Router();

// 생성
carpoolRouter.post("/api/carpool", authGuard, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const { driverId, maxPassenger, departure, destination, departureTime } =
      req.body;

    if (!Number.isInteger(maxPassenger) || maxPassenger < 0) {
      res
        .status(400)
        .json({ error: "The value of `max_passenger` is invalid" });
      return;
    }

    const carpool: Carpool = {
      driver_id: driverId,
      passengers_ids: new Array(),
      max_passenger: maxPassenger,
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

// 리스트에서 삭제
carpoolRouter.delete("/api/carpool", authGuard, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const { objectId } = req.body;

    await db.collection("Carpool").findOneAndDelete({
      _id: new ObjectId(objectId),
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete carpool" });
  }
});

// 목록 조회
carpoolRouter.get("/api/carpool", authGuard, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const { driverId } = req.query;

    if (driverId) {
      const carpools = await db
        .collection("Carpool")
        .find({
          driver_id: driverId,
        })
        .toArray();

      return res.json(carpools);
    }

    const carpools = await db.collection("Carpool").find({}).toArray();
    res.json(carpools);
  } catch (err) {
    res.status(500).json({ error: "Failed to get carpools" });
  }
});

export default carpoolRouter;
