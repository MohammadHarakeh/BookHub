import React, { useEffect } from "react";
import "./page.css";
import defaultImage from "../../../../public/images/defaultImage.png";
import { useEmailContext } from "@/context/emailContext";
import { GoPersonFill } from "react-icons/go";

const ProfileLeft = () => {
  const { userInfo } = useEmailContext();

  return (
    <div className="profileleft-wrapper">
      <div className="profileleft-image">
        <img
          src={
            userInfo.user?.profile?.profile_picture
              ? userInfo.user.profile.profile_picture
              : defaultImage.src
          }
          alt="User Picture"
        />
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
      <div className="general-button">Edit Profile</div>
      <div className="following-info-wrapper">
        <div>
          <GoPersonFill />
        </div>
        <div className="following-count">
          {userInfo.user?.following ? userInfo.user?.following?.length : 0}

          <p>following</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileLeft;
