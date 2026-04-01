import { Link } from "react-router-dom";

import { useAuthInfo } from "@/hooks";
import { logout } from "@/utils/auth";
import Button from "@/components/Button";

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
            <span className="text-4xl font-bold text-left h-min min-h-min">
              상승 GO!
            </span>
            <div className="text-[12px]">
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
        <div className="flex flex-1 m-4 mt-0 justify-center">
          <div className="flex flex-1 flex-col gap-4 justify-start">
            <p className="text-center text-xl">카풀</p>
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
          <div className="w-1 h-full ml-4 mr-4 bg-gray-700/40" />
          <div className="flex flex-1 flex-col gap-4 justify-start">
            <p className="text-center text-xl">택시</p>
            <Link
              to="/taxi"
              className="flex w-full justify-center cursor-pointer">
              <img src={taxi} alt="택시" className="w-32 h-32" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
