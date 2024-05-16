"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import "../globals.css";
import Header from "../component/header/page";
import Footer from "../component/footer/page";
import { requestMethods } from "../tools/apiRequestMethods";
import { sendRequest } from "../tools/apiRequest";
import { useEmailContext } from "@/context/emailContext";
import defaultImage from "../../../public/images/defaultImage.png";
import inviteImage from "../../../public/images/invite.jpeg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { IoMdClose } from "react-icons/io";

const VersionDifference = () => {
  const { userInfo } = useEmailContext();
  const { repoInfo } = useEmailContext();
  const { storyDifference, setStoryDifference } = useEmailContext();

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

  const formatContentWithFormatting = (content: string, selection: any) => {
    if (!selection) return content;

    const { index, length, fontColor, fontStyle, fontFamily } = selection;
    if (!fontColor || !fontStyle || !fontFamily) return content;

    const startTag = `<span style="color: ${fontColor}; font-style: ${fontStyle}; font-family: ${fontFamily};">`;
    const endTag = "</span>";
    const start = content.slice(0, index);
    const selectedText = content.slice(index, index + length);
    const end = content.slice(index + length);
    return start + startTag + selectedText + endTag + end;
  };

  useEffect(() => {
    console.log("story difference: ", storyDifference);
  }, []);

  return (
    <div>
      <Header />
      <div className={styles.edit_repo_wrapper}>
        <ToastContainer
          theme="dark"
          toastStyle={{ backgroundColor: "#0e0f32" }}
        />
        <div className={styles.story_info}>
          <div className={styles.story_info}>
            {repoInfo &&
            repoInfo.repo_picture !== undefined &&
            repoInfo.repo_picture !== "" ? (
              <img
                src={repoInfo.repo_picture}
                className={styles.repo_image}
              ></img>
            ) : (
              <img src={defaultImage.src} className={styles.repo_image}></img>
            )}

            <p className={styles.story_name}>
              {repoInfo ? repoInfo.name : "Loading..."}
            </p>
            <p
              className={`${`general-input`} ${styles.story_visibility_status}`}
            >
              {repoInfo ? repoInfo.visibility : "Loading..."}
            </p>
          </div>
        </div>
        <hr />

        <div className={styles.edit_repo_info}>
          <ReactQuill
            value={storyDifference.previousContent}
            modules={{
              toolbar: [
                [{ font: [] }],
                [{ size: [] }],
                [{ color: colorOptions }],
                ["bold", "italic", "underline"],
              ],
            }}
            style={{
              height: "400px",
              scrollbarWidth: "thin",
            }}
          />
        </div>
      </div>
      <hr />
      <Footer />
    </div>
  );
};

export default VersionDifference;
