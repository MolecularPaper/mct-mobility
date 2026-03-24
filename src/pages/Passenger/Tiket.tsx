import Button from "@/components/Button";

interface TiketProps {
  /** 출발지 주소 */
  departure: string;
  /** 도착지 주소 */
  arrival: string;
  /** 출발 시간 (예: "13:00") */
  departureTime: string;
  /** "같이가요!" 버튼 클릭 핸들러 */
  onJoin?: () => void;
}

/**
 * 카풀 탑승 카드 컴포넌트
 * 출발지, 도착지, 출발 시간을 표시하고 탑승 신청 버튼을 제공한다.
 */
export default function TiketCard({
  departure,
  arrival,
  departureTime,
  onJoin,
}: TiketProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-300 bg-white p-4 pr-3">
      <p className="m-0 text-sm leading-relaxed text-neutral-800">
        {departure}
        <br />
        {"-> "}
        {arrival}
      </p>
      <div className="flex w-fit shrink-0 flex-col items-center gap-1">
        <span className="text-lg font-bold text-neutral-900">
          {departureTime}
        </span>
        <Button
          className="rounded-full bg-[#42c8f4] border-none px-5 py-2 font-bold text-white hover:bg-[#2bb5e0] focus:bg-[#22a0cc]"
          onClick={onJoin}>
          같이가요!
        </Button>
      </div>
    </div>
  );
}
