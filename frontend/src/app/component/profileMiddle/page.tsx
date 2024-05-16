import React, { useEffect } from "react";
import "./page.css";
import "../../globals.css";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEmailContext } from "@/context/emailContext";
import { formatDistanceToNow } from "date-fns";
import { FaStar } from "react-icons/fa";

const ProfileMiddle = () => {
  const router = useRouter();
  const { userInfo } = useEmailContext(); //get user repos from this
  const { allCollaboratingRepos } = useEmailContext();

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
            <div
              key={repo._id}
              className="repo-container"
              onClick={() => {
                console.log(repo._id);
              }}
            >
              <div className="repo-container-info-wrapper">
                <div className="repo-container-info">
                  <div className="repo-info">
                    <p className="repo-container-name">{repo.name}</p>
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
            <div
              key={repo.repositoryId}
              onClick={() => {
                console.log(repo.repositoryId);
              }}
              className="repo-container"
            >
              <div className="repo-container-info-wrapper">
                <div className="repo-container-info">
                  <div className="repo-info">
                    <p className="repo-container-name">{repo.name}</p>
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
