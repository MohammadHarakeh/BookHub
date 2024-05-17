import React, { useState } from "react";
import "./page.css";
import defaultImage from "../../../../public/images/defaultImage.png";
import { useEmailContext } from "@/context/emailContext";
import { GoPersonFill } from "react-icons/go";

const ProfileLeft = () => {
  const { userInfo } = useEmailContext();
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    username: userInfo.user?.username || "",
    bio: userInfo.user?.profile?.bio || "",
    location: userInfo.user?.profile?.location || "",
    linkedin_link: userInfo.user?.profile?.linkedin_link || "",
    instagram_link: userInfo.user?.profile?.instagram_link || "",
    twitter_link: userInfo.user?.profile?.twitter_link || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

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
        {editMode ? (
          <input
            className="general-input"
            type="text"
            name="username"
            placeholder="Username"
            value={profileData.username}
            onChange={handleInputChange}
          />
        ) : (
          <p>{userInfo.user?.username}</p>
        )}
        {editMode ? (
          <input
            className="general-input"
            type="text"
            name="bio"
            placeholder="Bio"
            value={profileData.bio}
            onChange={handleInputChange}
          />
        ) : (
          userInfo.user?.profile?.bio && <p>{userInfo.user.profile.bio}</p>
        )}
      </div>
      <div className="general-button" onClick={toggleEditMode}>
        {editMode ? "Save Profile" : "Edit Profile"}
      </div>
      <div className="following-info-wrapper">
        <div>
          <GoPersonFill />
        </div>
        <div className="following-count">
          {userInfo.user?.following ? userInfo.user?.following?.length : 0}
          <p>following - </p>
          {userInfo.user?.followers ? userInfo.user?.followers?.length : 0}
          <p>followers</p>
        </div>
        <div>
          {editMode ? (
            <div className="edit-section">
              <input
                className="general-input"
                type="text"
                name="location"
                placeholder="Location"
                value={profileData.location}
                onChange={handleInputChange}
              />
              <input
                className="general-input"
                type="text"
                name="linkedin_link"
                placeholder="LinkedIn"
                value={profileData.linkedin_link}
                onChange={handleInputChange}
              />
              <input
                className="general-input"
                type="text"
                name="instagram_link"
                placeholder="Instagram"
                value={profileData.instagram_link}
                onChange={handleInputChange}
              />
              <input
                className="general-input"
                type="text"
                name="twitter_link"
                placeholder="Twitter"
                value={profileData.twitter_link}
                onChange={handleInputChange}
              />
            </div>
          ) : (
            <>
              {userInfo.user?.profile?.location && (
                <p>{userInfo.user.profile.location}</p>
              )}
              {userInfo.user?.profile?.linkedin_link && (
                <p>{userInfo.user.profile.linkedin_link}</p>
              )}
              {userInfo.user?.profile?.instagram_link && (
                <p>{userInfo.user.profile.instagram_link}</p>
              )}
              {userInfo.user?.profile?.twitter_link && (
                <p>{userInfo.user.profile.twitter_link}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileLeft;
