"use client";
import React, { useEffect, useState } from "react";
import "./page.css";
import Header from "../component/header/page";
import Footer from "../component/footer/page";
import { requestMethods } from "../tools/apiRequestMethods";
import { sendRequest } from "../tools/apiRequest";
import { useEmailContext } from "@/context/emailContext";
import defaultImage from "../../../public/images/defaultImage.png";
import { toast } from "react-toastify";

const EditRepo = () => {
  const [loggedUserInfo, setLoggedUserInfo] = useState<any>();
  const [content, setContent] = useState<string>();
  const { userInfo } = useEmailContext();
  const { repoInfo } = useEmailContext();

  const commitRepo = async () => {
    try {
      const body = {
        content: content,
      };

      const response = await sendRequest(
        requestMethods.POST,
        `/user/uploadRepositoryContent/${repoInfo._id}`,
        body
      );

      if (response.status === 200) {
        console.log("Commit added successfully");
        toast.success("Commit added successfully");
      } else {
        console.log("Failed to add commit");
        toast.error("Failed to add commit");
      }
    } catch (error) {
      console.log("Error can't add commit", error);
      toast.error("Error can't add commit");
    }
  };

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);

  useEffect(() => {
    if (repoInfo) {
      console.log("repo info: ", repoInfo);
    }
  }, [repoInfo]);

  return (
    <div className="edit-repo-wrapper">
      <Header />
      <div className="story-info">
        <div className="story-info">
          {repoInfo &&
          repoInfo.repo_picture !== undefined &&
          repoInfo.repo_picture !== "" ? (
            <img src={repoInfo.repo_picture}></img>
          ) : (
            <img src={defaultImage.src}></img>
          )}

          <p className="story-name">
            {repoInfo ? repoInfo.name : "Loading..."}
          </p>
          <p className="general-input story-visibility-status">
            {repoInfo ? repoInfo.visibility : "Loading..."}
          </p>
        </div>
        <p>{loggedUserInfo?.user?.username ?? "Loading..."}</p>
        <div className="story-collaborators">
          <p>Collaborators</p>
        </div>
      </div>
      <hr />

      {repoInfo && repoInfo.versions && repoInfo.versions.length > 0 ? (
        <div className="edit-repo-info">
          <textarea
            value={repoInfo.versions[repoInfo.versions.length - 1].content}
          ></textarea>
        </div>
      ) : (
        <div className="edit-repo-info">
          <textarea></textarea>
        </div>
      )}

      <div className="edit-repo-button">
        <button className="general-button">Commit</button>
      </div>
      <hr />
      <Footer />
    </div>
  );
};

export default EditRepo;
