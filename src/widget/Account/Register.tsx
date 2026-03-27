import { useState } from "react";

import Input from "@/components/Input";
import Button from "@/components/Button";

import { AccountChildProps } from "./Account";

export default function Register({ setActiveLoginPage }: AccountChildProps) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [vc, setVC] = useState(""); //가입 승인 코드

  function RequestRegister() {}
  function ResponseRegister() {}

  return (
    <div className="w-96 h-fit min-h-75 bg-white flex flex-col p-8 rounded-xl shadow-md">
      <p className="self-center text-2xl">가입</p>
      <Input
        className="mt-8 text-[15px]"
        inputProps={{
          className:
            "flex-1 rounded-lg bg-gray-100 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-400",
          placeholder: "닉네임",
          onChange: (e) => {
            setId(e.target.value);
          },
        }}
      />
      <Input
        className="mt-6 text-[15px]"
        inputProps={{
          className:
            "flex-1 rounded-lg bg-gray-100 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-400",
          placeholder: "비밀번호",
          onChange: (e) => {
            setPassword(e.target.value);
          },
        }}
      />
      <Input
        className="mt-6 text-[15px]"
        inputProps={{
          className:
            "flex-1 rounded-lg bg-gray-100 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-400",
          placeholder: "비밀번호 확인",
          onChange: (e) => {
            setConfirmPassword(e.target.value);
          },
        }}
      />
      <Input
        className="mt-6 text-[15px]"
        inputProps={{
          className:
            "flex-1 rounded-lg bg-gray-100 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-400",
          placeholder: "승인코드",
          onChange: (e) => {
            setVC(e.target.value);
          },
        }}
      />
      <Button
        className="mt-6 text-[14px] rounded-xl bg-blue-400 border-none font-bold text-white hover:bg-blue-500 focus:bg-blue-500"
        onClick={RequestRegister}>
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
