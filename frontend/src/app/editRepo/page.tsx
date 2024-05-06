"use client";
import React, { useEffect, useState } from "react";
import "./page.css";
import Header from "../component/header/page";
import Footer from "../component/footer/page";
import { useEmailContext } from "@/context/emailContext";
import { requestMethods } from "../tools/apiRequestMethods";
import { sendRequest } from "../tools/apiRequest";

const EditRepo = () => {
  const [loggedUserInfo, setLoggedUserInfo] = useState<any | undefined>();

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

  return (
    <div className="edit-repo-wrapper">
      <Header />
      <div className="story-info">
        <p>Story Image</p>
        <p>Story Name</p>
        <p>public</p>
        <p>{loggedUserInfo?.user?.username ?? "Loading..."}</p>
      </div>
      <hr />
      <Footer />
    </div>
  );
};

export default EditRepo;
