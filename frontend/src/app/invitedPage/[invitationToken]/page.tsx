"use client";
import React, { useState } from "react";
import "./page.css";
import Header from "@/app/component/header/page";
import Footer from "@/app/component/footer/page";
import { requestMethods } from "../../tools/apiRequestMethods";
import { sendRequest } from "../../tools/apiRequest";

const InvitedPage = ({ params }: { params: { invitationToken: string } }) => {
  const [invitingUser, setInvitingUser] = useState();

  const getInvitingUserInfo = async (invitingUserId: string) => {
    try {
      const response = sendRequest(
        requestMethods.GET,
        `/user/invitingUserProfile/${invitingUserId}`
      );
    } catch (error) {
      console.error("Error getting user info", error);
    }
  };

  return (
    <div className="invited-wrapper">
      <Header />

      <div className="invite-card">
        <h1>Invited Page for token {params.invitationToken}</h1>
      </div>

      <Footer />
    </div>
  );
};

export default InvitedPage;
