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
    <div className="w-screen h-screen pb-60 flex flex-col justify-center items-center bg-gray-50">
      <div className="m-8 mb-28 max-h-32">
        <img src={baner} className="w-auto h-full object-contain" />
      </div>
      {activeLoginPage ? (
        <Login setActiveLoginPage={setActiveLoginPage} />
      ) : (
        <Register setActiveLoginPage={setActiveLoginPage} />
      )}
    </div>
  );
}
