import React, { useState, useRef, useEffect } from "react";
import "./page.css";
import defaultImage from "../../../../public/images/defaultImage.png";
import { useEmailContext } from "@/context/emailContext";
import { GoPersonFill } from "react-icons/go";
import { sendRequest } from "../../tools/apiRequest";
import { requestMethods } from "../../tools/apiRequestMethods";
import { ToastContainer, toast } from "react-toastify";

const ProfileLeft = () => {
  const { userInfo, setUserInfo } = useEmailContext();
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    username: userInfo.user?.username || "",
    bio: userInfo.user?.profile?.bio || "",
    location: userInfo.user?.profile?.location || "",
    linkedin_link: userInfo.user?.profile?.linkedin_link || "",
    instagram_link: userInfo.user?.profile?.instagram_link || "",
    twitter_link: userInfo.user?.profile?.twitter_link || "",
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const updateProfile = async () => {
    const formData = new FormData();
    formData.append("bio", profileData.bio);
    formData.append("location", profileData.location);
    formData.append("linkedin_link", profileData.linkedin_link);
    formData.append("instagram_link", profileData.instagram_link);
    formData.append("twitter_link", profileData.twitter_link);
    if (profilePicture) {
      formData.append("image", profilePicture);
    }

    try {
      const response = await sendRequest(
        requestMethods.POST,
        `user/updateProfile`,
        formData
      );
      if (response.status === 200) {
        toast.success("Profile updated successfully");
        setUserInfo({ ...userInfo, user: response.data.user });
        setEditMode(false);
        setProfilePicture(null); // Reset profilePicture after update
        setImagePreview(null); // Reset imagePreview after update
      }
    } catch (error) {
      toast.error("Profile update failed");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setProfilePicture(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleBackClick = () => {
    setEditMode(false);
    setProfileData({
      username: userInfo.user?.username || "",
      bio: userInfo.user?.profile?.bio || "",
      location: userInfo.user?.profile?.location || "",
      linkedin_link: userInfo.user?.profile?.linkedin_link || "",
      instagram_link: userInfo.user?.profile?.instagram_link || "",
      twitter_link: userInfo.user?.profile?.twitter_link || "",
    });
    setProfilePicture(null);
    setImagePreview(null);
  };

  useEffect(() => {
    if (userInfo.user?.profile?.profile_picture) {
      setImagePreview(
        userInfo.user.profile.profile_picture.startsWith("https://")
          ? userInfo.user.profile.profile_picture
          : `http://localhost:3001/${
              userInfo.user.profile.profile_picture.split(
                "profilePictures\\"
              )[1]
            }`
      );
    }
  }, [userInfo]);

  return (
    <div className="profileleft-wrapper">
      <ToastContainer
        theme="dark"
        toastStyle={{ backgroundColor: "#0e0f32" }}
      />
      <div className="profileleft-image" onClick={handleImageClick}>
        <img
          src={
            imagePreview
              ? imagePreview
              : userInfo.user.profile.profile_picture &&
                userInfo.user.profile.profile_picture.startsWith("https://")
              ? userInfo.user.profile.profile_picture
              : `http://localhost:3001/${
                  userInfo.user.profile.profile_picture.split(
                    "profilePicture\\"
                  )[1]
                }`
          }
          alt="User Picture"
        />

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
      </div>
      <div className="profileleft-info">
        {editMode ? (
          <>
            <input
              className="general-input"
              type="text"
              name="username"
              placeholder="Username"
              value={profileData.username}
              onChange={handleInputChange}
              disabled
            />
            <input
              className="general-input"
              type="text"
              name="bio"
              placeholder="Bio"
              value={profileData.bio}
              onChange={handleInputChange}
            />
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
            <div className="button-group">
              <div className="general-button" onClick={updateProfile}>
                Save Profile
              </div>
              <div className="general-button" onClick={handleBackClick}>
                Back
              </div>
            </div>
          </>
        ) : (
          <>
            <p>{userInfo.user?.username}</p>
            {userInfo.user?.profile?.bio && <p>{userInfo.user.profile.bio}</p>}
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
      {!editMode && (
        <div className="general-button" onClick={toggleEditMode}>
          Edit Profile
        </div>
      )}
      {!editMode && (
        <div className="following-info-wrapper">
          <div className="following-count">
            <GoPersonFill />
            {userInfo.user?.following ? userInfo.user.following.length : 0}
            <p>following - </p>
            {userInfo.user?.followers ? userInfo.user.followers.length : 0}
            <p>followers</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileLeft;
