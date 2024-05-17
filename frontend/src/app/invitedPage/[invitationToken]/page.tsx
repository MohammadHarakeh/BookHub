"use client";
import React, { useEffect, useState } from "react";
import "./page.css";
import Header from "@/app/component/header/page";
import Footer from "@/app/component/footer/page";
import { requestMethods } from "../../tools/apiRequestMethods";
import { sendRequest } from "../../tools/apiRequest";
import defaultImage from "../../../../public/images/defaultImage.png";
import { useRouter } from "next/navigation";

const InvitedPage = ({ params }: { params: { invitationToken: string } }) => {
  const [invitingUserId, setInvitingUserId] = useState();
  const [invitingUserToken, setInvitingUserToken] = useState();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [invitingUsername, setInvitingUsername] = useState<string>("");
  const [invitingUserPicture, setInvitingUserPicture] = useState<string>("");
  const [invitingUserRepoId, setInvitingUserRepoId] = useState<string>("");

  const router = useRouter();

  const getLoggedinUser = async () => {
    try {
      const response = await sendRequest(
        requestMethods.GET,
        "/user/getLoggedinUser"
      );
      if (response.status === 200) {
        setLoggedInUser(response.data.user);
        console.log(response.data.user);
        const invitedFields = response.data.user.invitations;

        invitedFields.forEach((invitation: any) => {
          if (invitation.sender) {
            setInvitingUserId(invitation.sender);
            setInvitingUsername(invitation.senderName);
            setInvitingUserPicture(invitation.senderProfilePicture);
            setInvitingUserRepoId(invitation.repositoryId);
            setInvitingUserToken(invitation.invitationToken);
          } else {
            console.log("Inviting User ID not found in this invitation.");
          }
        });
      } else {
        console.log("failed to get user");
      }
    } catch (error) {
      console.error("Error fetching logged in user", error);
    }
  };

  const acceptInvitation = async () => {
    try {
      const body = {
        invitationToken: invitingUserToken,
      };
      const response = await sendRequest(
        requestMethods.POST,
        `/user/accept-invitation-to-repository`,
        body
      );

      if (response.status === 200) {
        console.log("Invitation accepted successfully");
        router.push("/");
      } else {
        console.log("Failed to accept invitation");
      }
    } catch (error) {
      console.log("Error accepting invitation", error);
    }
  };
  const declineInvitation = async () => {
    try {
      const body = {
        invitationToken: invitingUserToken,
      };
      const response = await sendRequest(
        requestMethods.POST,
        `/user/decline-invitation-to-repository`,
        body
      );

      if (response.status === 200) {
        console.log("Invitation declined successfully");
        router.push("/");
      } else {
        console.log("Failed to decline invitation");
      }
    } catch (error) {
      console.log("Error declining invitation", error);
    }
  };

  useEffect(() => {
    getLoggedinUser();
  }, []);

  useEffect(() => {
    console.log("test: ", invitingUserRepoId);
  }, [invitingUserRepoId]);

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
          <p>
            <b>{invitingUsername}</b> has invited you to collaborate with them
          </p>

          <div className="invite-card-buttons">
            <button
              className="general-button invite-card-btn"
              onClick={acceptInvitation}
            >
              Accept
            </button>
            <button
              className="general-button decline-button invite-card-btn"
              onClick={declineInvitation}
            >
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
