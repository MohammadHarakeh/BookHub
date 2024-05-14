import React from "react";
import "./page.css";
import defaultImage from "../../../../public/images/defaultImage.png";
import { useEmailContext } from "@/context/emailContext";

const ProfileLeft = () => {
  const { userLoggedIn, setUserLoggedIn } = useEmailContext();

  return (
    <div className="pageleft-wrapper">
      <div className="pageleft-image">
        <img src={defaultImage.src}></img>
      </div>
    </div>
  );
};

export default ProfileLeft;
