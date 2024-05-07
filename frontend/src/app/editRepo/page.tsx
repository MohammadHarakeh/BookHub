"use client";
import React, { useEffect, useState } from "react";
import "./page.css";
import Header from "../component/header/page";
import Footer from "../component/footer/page";
import { requestMethods } from "../tools/apiRequestMethods";
import { sendRequest } from "../tools/apiRequest";
import { useEmailContext } from "@/context/emailContext";
import defaultImage from "../../../public/images/defaultImage.png";

const EditRepo = () => {
  const [loggedUserInfo, setLoggedUserInfo] = useState<any | undefined>();
  const { userInfo } = useEmailContext();

  const getLoggedinUser = async () => {
    try {
      const response = await sendRequest(
        requestMethods.GET,
        "/user/getLoggedinUser"
      );
      if (response.status === 200) {
        setLoggedUserInfo(response.data);
      } else {
        console.log("No info");
      }
    } catch (error) {
      console.error("Error fetching user profile image", error);
    }
  };

  useEffect(() => {
    getLoggedinUser();
  }, []);

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);

  return (
    <div className="edit-repo-wrapper">
      <Header />
      <div className="story-info">
        <div className="story-info">
          <img src={defaultImage.src}></img>

          <p className="story-name">Story Name</p>
          <p className="general-input story-visibility-status">public</p>
        </div>
        {/* <p>{loggedUserInfo?.user?.username ?? "Loading..."}</p> */}
        <div className="story-collaborators">Collaborators</div>
      </div>
      <hr />
      <Footer />
    </div>
  );
};

export default EditRepo;
