import { useState } from "react";

import Input from "@/client/components/Input";
import Button from "@/client/components/Button";

import { AccountChildProps } from "./Account";

export default function Login({ setActiveLoginPage }: AccountChildProps) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("black");

  async function RequestLogin() {
    setMessageColor("red");
    if (!id || !password) {
      setMessage("필수 입력값이 입력되지 않았습니다.");
      return;
    }

    setMessageColor("black");
    setMessage("로그인 시도중...");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id, password: password }),
      credentials: "include",
    });

    if (res.ok) {
      setMessage("로그인 성공");
      window.location.reload();
      return;
    }

    setMessageColor("red-500");
    if (res.status === 401) {
      setMessage("아이디 또는 비밀번호가 다릅니다.");
      return;
    }

    setMessage("오류, 다시 시도해주세요");
  }

  return (
    <div className="w-80 h-fit min-h-60 bg-white flex flex-col p-6 rounded-xl shadow-md">
      <p className="self-center text-2xl">로그인</p>
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
          type: "password",
          onChange: (e) => {
            setPassword(e.target.value);
          },
        }}
      />
      <Button
        className="mt-6 text-[14px] rounded-xl bg-blue-400 border-none font-bold text-white hover:bg-blue-500 focus:bg-blue-500"
        onClick={RequestLogin}>
        로그인
      </Button>
      {message === "" ? null : (
        <span className={`text-${messageColor}`}>{message}</span>
      )}
      <button
        className="cursor-pointer self-center mt-4 text-[13px] text-gray-500"
        onClick={() => setActiveLoginPage(false)}>
        가입하기
      </button>
    </div>
  );
}
