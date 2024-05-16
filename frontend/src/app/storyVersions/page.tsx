"use client";
import React from "react";
import "./page.css";
import Header from "../component/header/page";
import Footer from "../component/footer/page";
import { useEmailContext } from "@/context/emailContext";

const StoryVersions = () => {
  const { storyVersions, setStoryVersions } = useEmailContext();
  return (
    <div className="story-version-wrapper">
      <Header />
      <div className="story-version-container">{storyVersions.name}</div>
      <Footer />
    </div>
  );
};

export default StoryVersions;
