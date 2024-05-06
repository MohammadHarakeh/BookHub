"use client";
import React, { useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import "./page.css";
import { useRouter } from "next/navigation";
import { useEmailContext } from "@/context/emailContext";

const HomeLeft: React.FC = () => {
  const router = useRouter();
  const { userInfo } = useEmailContext();

  useEffect(() => {
    if (Object.keys(userInfo).length === 0 && userInfo.constructor === Object) {
    } else {
      console.log(userInfo.user);
    }
  }, [userInfo]);

  return (
    <div className="homepage-left">
      <div className="homepage-left-title">
        <p>Collaboration</p>
        <button
          onClick={() => router.push("/createRepo")}
          className="general-button"
        >
          <FaPlus /> New
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
