// src/App.tsx
import { Routes, Route } from "react-router-dom";

import NotFound from "./NotFound";
import Home from "./Home";
import Driver from "./Driver";
import Passenger from "./Passenger";

export default function Router() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/driver" element={<Driver />} />
        <Route path="/passenger" element={<Passenger />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
