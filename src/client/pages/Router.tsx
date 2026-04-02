// src/App.tsx
import { Routes, Route } from "react-router-dom";
import { useAuthRefresh, useAuthInfo } from "@/client/hooks";

import { Modal } from "@/client/components";
import { Account } from "@/client/widget";

import NotFound from "./NotFound";
import Home from "./Home";
import Driver from "./Driver";
import Passenger from "./Passenger";
import Taxi from "./Taxi";
import TaxiReservation from "./TaxiReservation";

export default function Router() {
  const { isLoggedIn } = useAuthInfo();
  useAuthRefresh(isLoggedIn);

  if (isLoggedIn === null) return <></>;
  if (!isLoggedIn) {
    return (
      <Modal active={!isLoggedIn}>
        <Account />
      </Modal>
    );
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/driver" element={<Driver />} />
        <Route path="/passenger" element={<Passenger />} />
        <Route path="/taxi" element={<Taxi />} />
        <Route path="/admin/taxi" element={<TaxiReservation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
