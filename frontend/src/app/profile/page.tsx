"use client";
import React from "react";
import "./page.css";
import "../globals.css";
import Header from "../component/header/page";
import Footer from "../component/footer/page";
import ProfileLeft from "../component/profileLeft/page";

const Profile = () => {
  return (
    <div className="profile-wrapper">
      <Header />
      <div className="middle-wrapper">
        <ProfileLeft></ProfileLeft>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
