import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound"; // Update import path

export default function MyRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Finally, catch all unmatched routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
