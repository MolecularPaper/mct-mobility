import { Link } from "react-router-dom";

import { useAuthInfo } from "@/client/hooks";
import { logout } from "@/utils/auth";
import Button from "@/client/components/Button";

import baner from "@/assets/baner.gif";
import driver from "@/assets/driver.webp";
import passenger from "@/assets/passenger.webp";
import taxi from "@/assets/taxi.webp";

/**
 * 홈페이지 컴포넌트
 * 운전자/승객 페이지로 이동하는 분기 화면
 */
export default function Home() {
  const { userId } = useAuthInfo();

  return (
    <>
      <div className="flex flex-col h-screen overflow-y-auto">
        <div className="w-full p-4 flex justify-center items-center bg-blue-300">
          <div className="flex-1">
            <span
              className="text-3xl font-bold text-left h-min min-h-min"
              style={{ fontFamily: "HYHeadLine" }}>
              상승 GO!
            </span>
            <div className="text-1xl" style={{ fontFamily: "HYJungGothic" }}>
              <p>{"빠르고, 함께하고, 비용도 아끼는"}</p>
              <p>{"스마트한 상승 인(人)"}</p>
            </div>
          </div>
          <div className="flex flex-col">
            <p>유저: {userId}</p>
            <Button
              className="w-min-fit mt-1 p-0.5 text-[0.75rem]"
              onClick={logout}>
              로그아웃
            </Button>
          </div>
        </div>
        <div className="max-h-[30vh] m-4 p-4 justify-center border-2 border-gray-800">
          <img src={baner} className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col flex-1 mx-4 mb-4">
          <div className="flex">
            <div className="flex-1 flex justify-center items-center p-2 border-r border-b border-gray-700/40">
              <p className="text-center text-xl font-bold">카풀 CARPOOL</p>
            </div>
            <div className="flex-1 flex justify-center items-center p-2 border-b border-gray-700/40">
              <p className="text-center text-xl font-bold">상승 TAXI</p>
            </div>
          </div>
          <div className="flex flex-1">
            <div className="flex-1 flex flex-col gap-4 justify-center items-center p-4 border-r border-gray-700/40">
              <Link
                to="/driver"
                className="flex w-full justify-center cursor-pointer">
                <img src={driver} alt="운전자" className="w-32 h-32" />
              </Link>
              <Link
                to="/passenger"
                className="flex w-full justify-center cursor-pointer">
                <img src={passenger} alt="승객" className="w-32 h-32" />
              </Link>
            </div>
            <div className="flex-1 flex flex-col gap-4 justify-center items-center p-4">
              <Link
                to="/taxi"
                className="flex w-full justify-center cursor-pointer">
                <img src={taxi} alt="택시" className="w-32 h-32" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
