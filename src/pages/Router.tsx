// src/App.tsx
import { Routes, Route } from "react-router-dom";
import { useActivityRefresh, useAuthInfo } from "@/hooks";

import { Modal } from "@/components";
import { Account } from "@/widget";

import NotFound from "./NotFound";
import Home from "./Home";
import Driver from "./Driver";
import Passenger from "./Passenger";
import Taxi from "./Taxi";

export default function Router() {
  const { isLoggedIn } = useAuthInfo();

  if (isLoggedIn === null) return <></>;
  if (!isLoggedIn) {
    return <Modal active={!isLoggedIn} Child={Account} />;
  }

  useActivityRefresh();

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/driver" element={<Driver />} />
        <Route path="/passenger" element={<Passenger />} />
        <Route path="/taxi" element={<Taxi />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
