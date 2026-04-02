import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ObjectId } from "mongodb";

import { Button, Input } from "@/components";
import Modal from "@/components/Modal";
import { useAuthInfo } from "@/hooks";
import { getKSTIsoString } from "@/utils/date";

import TiketCard from "./Tiket";
import PassengerListModal from "./PassengerListModal";
import homeIcon from "@/assets/home.svg";
import { Carpool } from "@/db/table";

export default function DriverList() {
  const { isLoggedIn, userId } = useAuthInfo();

  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [departureTime, setDepartureTime] = useState(getKSTIsoString());
  const [maxPassenger, setMaxPassenger] = useState(0);
  const [driverPhone, setDriverPhone] = useState("");
  const [carpoolList, setCarpoolList] = useState(new Array<Carpool>());
  const [selectedCarpool, setSelectedCarpool] = useState<Carpool | null>(null);

  async function postCarpool() {
    if (!isLoggedIn) return;

    const res = await fetch("/api/carpool", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        driverId: userId,
        maxPassenger,
        driverPhone,
        departure,
        destination,
        departureTime,
      }),
      credentials: "include",
    });

    if (!res.ok) {
      alert("등록할 수 없습니다, 입력값을 확인해주세요!");
      return;
    }

    setDeparture("");
    setDestination("");
    setDepartureTime("");
    setMaxPassenger(0);
    setDriverPhone("");

    await getCarpoolList();
  }

  async function removeCarpool(objectId?: ObjectId) {
    if (!isLoggedIn) return;

    await fetch("/api/carpool", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        objectId,
      }),
    });

    await getCarpoolList();
  }

  async function getCarpoolList() {
    if (!isLoggedIn) return;

    const res = await fetch(`/api/carpool?driverId=${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok || !res.body) return;

    const list: Carpool[] = await res.json();
    console.log(list);
    setCarpoolList(list);
  }

  useEffect(() => {
    getCarpoolList();
  }, [isLoggedIn]);

  return (
    <>
      <Modal active={selectedCarpool !== null}>
        <PassengerListModal
          driverId={selectedCarpool?.driver_id ?? ""}
          driverPhone={selectedCarpool?.driver_phone ?? ""}
          departure={selectedCarpool?.departure ?? ""}
          destination={selectedCarpool?.destination ?? ""}
          passengers={selectedCarpool?.passengers ?? []}
          maxPassenger={selectedCarpool?.max_passenger ?? 0}
          onClose={() => setSelectedCarpool(null)}
        />
      </Modal>
      <div className="mx-auto flex h-screen flex-col gap-6 p-6 bg-gray-50">
        <div className="flex flex-row">
          <h1 className="text-2xl font-black text-neutral-900 flex-1">
            함께 타고 가요
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
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            className="rounded-lg bg-gray-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="도착지를 입력해주세요"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="rounded-lg bg-gray-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="datetime-local"
            value={departureTime}
            min={getKSTIsoString()}
            onChange={(e) => setDepartureTime(e.target.value)}
            className="field-sizing-content flex-1 min-w-auto rounded-lg bg-gray-100 px-3 py-2 text-center text-sm outline-none focus:ring-2 focus:ring-blue-400"
          />
          <Input
            label="탑승 가능 인원"
            labelProps={{
              className: "ml-1 mr-2 w-28 shrink-0 text-[0.8rem]",
            }}
            inputProps={{
              type: "number",
              value: maxPassenger,
              min: 0,
              onChange: (e) => {
                setMaxPassenger(
                  parseInt(e.target.value.replace(/[^0-9]/g, "")),
                );
              },
              className:
                "flex-1 rounded-lg bg-gray-100 border-none px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400",
            }}
          />
          <Input
            label="연락처"
            labelProps={{
              className: "ml-1 mr-2 w-28 shrink-0 text-[0.8rem]",
            }}
            inputProps={{
              type: "tel",
              value: driverPhone,
              placeholder: "010-0000-0000",
              onChange: (e) => setDriverPhone(e.target.value),
              className:
                "flex-1 rounded-lg bg-gray-100 border-none px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400",
            }}
          />
          <Button
            onClick={postCarpool}
            className="rounded-xl bg-blue-400 border-none font-bold text-white hover:bg-blue-500 focus:bg-blue-500">
            등록
          </Button>
        </section>

        <div className="flex items-center border-b border-gray-300 pb-2 text-lg font-bold text-neutral-700">
          <span className="ml-5 flex-1">출발-&gt;도착</span>
          <span className="mr-5 w-32 shrink-0 text-center">출발 시간</span>
        </div>

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
          {carpoolList.map((carpool) => (
            <TiketCard
              carpool={carpool}
              buttonText="삭제"
              buttonClassName="bg-red-500"
              onCardClick={() => setSelectedCarpool(carpool)}
              onClick={() => {
                removeCarpool(carpool._id);
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
