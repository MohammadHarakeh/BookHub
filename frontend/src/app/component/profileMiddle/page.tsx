import React, { useEffect } from "react";
import "./page.css";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEmailContext } from "@/context/emailContext";

const ProfileMiddle = () => {
  const router = useRouter();
  const { userInfo } = useEmailContext(); //get user repos from this
  const { allCollaboratingRepos } = useEmailContext();

  useEffect(() => {
    console.log("profile all collaboartions: ", allCollaboratingRepos);
  }, [allCollaboratingRepos]);

  useEffect(() => {
    console.log("profile userinfo: ", userInfo.user.repositories);
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
            <div key={repo._id}>{repo.name}</div>
          ))
        ) : (
          <div>
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
    </div>
  );
};

export default ProfileMiddle;
