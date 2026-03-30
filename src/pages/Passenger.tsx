//승객용 페이지
import { JSX, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ObjectId } from "mongodb";

import { useAuthInfo } from "@/hooks";
import { Carpool } from "@/db/table";
import { getKSTIsoString } from "@/utils/date";
import Button from "@/components/Button";
import TiketCard from "./Tiket";

import homeIcon from "@/assets/home.svg";

/**
 * 승객용 카풀 목록 페이지
 * 경로/시간 입력 폼과 카풀 목록을 표시한다.
 */
function PassengerList() {
  const { isLoggedIn, userId } = useAuthInfo();

  const [search, setSearch] = useState("");
  const [departureTime, setDepartureTime] = useState(getKSTIsoString());
  const [carpoolList, setCarpoolList] = useState(new Array<Carpool>());

  async function getCarpoolList() {
    if (!isLoggedIn) return;

    const res = await fetch("/api/carpool", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok || !res.body) return;

    const list: Carpool[] = await res.json();
    console.log(list);
    setCarpoolList(list);
  }

  async function patchCarpoolPassenger(
    passengerId: string,
    objectId?: ObjectId,
    remove?: boolean,
  ) {
    if (!isLoggedIn) return;

    const res = await fetch(`/api/carpool`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ objectId, passengerId, remove }),
    });

    const data = await res.json();

    if (res.ok) {
      await getCarpoolList();
      return;
    }

    // 에러 종류별 처리
    switch (res.status) {
      case 400:
        alert(`정원 초과 (${data.current}/${data.max}명)`);
        break;
      case 409:
        alert("이미 등록된 승객입니다");
        break;
      case 404:
        alert("카풀을 찾을 수 없습니다");
        break;
      default:
        alert("승객 등록에 실패했습니다");
        break;
    }
  }

  function filterCarpoolList(carpool: Carpool): JSX.Element | undefined {
    if (!isLoggedIn || !userId) return;

    if (
      carpool.passengers_ids.length >= carpool.max_passenger ||
      carpool.driver_id === userId
    )
      return;

    if (carpool.passengers_ids.includes(userId)) {
      return (
        <TiketCard
          key={carpool._id?.toString()}
          departure={carpool.departure}
          arrival={carpool.destination}
          departureTime={carpool.departureTime}
          buttonText="등록해제"
          onClick={() => {
            patchCarpoolPassenger(userId, carpool._id, true);
          }}
        />
      );
    } else {
      return (
        <TiketCard
          key={carpool._id?.toString()}
          departure={carpool.departure}
          arrival={carpool.destination}
          buttonText="같이가요"
          departureTime={carpool.departureTime}
          onClick={() => {
            patchCarpoolPassenger(userId, carpool._id);
          }}
        />
      );
    }
  }

  useEffect(() => {
    getCarpoolList();
  }, [isLoggedIn]);

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
          min={getKSTIsoString()}
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
        {carpoolList.map(filterCarpoolList)}
      </div>
    </div>
  );
}

export default PassengerList;
