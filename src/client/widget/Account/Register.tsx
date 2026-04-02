import { useState } from "react";

import Input from "@/client/components/Input";
import Button from "@/client/components/Button";

import { AccountChildProps } from "./Account";

export default function Register({ setActiveLoginPage }: AccountChildProps) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [vc, setVC] = useState(""); //가입 승인 코드
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("black");

  async function RequestRegister() {
    setMessageColor("red-500");

    if (!id || !password || !confirmPassword || !vc) {
      setMessage("필수 입력값이 입력되지 않았습니다.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("확인 비밀번호가 다릅니다!");
      return;
    }

    setMessageColor("black");
    setMessage("회원가입 시도중...");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password, vc: vc.trim() }),
      credentials: "include", // 쿠키 포함 필수
    });

    if (res.ok) {
      setMessageColor("green-500");
      setMessage("회원가입 성공, 로그인하세요!");
      return;
    }

    setMessageColor("red-500");
    if (res.status === 403) {
      setMessage("승인코드가 다릅니다");
      return;
    }

    if (res.status === 400) {
      setMessage("아이디 또는 비밀번호가 입력되지 않았습니다.");
      return;
    }

    if (res.status === 409) {
      setMessage("중복된 아이디 입니다. 다른 아이디를 사용해주세요.");
      return;
    }

    setMessage("오류, 다시 시도해주세요.");
  }

  return (
    <div className="w-80 h-fit min-h-60 bg-white flex flex-col p-6 rounded-xl shadow-md">
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
          type: "password",
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
          type: "password",
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
      {message === "" ? null : (
        <span className={`text-${messageColor}`}>{message}</span>
      )}
      <button
        className="cursor-pointer self-center mt-4 text-[13px] text-gray-500"
        onClick={() => setActiveLoginPage(true)}>
        로그인
      </button>
    </div>
  );
}
