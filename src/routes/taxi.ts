import { Router } from "express";
import { ObjectId } from "mongodb";
import { authGuard } from "@/middleware/authGuard";
import { connectToDatabase } from "@/db/db";
import { Taxi, TaxiReservation } from "@/db/table";
import { getKST } from "@/utils/date";

const taxiRouter = Router();

/** 같은 날짜 최대 예약 가능 횟수 */
const MAX_DAILY_RESERVATIONS = 2;

// 생성
taxiRouter.post("/api/taxi", authGuard, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const {
      passengersId,
      departure,
      destination,
      departureTime,
      passengerCount,
    } = req.body;

    if (
      !departure ||
      !destination ||
      !departureTime ||
      !passengersId ||
      !passengerCount
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (new Date(departureTime) < getKST()) {
      return res
        .status(400)
        .json({ error: "Departure time must be in the future" });
    }

    if (passengerCount < 1) {
      return res
        .status(400)
        .json({ error: "There must be at least one passenger" });
    }

    const col = db.collection("Taxi");

    // 동일한 출발지, 목적지, 출발시간 중복 확인
    const duplicate = await col.findOne({
      passenger_id: passengersId,
      departure,
      destination,
      departureTime: new Date(departureTime),
    });
    if (duplicate) {
      return res.status(409).json({ error: "Duplicate reservation exists" });
    }

    // 같은 출발시간 겹침 확인
    const sameTime = await col.findOne({
      passenger_id: passengersId,
      departureTime: new Date(departureTime),
    });
    if (sameTime) {
      return res
        .status(409)
        .json({ error: "Already have a reservation at this time" });
    }

    // 같은 날짜 예약 횟수 제한
    const target = new Date(departureTime);
    const dayStart = new Date(target);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(target);
    dayEnd.setHours(23, 59, 59, 999);

    const dailyCount = await col.countDocuments({
      passenger_id: passengersId,
      departureTime: { $gte: dayStart, $lte: dayEnd },
    });
    if (dailyCount >= MAX_DAILY_RESERVATIONS) {
      return res.status(400).json({
        error: `Daily reservation limit reached (max: ${MAX_DAILY_RESERVATIONS})`,
      });
    }

    const taxi: Taxi = {
      passenger_id: passengersId,
      departure,
      destination,
      departureTime: new Date(departureTime),
      passengerCount,
      createdAt: new Date(),
    };

    const result = await col.insertOne(taxi);

    const reservation: TaxiReservation = {
      taxi_id: result.insertedId,
      status: "pending",
      createdAt: new Date(),
    };
    await db.collection("TaxiReservation").insertOne(reservation);

    res.json({ success: true, insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Failed to create taxi" });
  }
});

// 목록 조회 (유저별)
taxiRouter.get("/api/taxi", authGuard, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const { passengerId } = req.query;

    if (!passengerId) {
      return res.status(400).json({ error: "passengerId is required" });
    }

    const taxis = await db
      .collection("Taxi")
      .aggregate([
        { $match: { passenger_id: passengerId } },
        { $sort: { departureTime: 1 } },
        {
          $lookup: {
            from: "TaxiReservation",
            localField: "_id",
            foreignField: "taxi_id",
            as: "reservation",
          },
        },
        { $unwind: { path: "$reservation", preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            status: { $ifNull: ["$reservation.status", "pending"] },
          },
        },
        { $project: { reservation: 0 } },
      ])
      .toArray();
    res.json(taxis);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch taxis" });
  }
});

// 삭제
taxiRouter.delete("/api/taxi", authGuard, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const { objectId } = req.body;

    if (!objectId) {
      return res.status(400).json({ error: "objectId is required" });
    }

    const taxiOid = new ObjectId(objectId);

    const result = await db.collection("Taxi").deleteOne({ _id: taxiOid });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    await db.collection("TaxiReservation").deleteOne({ taxi_id: taxiOid });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete taxi" });
  }
});

// 관리자: 전체 예약 목록 조회
taxiRouter.get("/api/admin/taxi", authGuard, async (req, res) => {
  try {
    const { db } = await connectToDatabase();

    const list = await db
      .collection("Taxi")
      .aggregate([
        {
          $lookup: {
            from: "TaxiReservation",
            localField: "_id",
            foreignField: "taxi_id",
            as: "reservation",
          },
        },
        { $unwind: { path: "$reservation", preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            status: { $ifNull: ["$reservation.status", "pending"] },
            reservationId: "$reservation._id",
          },
        },
        { $project: { reservation: 0 } },
        { $sort: { departureTime: 1 } },
      ])
      .toArray();

    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch admin taxi list" });
  }
});

// 관리자: 예약 승인/거절
taxiRouter.patch("/api/admin/taxi", authGuard, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const { taxiId, status } = req.body;

    if (!taxiId || !status) {
      return res.status(400).json({ error: "taxiId and status are required" });
    }

    if (status !== "approved" && status !== "rejected") {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const result = await db
      .collection("TaxiReservation")
      .updateOne(
        { taxi_id: new ObjectId(taxiId) },
        { $set: { status, processedAt: new Date() } },
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update reservation" });
  }
});

export default taxiRouter;
