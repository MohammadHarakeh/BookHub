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
  const [content, setContent] = useState<string>("");
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
    if (repoInfo && repoInfo.versions && repoInfo.versions.length > 0) {
      setContent(repoInfo.versions[repoInfo.versions.length - 1].content);
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
        <div className="story-collaborators">
          <p>Collaborators</p>
        </div>
      </div>
      <hr />

      <div className="edit-repo-info">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>

      <div className="edit-repo-button">
        <button className="general-button" onClick={commitRepo}>
          Commit
        </button>
      </div>
      <hr />
      <Footer />
    </div>
  );
};

export default EditRepo;
