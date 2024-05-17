"use client";
import React, { useEffect, useState } from "react";
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
  const { storyDifference, setStoryDifference } = useEmailContext();
  const { setRepoInfo } = useEmailContext();
  const [clickedVersion, setClickedVersion] = useState<string>("");
  const { collabInfo } = useEmailContext();
  const router = useRouter();

  const getVersionDifference = async (versionId: string) => {
    try {
      const response = await sendRequest(
        requestMethods.GET,
        `/user/versionDifference/${collabInfo.repositoryId}/${versionId}`
      );

      if (response.status === 200) {
        console.log(response.data);
        setStoryDifference(response.data);
        router.push("/versionDifference");
      } else {
        console.log("Failed to get version difference");
      }
    } catch (error) {
      console.log("Error can't get version difference", error);
    }
  };

  const clickedRepoInfo = async () => {
    try {
      const response = await sendRequest(
        requestMethods.GET,
        `/user/getRepository/${collabInfo.repositoryId}`
      );

      if (response.status === 200) {
        setRepoInfo(response.data.repository);
        router.push("/editRepo");
      } else {
        console.log("Failed to get repo data");
      }
    } catch (error) {
      console.log("Error getting repo data", error);
    }
  };

  const handleVersionClick = (versionId: string, index: number) => {
    if (index === collabInfo.versions.length - 1) {
      clickedRepoInfo();
      router.push("/editRepo");
    } else {
      setClickedVersion(versionId);
      getVersionDifference(versionId);
    }
  };

  return (
    <div>
      <Header />
      <div className="story-version-wrapper">
        <div className="story-version-container">
          {collabInfo ? (
            <img
              src={`http://localhost:3001/${
                collabInfo?.picture?.split("repoPictures\\")[1]
              }`}
              alt={collabInfo.name}
            />
          ) : (
            <img src={defaultImage.src} alt="Default Image" />
          )}
          <p className="story-name-title">{collabInfo?.name}</p>
          <p className="general-input versions-visibility">
            {collabInfo?.visibility}
          </p>
        </div>

        <div className="all-versions-wrapper">
          {collabInfo?.versions?.length > 0 ? (
            collabInfo.versions.map((version: any, index: any) => (
              <div key={index} className="version-items">
                <div
                  onClick={() => {
                    handleVersionClick(version._id, index);
                  }}
                  className="single-version"
                >
                  <p>Version {index + 1}</p>
                  <p className="version-createdat">
                    Created {formatDistanceToNow(new Date(version.createdAt))}{" "}
                    ago
                  </p>
                </div>
                <hr />
              </div>
            ))
          ) : (
            <div className="empty-state">No versions available</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StoryVersions;
