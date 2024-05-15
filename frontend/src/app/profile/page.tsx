"use client";
import React from "react";
import "./page.css";
import "../globals.css";
import Header from "../component/header/page";
import Footer from "../component/footer/page";
import ProfileLeft from "../component/profileLeft/page";
import ProfileMiddle from "../component/profileMiddle/page";

const Profile = () => {
  return (
    <div className="profile-wrapper">
      <Header />
      <div className="middle-wrapper">
        <div className="profile-left-section">
          <ProfileLeft />
        </div>
        <div className="profile-middle-section">
          <ProfileMiddle />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
