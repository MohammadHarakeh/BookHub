import React from "react";
import "./page.css";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";

const ProfileMiddle = () => {
  const router = useRouter();
  return (
    <div className="profile-middle-wrapper">
      <div className="profile-middle-title">
        <p>Recently worked on stories</p>
      </div>
      <div className="profile-middle-stories">
        <p>You haven't worked on any story</p>
        <p>Create a story now</p>
        <button
          className="general-button"
          onClick={() => router.push("/createRepo")}
        >
          <FaPlus /> New
        </button>
      </div>
    </div>
  );
};

export default ProfileMiddle;
