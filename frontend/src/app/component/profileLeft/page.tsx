import React from "react";
import "./page.css";
import defaultImage from "../../../../public/images/defaultImage.png";

const ProfileLeft = () => {
  return (
    <div className="pageleft-wrapper">
      <div className="pageleft-image">
        <img src={defaultImage.src}></img>
      </div>
    </div>
  );
};

export default ProfileLeft;
