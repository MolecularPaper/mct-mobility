import { AccountChildProps } from "./Account";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function Register({ setActiveLoginPage }: AccountChildProps) {
  function RequestRegister() {}
  function ResponseRegister() {}

  return (
    <div className="w-96 h-fit min-h-75 bg-white flex flex-col p-8">
      <p className="self-center text-2xl">가입</p>
      <Input
        className="mt-8 text-[15px]"
        inputProps={{ className: "flex-1", placeholder: "아이디" }}
      />
      <Input
        className="mt-6 text-[15px]"
        inputProps={{ className: "flex-1", placeholder: "비밀번호" }}
      />
      <Input
        className="mt-6 text-[15px]"
        inputProps={{ className: "flex-1", placeholder: "비밀번호 확인" }}
      />
      <Button className="mt-6 text-[14px]" onClick={RequestRegister}>
        가입하기
      </Button>
      <button
        className="cursor-pointer self-center mt-4 text-[13px] text-gray-500"
        onClick={() => setActiveLoginPage(true)}>
        로그인
      </button>
    </div>
  );
}
