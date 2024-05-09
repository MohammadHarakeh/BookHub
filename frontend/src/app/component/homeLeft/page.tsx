"use client";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import "./page.css";
import { useRouter } from "next/navigation";
import { useEmailContext } from "@/context/emailContext";
import { requestMethods } from "../../tools/apiRequestMethods";
import { sendRequest } from "../../tools/apiRequest";

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
  const { repoInfo, setRepoInfo } = useEmailContext();
  const [displayedRepositories, setDisplayedRepositories] = useState(3);

  const clickedRepoInfo = async (repositoryId: string) => {
    try {
      const response = await sendRequest(
        requestMethods.GET,
        `/user/getRepository/${repositoryId}`
      );

      if (response.status === 200) {
        setRepoInfo(response.data.repository);
        console.log(response.data.repository);
        router.push("/editRepo");
      } else {
        console.log("Failed to get repo data");
      }
    } catch (error) {
      console.log("Error getting repo data", error);
    }
  };

  const handleShowMore = () => {
    setDisplayedRepositories((prev) => prev + 3);
  };

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
              {userInfo.user.repositories
                .slice(0, displayedRepositories)
                .map((repo: Repository, index: number) => (
                  <p key={index} onClick={() => clickedRepoInfo(repo._id)}>
                    {repo.name}
                  </p>
                ))}
              {userInfo.user.repositories.length > displayedRepositories && (
                <div className="story-left-button">
                  <button onClick={handleShowMore} className="general-button">
                    Show More
                  </button>
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
};

export default HomeLeft;
