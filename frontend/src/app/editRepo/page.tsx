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
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditRepo = () => {
  const [content, setContent] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState("black");
  const [selectedFontStyle, setSelectedFontStyle] = useState("normal");
  const { userInfo } = useEmailContext();
  const { repoInfo } = useEmailContext();
  const colorOptions = ["black", "red", "blue", "green"];
  const fontStyleOptions = ["normal", "italic", "oblique"];

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

  // const changeTextColor = (color: string) => {
  //   setTextColor(color);
  // };

  // const changeFontStyle = (style: string) => {
  //   setFontStyle(style);
  // };

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
        <ReactQuill
          value={content}
          onChange={setContent}
          modules={{
            toolbar: [
              ["bold", "italic", "underline"],
              [{ color: colorOptions }, { font: fontStyleOptions }],
            ],
          }}
        />
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
