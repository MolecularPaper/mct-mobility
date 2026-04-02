import Button from "@/components/Button";

interface PassengerListModalProps {
  driverId: string;
  departure: string;
  destination: string;
  passengers: { id: string; phone: string }[];
  maxPassenger: number;
  onClose: () => void;
}

/** 카풀 승객 목록을 표시하는 모달 내부 컴포넌트 */
export default function PassengerListModal({
  driverId,
  departure,
  destination,
  passengers,
  maxPassenger,
  onClose,
}: PassengerListModalProps) {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 flex flex-col gap-4 shadow-lg">
        <h2 className="text-lg font-bold text-neutral-900">카풀 정보</h2>
        <div className="flex flex-col gap-1 text-sm text-neutral-700">
          <p>운전자: {driverId}</p>
          <p>
            경로: {departure} → {destination}
          </p>
          <p>
            탑승인원 ({passengers.length}/{maxPassenger})
          </p>
        </div>
        <ul className="flex flex-col gap-2 max-h-48 overflow-y-auto">
          {passengers.length > 0 ? (
            passengers.map((p) => (
              <li
                key={p.id}
                className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-neutral-800">
                {p.id} ({p.phone})
              </li>
            ))
          ) : (
            <li className="text-sm text-neutral-400">등록된 승객이 없습니다</li>
          )}
        </ul>
        <Button
          onClick={onClose}
          className="rounded-xl bg-blue-400 border-none font-bold text-white hover:bg-blue-500 focus:bg-blue-500">
          닫기
        </Button>
      </div>
    </div>
  );
}
