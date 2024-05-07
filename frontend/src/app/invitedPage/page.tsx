"use client";

import React, { useState } from "react";
import "./page.css";
import Header from "../component/header/page";
import Footer from "../component/footer/page";
import { requestMethods } from "../tools/apiRequestMethods";
import { sendRequest } from "../tools/apiRequest";

const invitedPage = () => {
  const [invitingUser, setInvitingUser] = useState();

  const getInvitingUserInfo = async (invitingUserId: string) => {
    try {
      const response = sendRequest(
        requestMethods.GET,
        `/user/invitingUserProfile/${invitingUserId}`
      );
    } catch (error) {
      console.error("Error getting user info");
    }
  };

  return (
    <div className="invited-wrapper">
      <Header />

      <div className="invite-card"></div>

      <Footer />
    </div>
  );
};

export default invitedPage;
