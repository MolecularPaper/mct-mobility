import { Link } from "react-router-dom";

import baner from "@/assets/baner.gif";
import driverPageImg from "@/assets/driver_page.png";
import passengerPageImg from "@/assets/passenger_page.png";

/**
 * 홈페이지 컴포넌트
 * 운전자/승객 페이지로 이동하는 분기 화면
 */
export default function Home() {
  return (
    <>
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="w-full mt-8 flex justify-center">
          <span className="text-6xl font-bold">상승 카풀</span>
        </div>
        <div className="w-full max-w-full mt-8 max-h-75 flex justify-center">
          <img
            src={baner}
            className="w-auto h-full aspect-8/6 object-cover rounded-lg"
          />
        </div>
        {/* 하단 분기 영역 */}
        <div className="flex flex-1">
          <Link
            to="/driver"
            className="relative flex flex-1 items-center justify-center no-underline text-neutral-900 cursor-pointer bg-[#42c8f4] transition-[filter] duration-150 hover:brightness-[0.93]">
            <div className="relative flex flex-1 items-center justify-center w-full p-6 self-stretch">
              <img
                src={driverPageImg}
                alt="운전자"
                className="max-w-[80%] max-h-full object-contain"
              />
              <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(1.3rem,3.5vw,2rem)] font-black text-center leading-snug m-0 pointer-events-none whitespace-nowrap">
                함께 타고 가요
                <br />
              </p>
            </div>
          </Link>

          <Link
            to="/passenger"
            className="relative flex flex-1 items-center justify-center no-underline text-neutral-900 cursor-pointer bg-[#e84a2c] transition-[filter] duration-150 hover:brightness-[0.93]">
            <div className="relative flex flex-1 items-center justify-center w-full p-6 self-stretch">
              <img
                src={passengerPageImg}
                alt="승객"
                className="max-w-[80%] max-h-full object-contain"
              />
              <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(1.3rem,3.5vw,2rem)] font-black text-center leading-snug m-0 pointer-events-none whitespace-nowrap">
                이쪽으로 가요
                <br />
              </p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
