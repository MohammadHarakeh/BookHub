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
  const { userInfo } = useEmailContext();
  const { repoInfo } = useEmailContext();
  const [content, setContent] = useState<string>("");
  const [selection, setSelection] = useState<any>(null);
  const colorOptions = [
    "#ffffff", // White
    "#ff0000", // Red
    "#ff7f00", // Orange
    "#ffff00", // Yellow
    "#00ff00", // Green
    "#0000ff", // Blue
    "#4b0082", // Indigo
    "#9400d3", // Violet
  ];
  // const fontOptions = [
  //   "Arial",
  //   "Times New Roman",
  //   "Verdana",
  //   "Georgia",
  //   "Courier New",
  // ];

  const commitRepo = async () => {
    try {
      const formattedContent = formatContentWithFormatting(content, selection);
      const body = {
        content: formattedContent,
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

  const formatContentWithFormatting = (content: string, selection: any) => {
    if (!selection) return content;

    const { index, length } = selection;
    const startTag = `<span style="color: ${selection.fontColor}; font-style: ${selection.fontStyle}; font-family: ${selection.fontFamily};">`;
    const endTag = "</span>";
    const start = content.slice(0, index);
    const selectedText = content.slice(index, index + length);
    const end = content.slice(index + length);
    return start + startTag + selectedText + endTag + end;
  };

  useEffect(() => {
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
          onChangeSelection={setSelection}
          modules={{
            toolbar: [
              [{ font: [] }],
              [{ size: [] }],
              [{ color: colorOptions }],
              ["bold", "italic", "underline"],
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
