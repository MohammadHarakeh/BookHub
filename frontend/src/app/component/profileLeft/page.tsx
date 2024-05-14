import React, { useEffect } from "react";
import "./page.css";
import defaultImage from "../../../../public/images/defaultImage.png";
import { useEmailContext } from "@/context/emailContext";

const ProfileLeft = () => {
  const { userInfo } = useEmailContext();

  return (
    <div className="pageleft-wrapper">
      <div className="pageleft-image">
        <img
          src={userInfo.user?.profile?.profile_picture}
          alt="User Picture"
        ></img>
      </div>
    </div>
  );
};

export default ProfileLeft;
