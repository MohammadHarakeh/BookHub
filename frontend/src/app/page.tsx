"use client";
import "./globals.css";
import "./page.css";
import Header from "../app/component/header/page";
import Footer from "../app/component/footer/page";
import HomeLeft from "../app/component/homeLeft/page";
import HomeMiddle from "../app/component/homeMiddle/page";
import HomeRight from "../app/component/homeRight/page";
import { useEmailContext } from "@/context/emailContext";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const { themeMode } = useEmailContext();

  return (
    <div className={`home-wrapper ${themeMode === "dark" ? "" : "light-mode"}`}>
      <ToastContainer
        theme="dark"
        toastStyle={{ backgroundColor: "#0e0f32" }}
      />
      <Header />
      <div className="homepage-wrapper">
        <HomeLeft />
        <HomeMiddle />
        <HomeRight />
      </div>
      <Footer />
    </div>
  );
}
