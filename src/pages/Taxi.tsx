import { Link } from "react-router-dom";
import { useState } from "react";

import Button from "@/components/Button";

import homeIcon from "@/assets/home.svg";

export default function Taxi() {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");

  return (
    <div className="mx-auto flex h-screen flex-col bg-gray-50">
      <div className="flex flex-row m-6">
        <h1 className="text-2xl font-black text-neutral-900 flex-1">택시</h1>
        <Link to="/" className="w-[32] h-[32] mr-6">
          <img className="w-full h-full" src={homeIcon} alt="홈 버튼" />
        </Link>
      </div>

      <div className="flex-1"></div>

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
          </div>
        </div>
      </div>
      <div className="px-4 pb-6 pt-3">
        <Button className="w-full rounded-xl bg-blue-400 border-none py-4 text-lg font-bold text-white hover:bg-blue-500 focus:bg-blue-500">
          택시 호출하기
        </Button>
      </div>
    </div>
  );
}
