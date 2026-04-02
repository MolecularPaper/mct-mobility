import { useState } from "react";

import Login from "./Login";
import Register from "./Register";

import baner from "@/assets/account_baner.png";

export interface AccountChildProps {
  setActiveLoginPage: (v: boolean) => void;
}

export default function Account() {
  const [activeLoginPage, setActiveLoginPage] = useState(true);

  return (
    <div className="relative w-screen h-screen flex flex-col justify-center items-center bg-gray-50">
      <div
        className="absolute inset-0 opacity-50 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${baner})` }}
      />
      <div className="relative z-10 flex flex-col items-center">
        {activeLoginPage ? (
          <Login setActiveLoginPage={setActiveLoginPage} />
        ) : (
          <Register setActiveLoginPage={setActiveLoginPage} />
        )}
      </div>
    </div>
  );
}
