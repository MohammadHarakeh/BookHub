import React from "react";
import "./page.css";
import { FaPlus } from "react-icons/fa";

const ProfileMiddle = () => {
  return (
    <div className="profile-middle-wrapper">
      <div className="profile-middle-title">
        <p>Recently worked on stories</p>
      </div>
      <div className="profile-middle-stories">
        <p>You haven't worked on any story</p>
        <p>Create a story now</p>
        <button className="general-button">
          <FaPlus /> New
        </button>
      </div>
    </div>
  );
};

export default ProfileMiddle;
