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
    <div className="w-96 h-fit min-h-75 bg-white flex flex-col p-8 rounded-xl shadow-md">
      <p className="self-center text-2xl">로그인</p>
      <Input
        className="mt-8 text-[15px]"
        inputProps={{
          className:
            "flex-1 rounded-lg bg-gray-100 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-400",
          placeholder: "닉네임",
        }}
      />
      <Input
        className="mt-6 text-[15px]"
        inputProps={{
          className:
            "flex-1 rounded-lg bg-gray-100 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-400",
          placeholder: "비밀번호",
        }}
      />
      <Button
        className="mt-6 text-[14px] rounded-xl bg-blue-400 border-none font-bold text-white hover:bg-blue-500 focus:bg-blue-500"
        onClick={RequestLogin}>
        로그인
      </Button>
      <button
        className="cursor-pointer self-center mt-4 text-[13px] text-gray-500"
        onClick={() => setActiveLoginPage(false)}>
        가입하기
      </button>
    </div>
  );
}
