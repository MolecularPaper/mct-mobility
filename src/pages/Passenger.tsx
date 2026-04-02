//승객용 페이지
import { JSX, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ObjectId } from "mongodb";

import { useAuthInfo } from "@/hooks";
import { Carpool } from "@/db/table";
import { getKSTIsoString } from "@/utils/date";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import TiketCard from "./Tiket";
import CarpoolInfo from "./CarpoolInfo";

import homeIcon from "@/assets/home.svg";

/**
 * 승객용 카풀 목록 페이지
 * 경로/시간 입력 폼과 카풀 목록을 표시한다.
 */
function PassengerList() {
  const { isLoggedIn, userId } = useAuthInfo();

  const [search, setSearch] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [formModalActive, setFromModalActive] = useState(false); //추가 입력 폼 모달 활성화 여부
  const formModalObjectId = useRef<ObjectId | undefined>(undefined);

  const [carpoolList, setCarpoolList] = useState(new Array<Carpool>());
  const [selectedCarpool, setSelectedCarpool] = useState<Carpool | null>(null);

  async function getCarpoolList() {
    if (!isLoggedIn) return;

    const params = new URLSearchParams({
      userId: userId ?? "",
      excludeDriverId: userId ?? "",
      availableOnly: "true",
    });

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (departureTime) {
      params.set("departureTime", departureTime);
    }

    const res = await fetch(`/api/carpool?${params}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok || !res.body) return;

    const list: Carpool[] = await res.json();
    console.log(list);
    setCarpoolList(list);
  }

  async function patchCarpoolPassenger(passengerId: string, remove?: boolean) {
    if (!isLoggedIn) return;

    const res = await fetch(`/api/carpool`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        objectId: formModalObjectId.current,
        passengerId,
        phoneNumber,
        remove,
      }),
    });

    if (res.ok) {
      await getCarpoolList();
      return;
    }

    console.error((await res.json()).error);

    // 에러 종류별 처리
    switch (res.status) {
      case 400:
        await getCarpoolList();
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

  function filterCarpoolItem(carpool: Carpool): JSX.Element | undefined {
    if (!isLoggedIn) return;

    if (carpool.passengers.some((p) => p.id === (userId ?? ""))) {
      return (
        <TiketCard
          carpool={carpool}
          showDriverInfo={true}
          buttonText="등록해제"
          onCardClick={() => setSelectedCarpool(carpool)}
          onClick={() => {
            formModalObjectId.current = carpool._id;
            patchCarpoolPassenger(userId ?? "", true);
          }}
        />
      );
    } else {
      return (
        <TiketCard
          carpool={carpool}
          showDriverInfo={true}
          buttonText="같이가요"
          onCardClick={() => setSelectedCarpool(carpool)}
          onClick={() => {
            formModalObjectId.current = carpool._id;
            setFromModalActive(true);
          }}
        />
      );
    }
  }

  useEffect(() => {
    getCarpoolList();
  }, [isLoggedIn, search, departureTime]);

  return (
    <>
      <Modal active={selectedCarpool !== null}>
        <CarpoolInfo
          driverId={selectedCarpool?.driver_id ?? ""}
          driverPhone={selectedCarpool?.driver_phone ?? ""}
          departure={selectedCarpool?.departure ?? ""}
          destination={selectedCarpool?.destination ?? ""}
          passengers={selectedCarpool?.passengers ?? []}
          maxPassenger={selectedCarpool?.max_passenger ?? 0}
          onClose={() => setSelectedCarpool(null)}
        />
      </Modal>
      <Modal active={formModalActive}>
        <div className="w-screen h-screen flex justify-center items-center">
          <div className="w-96 h-fit bg-white flex flex-col p-8 justify-center items-center rounded-xl shadow-md">
            <input
              type="text"
              placeholder="연락받을 전화번호를 입력해주세요"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full rounded-lg bg-gray-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex w-full mt-4 gap-2">
              <Button
                onClick={() => {
                  patchCarpoolPassenger(userId ?? "");
                  setFromModalActive(false);
                }}
                className="flex-1 text-[14px] rounded-xl bg-blue-400 border-none font-bold text-white hover:bg-blue-500 focus:bg-blue-500">
                확인
              </Button>
              <Button
                onClick={() => setFromModalActive(false)}
                className="flex-1 text-[14px] rounded-xl bg-blue-400 border-none font-bold text-white hover:bg-blue-500 focus:bg-blue-500">
                취소
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <div className="mx-auto flex h-screen flex-col gap-6 p-6 bg-gray-50">
        <div className="flex flex-row">
          <h1 className="text-2xl font-black text-neutral-900 flex-1">
            여기로 가요
          </h1>
          <Link to="/" className="w-[32] h-[32] mr-6">
            <img className="w-full h-full" src={homeIcon} alt="홈 버튼" />
          </Link>
        </div>

        <section className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="출발지, 도착지 또는 운전자 이름을 입력해주세요"
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
          <span className="mr-5 w-32 shrink-0 text-center">출발 시간</span>
        </div>

        {carpoolList.length > 0 ? (
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
            {carpoolList.map(filterCarpoolItem)}
          </div>
        ) : (
          <p className="text-center">{"검색 결과가 없습니다"}</p>
        )}
      </div>
    </>
  );
}

export default PassengerList;
