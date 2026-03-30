import { useState } from "react";

import Login from "./Login";
import Register from "./Register";

export interface AccountChildProps {
  setActiveLoginPage: (v: boolean) => void;
}

export default function Account() {
  const [activeLoginPage, setActiveLoginPage] = useState(true);

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-50">
      {activeLoginPage ? (
        <Login setActiveLoginPage={setActiveLoginPage} />
      ) : (
        <Register setActiveLoginPage={setActiveLoginPage} />
      )}
    </div>
  );
}
