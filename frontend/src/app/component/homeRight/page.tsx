"use client";
import React, { useEffect, useState } from "react";
import "./page.css";
import "../../globals.css";
import { sendRequest } from "../../tools/apiRequest";
import { requestMethods } from "../../tools/apiRequestMethods";

interface UserData {
  _id: string;
  username: string;
  profile: {
    profile_picture: string;
  };
}

const HomeRight: React.FC = () => {
  const [allUsers, setAllUsers] = useState<UserData[]>([]);

  const getAllUsers = async () => {
    try {
      const response = await sendRequest(
        requestMethods.GET,
        `/user/getAllUsers`
      );

      if (response.status === 200) {
        console.log("Fetched all users successfully:", response.data.users);
        setAllUsers(response.data.users);
      } else {
        console.error("Failed to fetch all users");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="homepage-right">
      <div className="right-title">Suggested Users</div>
      <div className="right-container">
        {allUsers.map((user) => (
          <div key={user._id} className="right-content">
            <img src={user.profile.profile_picture}></img>
            <p>{user.username}</p>
            <button className="general-button">Follow</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeRight;
