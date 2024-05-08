"use client";
import "./globals.css";
import "./page.css";
import Header from "../app/component/header/page";
import Footer from "../app/component/footer/page";
import HomeLeft from "../app/component/homeLeft/page";
import HomeMiddle from "../app/component/homeMiddle/page";
import HomeRight from "../app/component/homeRight/page";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  return (
    <div className="home-wrapper">
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
