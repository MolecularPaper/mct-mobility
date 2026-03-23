import { Link } from "react-router-dom";

/** 404 Not Found 페이지 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <h1 className="text-[10rem] font-bold text-gray-800 leading-none">404</h1>
      <h2 className="text-4xl font-semibold text-gray-700 mt-2">Not Found</h2>
      <p className="text-gray-500 mt-4 text-center">
        요청하신 페이지를 찾을 수 없습니다
      </p>
      <Link
        replace
        to="/"
        className="mt-8 px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
