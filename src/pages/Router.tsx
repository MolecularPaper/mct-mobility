// src/App.tsx
import { Routes, Route } from "react-router-dom";

import { useUser } from "@/types/user";

import Modal from "@/components/Modal";
import Account from "@/widget/Account/Account";

import NotFound from "./NotFound";
import Home from "./Home";
import Driver from "./Driver";
import Passenger from "./Passenger";
import Taxi from "./Taxi";

export default function Router() {
  const isLogin = useUser((state) => state.isLogin);

  return (
    <div>
      <Modal active={!isLogin} Child={Account} />
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
