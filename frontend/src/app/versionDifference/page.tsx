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
  const { repoInfo, storyDifference } = useEmailContext();

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
        <div>
          {/* <div className={styles.edit_repo_info_previous}>
            <div className={styles.edit_repo_title}>
              <p>Difference</p>
            </div>
            <ReactQuill
              value={storyDifference?.difference}
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
          </div> */}
        </div>
      </div>
      <hr />
      <Footer />
    </div>
  );
};

export default VersionDifference;
