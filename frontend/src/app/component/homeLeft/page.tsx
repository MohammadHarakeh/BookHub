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
  const { setRepoInfo } = useEmailContext();
  const { collabInfo, setCollabInfo } = useEmailContext();
  const { setAllCollaboratingRepos } = useEmailContext();
  const [collabInfoId, setCollabInfoId] = useState<string>();
  const [displayedRepositories, setDisplayedRepositories] = useState(3);
  const [
    displayedCollaboratingRepositories,
    setDisplayedCollaboratingRepositories,
  ] = useState(3);
  const [collaboratingReposInfo, setCollaboratingReposInfo] = useState<any[]>(
    []
  );

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

  const clickedCollabRepoInfo = async (repositoryId: string) => {
    try {
      const response = await sendRequest(
        requestMethods.GET,
        `/user/getRepository/${repositoryId}`
      );

      if (response.status === 200) {
        setCollabInfoId(response.data.repository._id);
        console.log(response.data.repository._id);
        router.push("/editCollaboratorRepo");
      } else {
        console.log("Failed to get repo data");
      }
    } catch (error) {
      console.log("Error getting repo data", error);
    }
  };

  const collaboratingRepoInfo = async (repoIds: string[]) => {
    try {
      const collaboratingRepos = [];

      for (const repoId of repoIds) {
        const response = await sendRequest(
          requestMethods.GET,
          `user/collaborating-repos/${repoId}`
        );

        if (response.status === 200) {
          collaboratingRepos.push(response.data);
        } else {
          console.log(
            `Failed to get collaborating repo data for repo ID ${repoId}`
          );
        }
      }

      return collaboratingRepos;
    } catch (error) {
      console.log("Error getting collaborating repo data", error);
      return [];
    }
  };

  const singleRepoInfo = async () => {
    try {
      const response = await sendRequest(
        requestMethods.GET,
        `user/collaborating-repos/${collabInfoId}`
      );

      if (response.status === 200) {
        console.log(response.data);
        setCollabInfo(response.data);
      } else {
        console.log(`Failed to get collaborating repo data for repo ID`);
      }
    } catch (error) {
      console.log("Error getting collaborating repo data", error);
    }
  };

  const fetchCollaboratingRepos = async () => {
    if (
      userInfo &&
      userInfo.user &&
      userInfo.user.collaboratingRepositories &&
      userInfo.user.collaboratingRepositories.length > 0
    ) {
      console.log(
        "User Collaborating Repos:",
        userInfo.user.collaboratingRepositories
      );
      const repoIds = userInfo.user.collaboratingRepositories.map(
        (repo: any) => repo._id
      );
      console.log("Repository IDs:", repoIds);
      const collaboratingRepos = await collaboratingRepoInfo(repoIds);
      console.log("Collaborating Repos:", collaboratingRepos);
      setCollaboratingReposInfo(collaboratingRepos);
      setAllCollaboratingRepos(collaboratingRepos);
    }
  };

  const handleShowMore = () => {
    setDisplayedRepositories((prev) => prev + 3);
  };

  const handleShowMoreCollabRepos = () => {
    setDisplayedCollaboratingRepositories((prev) => prev + 3);
  };

  useEffect(() => {
    fetchCollaboratingRepos();
    singleRepoInfo();
  }, [userInfo]);

  useEffect(() => {
    singleRepoInfo();
  }, [collabInfoId]);

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
        <div className="user-repositories">
          <h2>Your Repositories</h2>
          {userInfo &&
            userInfo.user &&
            userInfo.user.repositories.length === 0 && (
              <div className="empty-repo">
                <p>You currently have no repositories.</p>
              </div>
            )}
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

        <div className="collaborating-repositories">
          <h2>Collaborating Repositories</h2>
          {collaboratingReposInfo.length === 0 && (
            <div className="empty-repo">
              <p>You currently have no collaborating repositories.</p>
            </div>
          )}

          {collaboratingReposInfo.length > 0 && (
            <div className="user-stories">
              {collaboratingReposInfo
                .slice(0, displayedCollaboratingRepositories)
                .map((repo: any, index: number) => (
                  <p
                    key={index}
                    onClick={() => {
                      clickedCollabRepoInfo(repo.repositoryId);
                    }}
                  >
                    {repo.name}
                  </p>
                ))}

              {collaboratingReposInfo.length >
                displayedCollaboratingRepositories && (
                <div className="story-left-button">
                  <button
                    onClick={handleShowMoreCollabRepos}
                    className="general-button"
                  >
                    Show More
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeLeft;
