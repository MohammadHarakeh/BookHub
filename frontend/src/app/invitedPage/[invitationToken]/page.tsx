"use client";
import React, { useEffect, useState } from "react";
import "./page.css";
import Header from "@/app/component/header/page";
import Footer from "@/app/component/footer/page";
import { requestMethods } from "../../tools/apiRequestMethods";
import { sendRequest } from "../../tools/apiRequest";

const InvitedPage = ({ params }: { params: { invitationToken: string } }) => {
  const [invitingUser, setInvitingUser] = useState();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [invitationAccepted, setInvitationAccepted] = useState(false);

  const getLoggedinUser = async () => {
    try {
      const response = await sendRequest(
        requestMethods.GET,
        "/user/getLoggedinUser"
      );
      if (response.status === 200) {
        setLoggedInUser(response.data);
        if (
          response.data.invitationToken &&
          response.data.invitationTokenExpires > new Date()
        ) {
          setInvitationAccepted(true);
        }
      } else {
        console.log("failed to get user");
      }
    } catch (error) {
      console.error("Error fetching logged in user", error);
    }
  };

  const getInvitingUserInfo = async (invitingUserId: string) => {
    try {
      const response = await sendRequest(
        requestMethods.GET,
        `/user/invitingUserProfile/${invitingUserId}`
      );

      if (response.status === 200) {
        console.log(response.data);
        setInvitingUser(response.data);
      } else {
        console.log("Failed to get inviting user");
      }
    } catch (error) {
      console.error("Error getting user info", error);
    }
  };

  useEffect(() => {
    getLoggedinUser();

    // Call getInvitingUserInfo with loggedInUser.invitingUserId as a dependency
    if (loggedInUser) {
      getInvitingUserInfo(loggedInUser.invitingUserId);
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (loggedInUser) {
      // Assuming loggedInUser has the invitingUserId property
      const invitingUserId = loggedInUser.invitingUserId;
      if (invitingUserId) {
        getInvitingUserInfo(invitingUserId);
      }
    }
  }, [loggedInUser]);

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
