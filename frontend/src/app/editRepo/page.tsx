"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
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

const EditRepo = () => {
  const { userInfo } = useEmailContext();
  const { repoInfo } = useEmailContext();
  const [content, setContent] = useState<string>("");
  const [selection, setSelection] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState<string>("");
  const [unformattedContent, setUnformattedContent] = useState<string>("");

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

  const inviteUser = async () => {
    try {
      const body = {
        recipientEmail: recipientEmail,
        repositoryId: repoInfo._id,
      };

      const response = await sendRequest(
        requestMethods.POST,
        `/user/invite-to-repository`,
        body
      );

      if (response.status === 200) {
        console.log("Invited user successfully");
        toast.success("Invited user successfully");
      } else {
        console.log("Failed to invite user");
        toast.error("Failed to invite user");
      }
    } catch (error) {
      console.error("Error can't invite user", error);
      toast.error("Error can't invite user");
    }
  };

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

  const handleInviteUserClick = () => {
    setShowModal((prevShowModal) => !prevShowModal);
  };

  useEffect(() => {
    if (repoInfo && repoInfo.versions && repoInfo.versions.length > 0) {
      setContent(repoInfo.versions[repoInfo.versions.length - 1].content);
      const latestContent =
        repoInfo.versions[repoInfo.versions.length - 1].content;
      const unformattedContent = latestContent.replace(/<[^>]*>/g, "");
      setUnformattedContent(unformattedContent);
      console.log("Unformatted content:", unformattedContent);
      console.log("repo info: ", repoInfo);
    }
  }, [repoInfo]);

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
            {showModal && (
              <div className={styles.blurred_model}>
                <div className={styles.blurred}>
                  <div className={styles.close_btn_wrapper}>
                    <IoMdClose
                      className={styles.close_btn}
                      onClick={handleInviteUserClick}
                    />
                  </div>
                  <div className={styles.invite_title_section}>
                    <img src={inviteImage.src}></img>
                  </div>
                  <p className={styles.invite_title}>Invite user by email</p>

                  <input
                    type="text"
                    placeholder="Email"
                    value={recipientEmail}
                    onChange={(e) => {
                      setRecipientEmail(e.target.value);
                    }}
                    className={`${`general-input`} ${styles.invite_input}`}
                  />
                  <button className="general-button" onClick={inviteUser}>
                    Send Invite
                  </button>
                </div>
              </div>
            )}

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
          <div className={styles.collaborators_wrapper}>
            <div className={styles.story_collaborators}>
              <p>Collaborators</p>
            </div>
            <div className={styles.story_collaborators}>
              <p onClick={handleInviteUserClick}>Invite user</p>
            </div>
          </div>
        </div>
        <hr />

        <div className={styles.edit_repo_info}>
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

        <div className={styles.edit_repo_button}>
          <button className="general-button" onClick={commitRepo}>
            Commit
          </button>
        </div>
      </div>
      <hr />
      <Footer />
    </div>
  );
};

export default EditRepo;
