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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const VersionDifference = () => {
  const { repoInfo, storyDifference, collabInfo } = useEmailContext();

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

  useEffect(() => {
    console.log("story difference: ", storyDifference);
  }, []);

  const currentRepoInfo = repoInfo || collabInfo;

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
            {currentRepoInfo && currentRepoInfo.repo_picture ? (
              <img
                className={styles.repo_image}
                src={`http://localhost:3001/${
                  currentRepoInfo.repo_picture.split("repoPictures\\")[1]
                }`}
                alt={currentRepoInfo.name}
              />
            ) : (
              <img
                className={styles.repo_image}
                src={defaultImage.src}
                alt="Default Image"
              />
            )}

            <p className={styles.story_name}>
              {currentRepoInfo ? currentRepoInfo.name : "Loading..."}
            </p>
            <p
              className={`${`general-input`} ${styles.story_visibility_status}`}
            >
              {currentRepoInfo ? currentRepoInfo.visibility : "Loading..."}
            </p>
          </div>
        </div>
        <hr />

        <div className={styles.changes_information}>
          <div className={styles.edit_repo_info_previous}>
            <div className={styles.edit_repo_title}>
              <p>Previous</p>
            </div>
            <ReactQuill
              value={storyDifference?.previousContent}
              readOnly={true}
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

          <div className={styles.edit_repo_info_previous}>
            <div className={styles.edit_repo_title}>
              <p>Latest</p>
            </div>
            <ReactQuill
              value={storyDifference?.latestContent}
              readOnly={true}
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
      </div>
      <hr />
      <Footer />
    </div>
  );
};

export default VersionDifference;
