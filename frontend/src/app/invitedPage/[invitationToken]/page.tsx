"use client";
import React, { useEffect, useState } from "react";
import "./page.css";
import Header from "@/app/component/header/page";
import Footer from "@/app/component/footer/page";
import { requestMethods } from "../../tools/apiRequestMethods";
import { sendRequest } from "../../tools/apiRequest";

const InvitedPage = ({ params }: { params: { invitationToken: string } }) => {
  const [invitingUserId, setInvitingUserId] = useState();
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
        console.log(response.data);
        const invitedFields = response.data.user.invitedFields;

        invitedFields.forEach((invitation: any) => {
          if (invitation.invitingUserId) {
            console.log("Inviting User ID:", invitation.invitingUserId);
            setInvitingUserId(invitation.invitingUserId);
          } else {
            console.log("Inviting User ID not found in this invitation.");
          }
        });
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

  useEffect(() => {
    getLoggedinUser();
  }, []);

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
