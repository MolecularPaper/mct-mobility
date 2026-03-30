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

// 승객 등록
carpoolRouter.patch("/api/carpool", authGuard, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const { objectId, passengerId, remove } = req.body;

    const carpool = await db
      .collection("Carpool")
      .findOne({ _id: new ObjectId(objectId) });
    if (!carpool) {
      return res.status(404).json({ error: "Carpool not found" });
    }

    if (remove) {
      const result = await db
        .collection("Carpool")
        .updateOne(
          { _id: new ObjectId(objectId) },
          { $pull: { passengers_ids: passengerId } },
        );
      return res
        .status(200)
        .json({ success: true, modifiedCount: result.modifiedCount });
    }

    if (carpool.passengers_ids.length >= carpool.max_passenger) {
      return res.status(400).json({
        error: "Maximum passengers reached",
        max: carpool.max_passenger,
        current: carpool.passengers_ids.length,
      });
    }

    // 이미 등록된 승객인지 확인
    if (carpool.passengers_ids.includes(passengerId)) {
      return res.status(409).json({ error: "Already registered passenger" });
    }

    const result = await db
      .collection("Carpool")
      .updateOne(
        { _id: new ObjectId(objectId) },
        { $push: { passengers_ids: passengerId } },
      );

    res
      .status(200)
      .json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: "Failed to patch carpool" });
  }
});

// 목록 조회
carpoolRouter.get("/api/carpool", authGuard, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const { driverId, excludeDriverId, availableOnly } = req.query;

    const filter: Record<string, unknown> = {};

    if (driverId) {
      filter.driver_id = driverId;
    }

    if (excludeDriverId) {
      filter.driver_id = {
        ...((filter.driver_id as object) ?? {}),
        $ne: excludeDriverId,
      };
    }

    if (availableOnly === "true") {
      filter.$expr = { $lt: [{ $size: "$passengers_ids" }, "$max_passenger"] };
    }

    const carpools = await db.collection("Carpool").find(filter).toArray();
    res.json(carpools);
  } catch (err) {
    res.status(500).json({ error: "Failed to get carpools" });
  }
});

export default carpoolRouter;
