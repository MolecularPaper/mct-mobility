//승객용 페이지
import { useState } from "react";
import { Link } from "react-router-dom";

import { Tiket } from "@/states/tiket";

import Button from "@/components/Button";
import TiketCard from "./Tiket";

import homeIcon from "@/assets/home.svg";

const MOCK_RIDES: Tiket[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  departure: "OO도 OO시 OOO구 OOO로",
  arrival: "OO도 OO시 OOO구 OOO로",
  departureTime: "13:00",
}));

/**
 * 승객용 카풀 목록 페이지
 * 경로/시간 입력 폼과 카풀 목록을 표시한다.
 */
function PassengerList() {
  const [search, setSearch] = useState("");
  const [departureTime, setDepartureTime] = useState("2026-03-24T04:00");

  return (
    <div className="mx-auto flex h-screen flex-col gap-6 p-6 bg-gray-50">
      <div className="flex flex-row">
        <h1 className="text-2xl font-black text-neutral-900 flex-1">
          이쪽으로 가요
        </h1>
        <Link to="/" className="w-[32] h-[32] mr-6">
          <img className="w-full h-full" src={homeIcon} alt="홈 버튼" />
        </Link>
      </div>

      <section className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="출발지 또는 도착지를 입력해주세요"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg bg-gray-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="datetime-local"
          name="trip-start"
          value={departureTime}
          min="2026-01-01T00:00"
          max="2026-12-31T23:59"
          onChange={(e) => setDepartureTime(e.target.value)}
          className="field-sizing-content flex-1 min-w-auto rounded-lg bg-gray-100 px-3 py-2 text-center text-sm outline-none focus:ring-2 focus:ring-blue-400"
        />
        <Button className="rounded-xl bg-blue-400 border-none font-bold text-white hover:bg-blue-500 focus:bg-blue-500">
          검색
        </Button>
      </section>

      <div className="flex items-center border-b border-gray-300 pb-2 text-lg font-bold text-neutral-700">
        <span className="ml-5 flex-1">출발-&gt;도착</span>
        <span className="w-32 shrink-0 text-center">출발 시간</span>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
        {MOCK_RIDES.map((ride) => (
          <TiketCard
            key={ride.id}
            departure={ride.departure}
            arrival={ride.arrival}
            buttonText="같이가요"
            departureTime={ride.departureTime}
          />
        ))}
      </div>
    </div>
  );
}

export default PassengerList;
