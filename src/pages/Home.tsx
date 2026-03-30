import { Link } from "react-router-dom";

import { useAuth } from "@/hooks/authHook";
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
  const { userId } = useAuth();

  async function Logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    window.location.reload();
  }

  return (
    <>
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="w-full mt-8 flex justify-center items-center">
          <span className="flex-1 text-4xl font-bold text-center h-min min-h-min">
            상승 모빌리티
          </span>
          <div className="mr-6 flex flex-col">
            <p>유저: {userId}</p>
            <Button className="text-[12px] mt-1 p-0.5" onClick={Logout}>
              로그아웃
            </Button>
          </div>
        </div>
        <div className="w-full max-w-full mt-8 max-h-75 flex justify-center">
          <img
            src={baner}
            className="w-auto h-full aspect-8/6 object-cover rounded-lg"
          />
        </div>
        {/* 하단 분기 영역 */}
        <div className="flex flex-1 no-underline text-white text-[20px] font-bold [-webkit-text-stroke:1.3px_black] [paint-order:stroke_fill]">
          <div className="flex flex-1 flex-col items-center justify-center">
            <Link
              to="/driver"
              className="relative flex flex-1 flex-col w-full items-center justify-center cursor-pointer">
              <img
                src={driver}
                alt="운전자"
                className="absolute w-full h-full object-cover object-bottom-left"
              />
              <p className="z-2 drop-shadow-md">
                함께 타고 가요
                <br />
              </p>
            </Link>
            <Link
              to="/passenger"
              className="relative flex flex-1 flex-col w-full items-center justify-center cursor-pointer">
              <img
                src={passenger}
                alt="승객"
                className="absolute w-full h-full object-cover"
              />
              <p className="z-2 drop-shadow-md">
                이쪽으로 가요
                <br />
              </p>
            </Link>
          </div>

          <Link
            to="/taxi"
            className="relative flex flex-1 box-border items-center justify-center cursor-pointer">
            <img
              src={taxi}
              alt="택시"
              className="absolute w-full h-full object-cover object-right"
            />
            <p className="z-2 drop-shadow-md">
              택시
              <br />
            </p>
          </Link>
        </div>
      </div>
    </>
  );
}
