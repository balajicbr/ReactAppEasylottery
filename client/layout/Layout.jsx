import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import MobileNavBar from "../components/MobileNavBar/MobileNavBar";

export default function AppLayout() {
  return (
    <>
      <Header />
      <main className="page-content">
        <Outlet />
      </main>
      <MobileNavBar />
    </>
  );
}
