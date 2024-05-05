"use client";
import React from "react";
import { FaPlus } from "react-icons/fa";
import "./page.css";
import { useRouter } from "next/navigation";

const HomeLeft: React.FC = () => {
  const router = useRouter();

  return (
    <div className="homepage-left">
      <div className="homepage-left-title">
        <p>Collaboration</p>
        <button className="general-button">
          <FaPlus onClick={() => router.push("/createRepo")} /> New
        </button>
      </div>

      <div className="homepage-left-stories">
        <p>Story name</p>
        <p>Story name</p>
        <p>Story name</p>
        <p>Story name</p>
      </div>
    </div>
  );
};

export default HomeLeft;
