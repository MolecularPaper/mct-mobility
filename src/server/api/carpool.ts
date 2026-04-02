import { ObjectId } from "mongodb";
import { Router } from "express";
import { authGuard } from "@/server/middleware/authGuard";
import { connectToDatabase } from "@/server/db/db";
import { Carpool } from "@/server/db/table";
import { getKST } from "@/utils/date";
import { IsPhoneNumber } from "@/utils/format";

const carpoolRouter = Router();

// 생성
carpoolRouter.post("/api/carpool", authGuard, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const {
      driverId,
      maxPassenger,
      driverPhone,
      departure,
      destination,
      departureTime,
    } = req.body;

    if (!Number.isInteger(maxPassenger) || maxPassenger <= 0) {
      res
        .status(400)
        .json({ error: "The value of `max_passenger` is invalid" });
      return;
    }

    if (!driverPhone) {
      res.status(400).json({ error: "Driver phone is required" });
      return;
    }

    if (!departure || !destination) {
      res.status(400).json({ error: "Departure and destination are required" });
      return;
    }

    if (new Date(departureTime) < getKST()) {
      res.status(400).json({ error: "Departure time must be in the future" });
      return;
    }

    if (!IsPhoneNumber(driverPhone)) {
      res
        .status(400)
        .json({ error: "Driver phone number is in an invalid format." });
      return;
    }

    const carpool: Carpool = {
      driver_id: driverId,
      driver_phone: driverPhone,
      passengers: new Array(),
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
    const { objectId, passengerId, phoneNumber, remove } = req.body;

    const carpool = await db
      .collection("Carpool")
      .findOne({ _id: new ObjectId(objectId) });
    if (!carpool) {
      return res.status(404).json({ error: "Carpool not found" });
    }

    if (new Date(carpool.departureTime) < getKST()) {
      return res.status(400).json({ error: "Carpool has already departed" });
    }

    if (!IsPhoneNumber(phoneNumber)) {
      return res
        .status(400)
        .json({ error: "Passenger phone number is in an invalid format." });
    }

    if (carpool.driver_id === passengerId) {
      return res.status(400).json({ error: "Driver cannot join as passenger" });
    }

    if (remove) {
      if (
        !carpool.passengers.some((p: { id: string }) => p.id === passengerId)
      ) {
        return res.status(400).json({ error: "Passenger not found in list" });
      }
      const result = await db.collection<Carpool>("Carpool").updateOne(
        { _id: new ObjectId(objectId) },
        {
          $pull: { passengers: { id: passengerId } } as unknown as Record<
            string,
            unknown
          >,
        },
      );
      return res
        .status(200)
        .json({ success: true, modifiedCount: result.modifiedCount });
    }

    if (carpool.passengers.length >= carpool.max_passenger) {
      return res.status(400).json({
        error: "Maximum passengers reached",
        max: carpool.max_passenger,
        current: carpool.passengers.length,
      });
    }

    // 이미 등록된 승객인지 확인
    if (carpool.passengers.some((p: { id: string }) => p.id === passengerId)) {
      return res.status(409).json({ error: "Already registered passenger" });
    }

    const result = await db.collection<Carpool>("Carpool").updateOne(
      { _id: new ObjectId(objectId) },
      {
        $push: {
          passengers: { id: passengerId, phone: phoneNumber },
        } as unknown as Record<string, unknown>,
      },
    );

    res
      .status(200)
      .json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: "Failed to patch carpool" });
  }
});

/** 유사값 검색 시 출발시간 허용 범위 (밀리초) */
const DEPARTURE_TIME_RANGE_MS = 60 * 60 * 1000; // 1시간

// 목록 조회
carpoolRouter.get("/api/carpool", authGuard, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const {
      userId,
      driverId,
      excludeDriverId,
      availableOnly,
      search,
      departureTime,
    } = req.query;

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
      filter.$or = [
        { $expr: { $lt: [{ $size: "$passengers" }, "$max_passenger"] } },
        { "passengers.id": { $in: [userId] } },
      ];
    }

    // 텍스트 검색 (단어 포함 여부)
    if (typeof search === "string" && search.trim()) {
      const words = search
        .trim()
        .split(/\s+/)
        .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
      const pattern = words.join("|");
      const regex = { $regex: pattern, $options: "i" };
      filter.$or = [
        { departure: regex },
        { destination: regex },
        { driver_id: regex },
      ];
    }

    // 시간 검색 (유사값: ±DEPARTURE_TIME_RANGE_MS 범위)
    if (typeof departureTime === "string" && departureTime.trim()) {
      const target = new Date(departureTime);
      const min = new Date(target.getTime() - DEPARTURE_TIME_RANGE_MS);
      const max = new Date(target.getTime() + DEPARTURE_TIME_RANGE_MS);
      const now = getKST();
      filter.departureTime = { $gte: min > now ? now : min, $lte: max };
    } else {
      filter.departureTime = { $gte: getKST() };
    }

    const carpools = await db
      .collection("Carpool")
      .aggregate([
        { $match: filter },
        {
          $addFields: {
            isJoined: { $in: [userId, "$passengers.id"] }, // boolean 필드 추가
          },
        },
        {
          $sort: {
            isJoined: -1, // true(1) → false(0) 내림차순이므로 등록된게 먼저
            departureTime: 1, // 그 다음 출발시간 오름차순
          },
        },
      ])
      .toArray();
    res.json(carpools);
  } catch (err) {
    res.status(500).json({ error: "Failed to get carpools" });
  }
});

export default carpoolRouter;
