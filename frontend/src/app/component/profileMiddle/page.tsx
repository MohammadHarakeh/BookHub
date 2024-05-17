import React, { useEffect, useState } from "react";
import "./page.css";
import "../../globals.css";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEmailContext } from "@/context/emailContext";
import { formatDistanceToNow } from "date-fns";
import { FaStar } from "react-icons/fa";
import { sendRequest } from "@/app/tools/apiRequest";
import { requestMethods } from "@/app/tools/apiRequestMethods";
import { toast } from "react-toastify";

const ProfileMiddle = () => {
  const router = useRouter();
  const { userInfo } = useEmailContext();
  const { allCollaboratingRepos } = useEmailContext();
  const { storyVersions, setStoryVersions } = useEmailContext();
  const { collabInfo, setCollabInfo } = useEmailContext();

  const clickedRepoInfo = async (repositoryId: string) => {
    try {
      const response = await sendRequest(
        requestMethods.GET,
        `/user/getRepository/${repositoryId}`
      );

      if (response.status === 200) {
        console.log(response.data.repository);
        setStoryVersions(response.data.repository);
        router.push("/storyVersions");
      } else {
        console.log("Failed to get repo data");
      }
    } catch (error) {
      console.log("Error getting repo data", error);
    }
  };

  const singleRepoInfo = async (repositoryId: string) => {
    try {
      const response = await sendRequest(
        requestMethods.GET,
        `user/collaborating-repos/${repositoryId}`
      );

      if (response.status === 200) {
        console.log(response.data);
        setCollabInfo(response.data);
        router.push("/storyCollaboratorVersions");
      } else {
        console.log(`Failed to get collaborating repo data for repo ID`);
      }
    } catch (error) {
      console.log("Error getting collaborating repo data", error);
    }
  };

  const starRepo = async (repositoryId: string) => {
    try {
      const response = await sendRequest(
        requestMethods.POST,
        `user/starRepo/${repositoryId}`
      );

      if (response.status === 200) {
        console.log("Repository added to favorits");
        toast.success("Repository added to favorits");
      } else {
        console.log("Failed to add repository to favorits");
        toast.error("Failed to add repository to favorits");
      }
    } catch (error) {
      console.log("Error can't add repository to favorits: ", error);
      toast.error("Error can't add repository to favorits");
    }
  };

  useEffect(() => {
    console.log("profile all collaboartions: ", allCollaboratingRepos);
  }, [allCollaboratingRepos]);

  useEffect(() => {
    console.log("profile userinfo: ", userInfo?.user?.repositories);
  }, [userInfo]);

  return (
    <div className="profile-middle-wrapper">
      <div className="profile-middle-title">
        <p>Recently worked on stories</p>
      </div>
      <div className="profile-middle-stories">
        {userInfo &&
        userInfo.user &&
        userInfo.user.repositories &&
        userInfo.user.repositories.length > 0 ? (
          userInfo.user.repositories.map((repo: any) => (
            <div key={repo._id} className="repo-container">
              <div className="repo-container-info-wrapper">
                <div className="repo-container-info">
                  <div className="repo-info">
                    <p
                      onClick={() => {
                        clickedRepoInfo(repo._id);
                      }}
                      className="repo-container-name"
                    >
                      {repo.name}
                    </p>
                    <p className="general-input repo-styling">
                      {repo.visibility}
                    </p>
                  </div>
                  <div className="general-input repo-styling star-styling">
                    <FaStar /> Star
                  </div>
                </div>
                <div>
                  <p className="repo-time">
                    {formatDistanceToNow(new Date(repo.createdAt))} ago
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="profile-empty-state">
            <p>You haven't worked on any story</p>
            <p>Create a story now</p>
            <button
              className="general-button"
              onClick={() => router.push("/createRepo")}
            >
              <FaPlus /> New
            </button>
          </div>
        )}
      </div>

      <div className="profile-middle-title">
        <p>Collaborating Stories</p>
      </div>
      <div className="profile-middle-stories">
        {allCollaboratingRepos && allCollaboratingRepos.length > 0 ? (
          allCollaboratingRepos.map((repo: any) => (
            <div key={repo.repositoryId} className="repo-container">
              <div className="repo-container-info-wrapper">
                <div className="repo-container-info">
                  <div className="repo-info">
                    <p
                      onClick={() => {
                        singleRepoInfo(repo.repositoryId);
                      }}
                      className="repo-container-name"
                    >
                      {repo.name}
                    </p>
                    <p className="general-input repo-styling">
                      {repo.visibility}
                    </p>
                  </div>
                  <div className="general-input repo-styling star-styling">
                    <FaStar /> Star
                  </div>
                </div>
                <div>
                  <p className="repo-time">
                    {formatDistanceToNow(new Date(repo.createdAt))} ago
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="profile-empty-state">
            <p>You haven't collaborated on any stories</p>
            <p>Get invited by a user to collaborate</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileMiddle;
