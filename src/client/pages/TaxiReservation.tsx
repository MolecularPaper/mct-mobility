import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { useAuthInfo } from "@/client/hooks";
import Button from "@/client/components/Button";
import type { Taxi } from "@/server/db/table";

import homeIcon from "@/assets/home.svg";

/** 관리자 ID 목록 (쉼표 구분) */
const ADMIN_IDS = (import.meta.env.VITE_ADMIN_IDS ?? "").split(",");

/** 서버에서 내려오는 Taxi + 예약 상태 */
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

/** 관리자 택시 예약 관리 페이지 */
export default function TaxiReservation() {
  const { isLoggedIn, userId } = useAuthInfo();
  const [taxiList, setTaxiList] = useState<TaxiWithStatus[]>([]);

  /** 전체 예약 목록 조회 */
  async function getAdminTaxiList() {
    if (!isLoggedIn) return;

    const res = await fetch("/api/admin/taxi", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok || !res.body) return;

    const list: TaxiWithStatus[] = await res.json();
    setTaxiList(list);
  }

  /** 예약 승인/거절 처리 */
  async function updateStatus(
    taxiId: string,
    status: "pending" | "approved" | "rejected",
  ) {
    if (!isLoggedIn) return;

    const res = await fetch("/api/admin/taxi", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taxiId, status }),
      credentials: "include",
    });

    if (!res.ok) {
      console.error("처리에 실패했습니다.");
      return;
    }

    await getAdminTaxiList();
  }

  useEffect(() => {
    getAdminTaxiList();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <></>;
  }

  if (isLoggedIn && !ADMIN_IDS.includes(userId ?? "")) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="mx-auto flex h-dvh flex-col bg-gray-50">
      <div className="flex flex-row m-6">
        <h1 className="text-2xl font-black text-neutral-900 flex-1">
          예약 관리
        </h1>
        <Link to="/" className="w-[32] h-[32] mr-6">
          <img className="w-full h-full" src={homeIcon} alt="홈 버튼" />
        </Link>
      </div>

      <div className="ml-8.5 mr-8.5 flex items-center border-b border-gray-300 pb-2 text-lg font-bold text-neutral-700">
        <span className="flex-1">승객</span>
        <span className="flex-1 text-center">출발 시간</span>
        <span className="flex-2 shrink-0 text-center">출발-&gt;도착</span>
        <span className="flex-1 text-center">관리</span>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        {taxiList.length > 0 ? (
          taxiList.map((taxi) => (
            <div
              key={taxi._id?.toString()}
              className="flex items-center gap-3 rounded-lg border border-gray-300 bg-white p-4">
              <div className="flex flex-1 flex-col">
                <span className="truncate text-xs font-semibold text-neutral-700">
                  {taxi.passenger_id}
                </span>
                <p className="m-0 mt-1 text-[0.8rem] text-neutral-800 text-left">
                  승객수: {taxi.passengerCount}명
                </p>
              </div>
              <span className="flex-1 text-xs font-bold text-neutral-900 text-center">
                {new Date(taxi.departureTime)
                  .toISOString()
                  .slice(0, 16)
                  .replace("T", " ")}
              </span>
              <p
                className="m-0 flex-2 leading-relaxed text-neutral-800 min-w-0 text-center"
                style={{ fontSize: "clamp(0.7rem, 2vw, 0.875rem)" }}>
                <span className="block truncate">{taxi.departure}</span>
                {"-> "}
                <span className="block truncate">{taxi.destination}</span>
              </p>
              <div className="flex flex-1 flex-col items-center gap-1">
                <p className={`text-sm font-bold ${STATUS_COLOR[taxi.status]}`}>
                  {STATUS_LABEL[taxi.status]}
                </p>
                {taxi.status === "pending" ? (
                  <div className="flex flex-1 gap-1">
                    <Button
                      onClick={() =>
                        updateStatus(taxi._id!.toString(), "approved")
                      }
                      className="rounded-full bg-green-500 border-none px-3 py-1 text-xs font-bold text-white hover:bg-green-600 focus:bg-green-600">
                      승인
                    </Button>
                    <Button
                      onClick={() =>
                        updateStatus(taxi._id!.toString(), "rejected")
                      }
                      className="rounded-full bg-red-400 border-none px-3 py-1 text-xs font-bold text-white hover:bg-red-500 focus:bg-red-500">
                      거절
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-1">
                    <Button
                      onClick={() =>
                        updateStatus(taxi._id!.toString(), "pending")
                      }
                      className="rounded-full bg-red-400 border-none px-3 py-1 text-xs font-bold text-white hover:bg-orange-500 focus:bg-orange-500">
                      취소
                    </Button>
                  </div>
                )}
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
