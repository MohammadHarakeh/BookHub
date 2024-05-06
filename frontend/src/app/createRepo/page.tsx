"use client";
import React, { useEffect, useState } from "react";
import "./page.css";
import "../globals.css";
import Header from "../component/header/page";
import Footer from "../component/footer/page";
import { FaBook, FaLock } from "react-icons/fa";
import { IoIosInformationCircle } from "react-icons/io";
import { useEmailContext } from "@/context/emailContext";
import { sendRequest } from "../tools/apiRequest";
import { requestMethods } from "../tools/apiRequestMethods";
import { send } from "process";

interface User {
  username: string;
}

const CreateRepo = () => {
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [loggedUser, setLoggedUser] = useState<User | undefined>();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [visibility, setVisibility] = useState<string>("");

  const getLoggedinUser = async () => {
    try {
      const response = await sendRequest(
        requestMethods.GET,
        "/user/getLoggedinUser"
      );
      if (response.status === 200) {
        setLoggedUser(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching user profile image", error);
    }
  };

  const addRepo = async () => {
    try {
      const body = {
        name: name,
        description: description,
        visibility: visibility,
      };

      const response = await sendRequest(
        requestMethods.POST,
        `user/createRepository`,
        body
      );

      if (response.status === 201) {
        console.log("Created repo successfully");
        setDescription("");
        setName("");
        setVisibility("public");
        setIsPublic(true);
      } else {
        ("Failed to create repo");
      }
    } catch (error) {
      console.error("Error creating repo", error);
    }
  };

  const handlePublicClick = () => {
    setIsPublic(true);
    setVisibility("public");
  };

  const handlePrivateClick = () => {
    setIsPublic(false);
    setVisibility("private");
  };

  useEffect(() => {
    getLoggedinUser();
  }, []);
  return (
    <div className="repo-wrapper">
      <Header />
      <div className="story-container">
        <div className="story-title">
          <p>Create a new story</p>
        </div>
        <hr />

        <div className="name-description-wrapper">
          <div className="story-owner">
            <p>Owner</p>
            <input
              type="text"
              value={loggedUser?.username || ""}
              readOnly
              className="general-input"
            ></input>
          </div>
          <p className="story-seperator">/</p>
          <div className="story-name">
            <p>Story name</p>
            <input
              type="text"
              className="general-input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            ></input>
          </div>
        </div>
        <div className="story-description">
          <p>Description</p>
          <input
            type="text"
            value={description}
            className="general-input description-input"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          ></input>
        </div>
        <hr />

        <div className="story-visablility">
          <div className="story-public" onClick={handlePublicClick}>
            <input
              type="radio"
              id="public-radio"
              name="visibility"
              checked={isPublic}
              onChange={handlePublicClick}
            ></input>
            <FaBook />
            <div className="test">
              <label>Public</label>
              <p className="public-info">
                Anyone on the internet can see this story. You choose who can
                commit.
              </p>
            </div>
          </div>

          <div className="story-private" onClick={handlePrivateClick}>
            <input
              type="radio"
              id="private-radio"
              name="visibility"
              checked={!isPublic}
              onChange={handlePrivateClick}
            ></input>
            <FaLock />
            <div>
              <label>Private</label>
              <p className="private-info">
                You choose who can see and commit to this story.
              </p>
            </div>
          </div>
        </div>
        <hr />

        <div className="repo-info">
          <IoIosInformationCircle className="info-icon" />
          <p>
            You are creating a public/private story in your personal account
          </p>
        </div>
        <hr />

        <div className="commit-btn-wrapper">
          <button className="general-button" onClick={addRepo}>
            Commit Story
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateRepo;