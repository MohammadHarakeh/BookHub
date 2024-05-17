"use client";
import React, { useEffect, useState } from "react";
import "./page.css";
import "../../globals.css";
import { sendRequest } from "../../tools/apiRequest";
import { requestMethods } from "../../tools/apiRequestMethods";
import defaultImage from "../../../../public/images/defaultImage.png";
import { ToastContainer, toast } from "react-toastify";

interface UserData {
  _id: string;
  username: string;
  following: boolean;
  profile: {
    profile_picture: string;
  };
}

const HomeRight: React.FC = () => {
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [visibleUsers, setVisibleUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await sendRequest(
        requestMethods.GET,
        `/user/getAllUsers`
      );

      if (response.status === 200) {
        const newUsers = response.data.users;
        console.log(response.data.users);

        if (newUsers.length === 0) {
          setHasMoreUsers(false);
          return;
        }

        const shuffledUsers = newUsers.sort(() => Math.random() - 0.5);

        const sixRandomUsers = shuffledUsers.slice(0, 6);

        setAllUsers(sixRandomUsers);
        setVisibleUsers(sixRandomUsers.slice(0, 3));
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const followingUsers = async () => {
    try {
      const response = await sendRequest(
        requestMethods.GET,
        `/user/getFollowedUser`
      );

      if (response.status !== 200) {
        console.log("failed to fetch following users");
      }
    } catch (error) {
      console.log("Error can't get followed user");
    }
  };

  const toggleFollow = async (followeeId: string) => {
    try {
      const response = await sendRequest(
        requestMethods.POST,
        `/user/followUser/${followeeId}`
      );

      if (response.status === 200) {
        console.log("Followed/Unfollowed user successfully");

        setVisibleUsers((prevVisibleUsers) =>
          prevVisibleUsers.map((user) =>
            user._id === followeeId
              ? { ...user, following: !user.following }
              : user
          )
        );
        followingUsers();
      } else {
        console.log("Failed to toggle follow");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowMore = () => {
    const nextIndex = visibleUsers.length + 2;
    setVisibleUsers(allUsers.slice(0, nextIndex));
    if (nextIndex >= allUsers.length) {
      setHasMoreUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="homepage-right">
      <div className="right-title">Suggested Users</div>
      <div className="right-container">
        {visibleUsers.map((user) => (
          <div key={user._id} className="right-content">
            {user.profile.profile_picture ? (
              user.profile.profile_picture.startsWith("https://") ? (
                <img src={user.profile.profile_picture} alt={user.username} />
              ) : (
                <img
                  src={`http://localhost:3001/${
                    user.profile.profile_picture.split("profilePictures\\")[1]
                  }`}
                  alt={user.username}
                />
              )
            ) : (
              <img src={defaultImage.src} alt="Default" />
            )}

            <p>{user.username}</p>

            <button
              className="general-button"
              onClick={() => {
                toggleFollow(user._id);
              }}
            >
              {user.following ? "Unfollow" : "Follow"}
            </button>
          </div>
        ))}
        {loading && <p>Loading...</p>}
        {!loading && hasMoreUsers && (
          <p className="show-more-button" onClick={handleShowMore}>
            Show More
          </p>
        )}
        {!loading && !hasMoreUsers && (
          <p className="no-more-text">No more users to show</p>
        )}
      </div>
    </div>
  );
};

export default HomeRight;
