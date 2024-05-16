"use client";
import React, { useState } from "react";
import "./page.css";
import "../globals.css";
import Header from "../component/header/page";
import Footer from "../component/footer/page";
import { useEmailContext } from "@/context/emailContext";
import defaultImage from "../../../public/images/defaultImage.png";
import { formatDistanceToNow } from "date-fns";
import { sendRequest } from "@/app/tools/apiRequest";
import { requestMethods } from "@/app/tools/apiRequestMethods";

const StoryVersions = () => {
  const { storyVersions, setStoryVersions } = useEmailContext();
  const [clickedVersion, setClickedVersion] = useState<string>("");

  const getVersionDifference = async () => {
    const response = sendRequest(
      requestMethods.GET,
      `/user/versionDifference/${storyVersions._id}`
    );
  };

  return (
    <div>
      <Header />
      <div className="story-version-wrapper">
        <div className="story-version-container">
          {storyVersions ? (
            <img
              src={storyVersions.repo_picture || defaultImage.src}
              alt={storyVersions.name || "Default Image"}
            />
          ) : (
            <img src={defaultImage.src} alt="Default Image" />
          )}
          <p className="story-name-title">{storyVersions?.name}</p>
          <p className="general-input versions-visibility">
            {storyVersions?.visibility}
          </p>
        </div>

        <div className="all-versions-wrapper">
          {storyVersions?.versions?.map((version: any, index: any) => (
            <div key={index} className="version-items">
              <div
                onClick={() => {
                  console.log(version._id);
                  setClickedVersion(version._id);
                }}
                className="single-version"
              >
                <p>Version {index + 1}</p>
                <p className="version-createdat">
                  Created {formatDistanceToNow(new Date(version.createdAt))} ago
                </p>
              </div>
              <hr />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StoryVersions;
