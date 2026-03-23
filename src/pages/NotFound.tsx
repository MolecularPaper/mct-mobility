import { Link } from "react-router-dom";

//404 페이지
export default function NotFound() {
  return (
    <>
      <h1>404 - Page Not Found</h1>
      <p>요청하신 페이지가 존재하지 않습니다.</p>
      <Link replace to="/">
        홈으로 돌아가기
      </Link>
    </>
  );
}
