//승객용 페이지
import { Link } from "react-router-dom";

import TiketCard from "./Tiket";
import homeIcon from "@/assets/home.svg";

interface Tiket {
  id: number;
  departure: string;
  arrival: string;
  departureTime: string;
}

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
  return (
    <div className="mx-auto flex min-h-screen flex-col gap-6 p-6">
      <div className="flex flex-row">
        <h1 className="text-2xl font-black text-neutral-900 flex-1">
          이쪽으로 가요
        </h1>
        <Link to="/" className="w-[32] h-[32] mr-6">
          <img className="w-full h-full" src={homeIcon} alt="홈 버튼" />
        </Link>
      </div>

      {/* 경로 입력 */}
      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-bold text-neutral-900">경로</h2>
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
      </section>

      {/* 시간 선택 */}
      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-bold text-neutral-900">시간</h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="연도"
            className="flex-1 rounded border border-gray-400 px-3 py-2 text-center text-sm"
          />
          <input
            type="text"
            placeholder="월"
            className="flex-1 rounded border border-gray-400 px-3 py-2 text-center text-sm"
          />
          <input
            type="text"
            placeholder="일"
            className="flex-1 rounded border border-gray-400 px-3 py-2 text-center text-sm"
          />
          <input
            type="text"
            placeholder="시간"
            className="flex-1 rounded border border-gray-400 px-3 py-2 text-center text-sm"
          />
        </div>
      </section>

      <div className="flex items-center border-b border-gray-300 pb-2 text-lg font-bold text-neutral-700">
        <span className="ml-5 flex-1">출발-&gt;도착</span>
        <span className="w-32 shrink-0 text-center">출발 시간</span>
      </div>

      <div className="flex flex-col gap-3">
        {MOCK_RIDES.map((ride) => (
          <TiketCard
            key={ride.id}
            departure={ride.departure}
            arrival={ride.arrival}
            departureTime={ride.departureTime}
          />
        ))}
      </div>
    </div>
  );
}

export default PassengerList;
