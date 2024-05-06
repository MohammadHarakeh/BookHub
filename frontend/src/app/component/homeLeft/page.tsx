"use client";
import React, { useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import "./page.css";
import { useRouter } from "next/navigation";
import { useEmailContext } from "@/context/emailContext";

interface Repository {
  name: string;
  description: string;
  visibility: string;
  _id: string;
  createdAt: string;
}

interface UserProfile {
  profile: {
    bio: string;
    location: string;
    profile_picture: string;
    linkedin_link: string;
    instagram_link: string;
  };
  _id: string;
  username: string;
  email: string;
  password: string;
  followers: any[];
  posts: any[];
  repositories: Repository[];
}

interface UserInfo {
  [key: string]: any;
  user: UserProfile;
}

const HomeLeft: React.FC = () => {
  const router = useRouter();
  const { userInfo } = useEmailContext();

  useEffect(() => {
    if (userInfo.length === 0) {
      return;
    }
    console.log(userInfo.user);
  }, [userInfo]);

  return (
    <div className="homepage-left">
      <div className="homepage-left-title">
        <p>Collaboration</p>
        <button
          onClick={() => router.push("/createRepo")}
          className="general-button"
        >
          <FaPlus /> New
        </button>
      </div>

      <div className="homepage-left-stories">
        {userInfo.user &&
          userInfo.user.repositories &&
          userInfo.user.repositories.length > 0 && (
            <div className="user-stories">
              {userInfo.user.repositories.map(
                (repo: Repository, index: number) => (
                  <p key={index} onClick={() => console.log(repo._id)}>
                    {repo.name}
                  </p>
                )
              )}
            </div>
          )}
      </div>
    </div>
  );
};

export default HomeLeft;
