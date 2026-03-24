import { AccountChildProps } from "./Account";

import { useUser } from "@/states/user";

import Input from "@/components/Input";
import Button from "@/components/Button";

export default function Login({ setActiveLoginPage }: AccountChildProps) {
  const login = useUser((state) => state.login);

  function RequestLogin() {
    console.log("로그인 요청");
    login("abc", "임시");
  }
  function ResponseLogin() {}

  return (
    <div className="w-96 h-fit min-h-75 bg-white flex flex-col p-8">
      <p className="self-center text-4xl">로그인</p>
      <Input
        className="mt-8 text-2xl"
        inputProps={{ className: "flex-1", placeholder: "아이디" }}
      />
      <Input
        className="mt-6 text-2xl"
        inputProps={{ className: "flex-1", placeholder: "비밀번호" }}
      />
      <Button className="mt-6" onClick={RequestLogin}>
        로그인
      </Button>
      <button
        className="cursor-pointer self-center mt-4 text-gray-500"
        onClick={() => setActiveLoginPage(false)}>
        가입하기
      </button>
    </div>
  );
}
