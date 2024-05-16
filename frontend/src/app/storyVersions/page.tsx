"use client";
import React from "react";
import "./page.css";
import "../globals.css";
import Header from "../component/header/page";
import Footer from "../component/footer/page";
import { useEmailContext } from "@/context/emailContext";
import defaultImage from "../../../public/images/defaultImage.png";
import { formatDistanceToNow } from "date-fns";

const StoryVersions = () => {
  const { storyVersions, setStoryVersions } = useEmailContext();
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
              <p>Version {index + 1}</p>
              <p>
                Created {formatDistanceToNow(new Date(version.createdAt))} ago
              </p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StoryVersions;
