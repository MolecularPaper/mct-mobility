import { AccountChildProps } from "./Account";
import Button from "@/components/Button";

export default function Login({ setActiveLoginPage }: AccountChildProps) {
  return (
    <div className="w-1/2 h-3/4 bg-white flex flex-col">
      <p className="self-center text-4xl mt-4">로그인</p>
      <Button
        className="cursor-pointer self-end m-2 mt-auto mb-1"
        onClick={() => setActiveLoginPage(false)}>
        가입하기
      </Button>
    </div>
  );
}
