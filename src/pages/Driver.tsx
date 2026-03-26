import { Link } from "react-router-dom";
import { useState } from "react";

import Button from "@/components/Button";

import homeIcon from "@/assets/home.svg";

//운전자용 페이지
interface PageDriverProps {}

export default function DriverList({}: PageDriverProps) {
  const [departureTime, setDepartureTime] = useState("2026-03-24T04:00");

  return (
    <div className="mx-auto flex h-screen flex-col gap-6 p-6">
      <div className="flex flex-row">
        <h1 className="text-2xl font-black text-neutral-900 flex-1">
          함게 타고 가요
        </h1>
        <Link to="/" className="w-[32] h-[32] mr-6">
          <img className="w-full h-full" src={homeIcon} alt="홈 버튼" />
        </Link>
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-bold text-neutral-900">경로와 시간</h2>
        <input
          type="text"
          placeholder="출발지를 입력해주세요"
          className="rounded border border-gray-400 px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="도착지를 입력해주세요"
          className="rounded border border-gray-400 px-3 py-2 text-sm"
        />
        <input
          type="datetime-local"
          name="trip-start"
          value={departureTime}
          min="2026-01-01T00:00"
          max="2026-12-31T23:59"
          onChange={(e) => setDepartureTime(e.target.value)}
          className="field-sizing-content flex-1 min-w-auto rounded border border-gray-400 px-3 py-2 text-center text-sm"
        />
        <Button className="bg-[#42c8f4] focus:bg-[#22a0cc]">등록</Button>
      </section>

      <div className="flex items-center border-b border-gray-300 pb-2 text-lg font-bold text-neutral-700">
        <span className="ml-5 flex-1">출발-&gt;도착</span>
        <span className="w-32 shrink-0 text-center">출발 시간</span>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
        {/* {MOCK_RIDES.map((ride) => (
          <TiketCard
            key={ride.id}
            departure={ride.departure}
            arrival={ride.arrival}
            departureTime={ride.departureTime}
          />
        ))} */}
      </div>
    </div>
  );
}
