"use client";
import React, { useEffect, useState } from "react";
import "./page.css";
import Header from "@/app/component/header/page";
import Footer from "@/app/component/footer/page";
import { requestMethods } from "../../tools/apiRequestMethods";
import { sendRequest } from "../../tools/apiRequest";
import defaultImage from "../../../../public/images/defaultImage.png";

const InvitedPage = ({ params }: { params: { invitationToken: string } }) => {
  const [invitingUserId, setInvitingUserId] = useState();
  const [invitingUser, setInvitingUser] = useState();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [invitationAccepted, setInvitationAccepted] = useState(false);
  const [invitingUsername, setInvitingUsername] = useState<string>("");
  const [invitingUserPicture, setInvitingUserPicture] = useState<string>("");

  const getLoggedinUser = async () => {
    try {
      const response = await sendRequest(
        requestMethods.GET,
        "/user/getLoggedinUser"
      );
      if (response.status === 200) {
        setLoggedInUser(response.data.user);
        console.log(response.data.user);
        const invitedFields = response.data.user.invitedFields;

        invitedFields.forEach((invitation: any) => {
          if (invitation.invitingUserId) {
            console.log("Inviting User ID:", invitation.invitingUserId);
            setInvitingUserId(invitation.invitingUserId);
            setInvitingUsername(invitation.invitingUsername);
            setInvitingUserPicture(invitation.invitingProfilePicture);
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

      <div className="invite-card-wrapper">
        <div className="invite-card">
          {invitingUserPicture !== "" ? (
            <img src={invitingUserPicture} alt="User Picture" />
          ) : (
            <img src={defaultImage.src} alt="Default Profile" />
          )}
          <p>{invitingUsername} has invited you to collaborate with them</p>

          <div className="invite-card-buttons">
            <button className="general-button invite-card-btn">Accept</button>
            <button className="general-button decline-button invite-card-btn">
              Decline
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default InvitedPage;
