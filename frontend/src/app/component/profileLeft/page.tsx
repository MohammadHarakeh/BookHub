import React, { useEffect } from "react";
import "./page.css";
import defaultImage from "../../../../public/images/defaultImage.png";
import { useEmailContext } from "@/context/emailContext";

const ProfileLeft = () => {
  const { userInfo } = useEmailContext();

  return (
    <div className="profileleft-wrapper">
      <div className="profileleft-image">
        <img
          src={userInfo.user?.profile?.profile_picture}
          alt="User Picture"
        ></img>
      </div>
      <div className="profileleft-info">
        <p>{userInfo.user?.username}</p>
        <p>{userInfo.user?.profile?.bio}</p>
        <p>
          {userInfo.user?.profile?.bio ? (
            userInfo.user.profile.bio
          ) : (
            <p>You have no bio</p>
          )}
        </p>
      </div>
    </div>
  );
};

export default ProfileLeft;
