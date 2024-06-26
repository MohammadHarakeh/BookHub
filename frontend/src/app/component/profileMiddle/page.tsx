import React, { useEffect, useState } from "react";
import "./page.css";
import "../../globals.css";
import { FaPlus, FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEmailContext } from "@/context/emailContext";
import { formatDistanceToNow } from "date-fns";
import { sendRequest } from "@/app/tools/apiRequest";
import { requestMethods } from "@/app/tools/apiRequestMethods";
import { toast } from "react-toastify";

interface Repository {
  _id: string;
  name: string;
  visibility: string;
  createdAt: string;
}

interface CollaboratingRepository {
  repositoryId: string;
  name: string;
  visibility: string;
  createdAt: string;
}

const ProfileMiddle: React.FC = () => {
  const router = useRouter();
  const { userInfo } = useEmailContext();
  const { allCollaboratingRepos } = useEmailContext();
  const { storyVersions, setStoryVersions } = useEmailContext();
  const { collabInfo, setCollabInfo } = useEmailContext();

  const [starredRepos, setStarredRepos] = useState<string[]>([]);

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

  const toggleStarRepo = async (repositoryId: string) => {
    try {
      const response = await sendRequest(
        requestMethods.POST,
        `user/toggleStarRepo/${repositoryId}`
      );

      if (response.status === 200) {
        console.log("Toggled favorite repository successfully");
        toast.success("Toggled favorite repository successfully");
        setStarredRepos((prevStarredRepos) =>
          prevStarredRepos.includes(repositoryId)
            ? prevStarredRepos.filter((id) => id !== repositoryId)
            : [...prevStarredRepos, repositoryId]
        );
      } else {
        console.log("Failed to toggle repository to favorites");
        toast.error("Failed to toggle repository to favorites");
      }
    } catch (error) {
      console.log("Error can't toggle repository to favorites: ", error);
      toast.error("Error can't toggle repository to favorites");
    }
  };

  const fetchStarredRepos = async () => {
    try {
      const response = await sendRequest(
        requestMethods.GET,
        `user/starredRepos`
      );

      if (response.status === 200) {
        setStarredRepos(response.data.starredRepos);
        console.log(response.data.starredRepos);
      } else {
        console.log("Failed to fetch starred repos");
      }
    } catch (error) {
      console.log("Error fetching starred repos", error);
    }
  };

  useEffect(() => {
    console.log("profile all collaborations: ", allCollaboratingRepos);
  }, [allCollaboratingRepos]);

  useEffect(() => {
    console.log("profile userinfo: ", userInfo?.user?.repositories);
    console.log("profile userinfo for user: ", userInfo?.user);
    fetchStarredRepos();
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
          userInfo.user.repositories.map((repo: Repository) => (
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
                  <div
                    onClick={() => toggleStarRepo(repo._id)}
                    className="general-input repo-styling star-styling"
                  >
                    <FaStar
                      color={
                        starredRepos.includes(repo._id) ? "yellow" : "white"
                      }
                    />{" "}
                    Star
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
          allCollaboratingRepos.map((repo: CollaboratingRepository) => (
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
                  <div
                    onClick={() => toggleStarRepo(repo.repositoryId)}
                    className="general-input repo-styling star-styling"
                  >
                    <FaStar
                      color={
                        starredRepos.includes(repo.repositoryId)
                          ? "yellow"
                          : "white"
                      }
                    />{" "}
                    Star
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
