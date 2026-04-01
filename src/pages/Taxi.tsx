import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ObjectId } from "mongodb";

import { useAuthInfo } from "@/hooks";
import { getKSTIsoString } from "@/utils/date";
import Button from "@/components/Button";
import type { Taxi } from "@/db/table";

import homeIcon from "@/assets/home.svg";

/** 서버에서 aggregation으로 내려오는 Taxi + status */
interface TaxiWithStatus extends Taxi {
  status: "pending" | "approved" | "rejected";
}

/** 승인 상태별 라벨 */
const STATUS_LABEL: Record<TaxiWithStatus["status"], string> = {
  pending: "대기중",
  approved: "승인",
  rejected: "거절",
};

/** 승인 상태별 텍스트 색상 */
const STATUS_COLOR: Record<TaxiWithStatus["status"], string> = {
  pending: "text-gray-500",
  approved: "text-green-600",
  rejected: "text-red-500",
};

/** 택시 예약 페이지 */
export default function Taxi() {
  const { isLoggedIn, userId } = useAuthInfo();

  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [departureTime, setDepartureTime] = useState(getKSTIsoString());
  const [passengerCount, setPassengerCount] = useState(0);
  const [taxiList, setTaxiList] = useState<TaxiWithStatus[]>([]);

  /** 택시 예약 목록 조회 */
  async function getTaxiList() {
    if (!isLoggedIn) return;

    const res = await fetch(`/api/taxi?passengerId=${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok || !res.body) return;

    const list: TaxiWithStatus[] = await res.json();
    setTaxiList(list);
  }

  /** 택시 예약 등록 */
  async function postTaxi() {
    if (!isLoggedIn) return;

    const res = await fetch("/api/taxi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        passengersId: userId,
        departure,
        destination,
        departureTime,
        passengerCount,
      }),
      credentials: "include",
    });

    if (!res.ok) {
      alert("등록할 수 없습니다, 입력값을 확인해주세요!");
      console.error((await res.json()).error);
      return;
    }

    setDeparture("");
    setDestination("");
    setDepartureTime(getKSTIsoString());
    setPassengerCount(0);

    await getTaxiList();
  }

  /** 택시 예약 삭제 */
  async function removeTaxi(objectId?: ObjectId) {
    if (!isLoggedIn) return;

    await fetch("/api/taxi", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ objectId }),
      credentials: "include",
    });

    await getTaxiList();
  }

  useEffect(() => {
    getTaxiList();
  }, [isLoggedIn]);

  return (
    <div className="mx-auto flex h-screen flex-col bg-gray-50">
      <div className="flex flex-row m-6">
        <h1 className="text-2xl font-black text-neutral-900 flex-1">택시</h1>
        <Link to="/" className="w-[32] h-[32] mr-6">
          <img className="w-full h-full" src={homeIcon} alt="홈 버튼" />
        </Link>
      </div>

      {/* 출발지/도착지 입력 */}
      <div className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <div className="w-0.5 h-6 bg-gray-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <input
              type="text"
              placeholder="어디서 출발할까요?"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              className="w-full rounded-lg bg-gray-100 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="어디로 갈까요?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full rounded-lg bg-gray-100 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="몇명이서 탑승하나요?"
              value={passengerCount || ""}
              onChange={(e) =>
                setPassengerCount(
                  parseInt(e.target.value.replace(/[^0-9]/g, "")),
                )
              }
              className="w-full rounded-lg bg-gray-100 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="datetime-local"
              value={departureTime}
              min={getKSTIsoString()}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-full rounded-lg bg-gray-100 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              suppressHydrationWarning={true}
            />
          </div>
        </div>
      </div>
      <div className="px-4 pb-6 pt-3">
        <Button
          onClick={postTaxi}
          className="w-full rounded-xl bg-blue-400 border-none py-4 text-lg font-bold text-white hover:bg-blue-500 focus:bg-blue-500">
          택시 호출하기
        </Button>
      </div>
      <div className="flex items-center border-b border-gray-300 pb-2 text-lg font-bold text-neutral-700">
        <span className="ml-5 w-20">출발 시간</span>
        <span className="flex-1 shrink-0 text-center">출발-&gt;도착</span>
        <span className="mr-5 w-20">승인 여부</span>
      </div>
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        {taxiList.length > 0 ? (
          taxiList.map((taxi) => (
            <div
              key={taxi._id?.toString()}
              className="flex items-center gap-4 rounded-lg border border-gray-300 bg-white p-4">
              <div className="flex flex-col">
                <span className="w-20 text-xs font-bold text-neutral-900">
                  {new Date(taxi.departureTime)
                    .toISOString()
                    .slice(0, 16)
                    .replace("T", " ")}
                </span>
                <p className="m-0 mt-1 text-[0.8rem] text-neutral-800 text-left">
                  승객수: {taxi.passengerCount}명
                </p>
              </div>
              <p
                className="m-0 flex-1 leading-relaxed text-neutral-800 min-w-0 text-center"
                style={{ fontSize: "clamp(0.75rem, 2vw, 1rem)" }}>
                <span className="block truncate">
                  {taxi.departure}
                  {"-> "}
                </span>
                <span className="block truncate">{taxi.destination}</span>
              </p>
              <div>
                <p
                  className={`text-sm text-center ${STATUS_COLOR[taxi.status]}`}>
                  {STATUS_LABEL[taxi.status]}
                </p>
                <Button
                  onClick={() => removeTaxi(taxi._id)}
                  className="mt-3 shrink-0 rounded-full bg-red-400 border-none px-4 py-1.5 text-sm font-bold text-white hover:bg-red-500 focus:bg-red-500">
                  삭제
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">예약 내역이 없습니다</p>
        )}
      </div>
    </div>
  );
}
