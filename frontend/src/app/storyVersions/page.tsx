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
import { useRouter } from "next/navigation";

const StoryVersions = () => {
  const { storyVersions, setStoryVersions } = useEmailContext();
  const [clickedVersion, setClickedVersion] = useState<string>("");
  const router = useRouter();

  const getVersionDifference = async () => {
    try {
      const response = await sendRequest(
        requestMethods.GET,
        `/user/versionDifference/${storyVersions._id}/${clickedVersion}`
      );

      if (response.status === 200) {
        console.log("Version difference printed successfully");
        router.push("/versionDifference");
      } else {
        console.log("Failed to get version difference");
      }
    } catch (error) {
      console.log("Error can't get version difference", error);
    }
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
                  getVersionDifference();
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
