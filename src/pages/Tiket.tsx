import Button from "@/components/Button";
import { Carpool } from "@/db/table";
import { twMerge } from "tailwind-merge";

/**
 * @param departure     출발지
 * @param arrival       목적지
 * @param departureTime 출발시간
 * @param buttonText    버튼 내부 텍스트
 * @param onClick       버튼 클릭 핸들러
 */
interface TiketProps {
  carpool: Carpool;
  showDriverId?: boolean;
  buttonText: string;
  buttonClassName?: string;
  onClick?: () => void;
  onCardClick?: () => void;
}

/** 텍스트 최소 크기 (rem) */
const MIN_FONT_SIZE_REM = 0.7;

/**
 * 카풀 탑승 카드 컴포넌트
 * 출발지, 도착지, 출발 시간을 표시하고 탑승 신청 버튼을 제공한다.
 */
export default function TiketCard({
  carpool,
  buttonText,
  buttonClassName,
  showDriverId,
  onClick,
  onCardClick,
}: TiketProps) {
  return (
    <div
      className="flex items-center justify-between gap-4 rounded-lg border border-gray-300 bg-white p-4 pr-3 cursor-pointer hover:bg-gray-50"
      onClick={onCardClick}>
      <div className="flex w-fit shrink-0 flex-col items-center gap-1 min-w-0 flex-1 overflow-hidden">
        {showDriverId && (
          <p className="truncate w-full text-[1rem]">
            운전자: {carpool.driver_id}
          </p>
        )}
        <p
          className="w-full m-0 leading-relaxed text-[1rem] text-neutral-800"
          style={{ fontSize: `clamp(${MIN_FONT_SIZE_REM}rem, 2vw, 0.875rem)` }}>
          <span className="block truncate">
            {carpool.departure ?? ""}
            {" ->"}
          </span>
          <span className="block truncate">{carpool.destination ?? ""}</span>
        </p>
        <p className="w-full m-0 text-[0.8rem] text-neutral-800 ">
          {`승객: (${carpool.passengers.length}/${carpool.max_passenger})`}
        </p>
      </div>
      <div className="mr-1 flex w-fit shrink-0 flex-col items-center gap-1">
        <span className="text-[1rem] font-bold text-neutral-900">
          {carpool.departureTime
            ? new Date(carpool.departureTime)
                .toISOString()
                .slice(0, 16)
                .replace("T", " ")
            : ""}
        </span>
        <Button
          className={twMerge(
            "mt-2 rounded-full bg-[#42c8f4] border-none px-5 py-2 font-bold text-white hover:bg-[#2bb5e0] focus:bg-[#22a0cc]",
            buttonClassName,
          )}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}>
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
