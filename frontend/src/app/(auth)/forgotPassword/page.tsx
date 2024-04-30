"use client";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../shared.css";
import styles from "./page.module.css";
import mainLogo from "../../../../public/images/mainLogo.png";
import Link from "next/link";
import { sendRequest } from "../../tools/apiRequest";
import { requestMethods } from "../../tools/apiRequestMethods";
import { useRouter } from "next/router";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const router = useRouter();

  const forgotPassword = async () => {
    try {
      const body = JSON.stringify({
        email: email,
      });

      const response = await sendRequest(
        requestMethods.POST,
        `/user/forgotPassword`,
        body
      );

      if (response.status === 200) {
        setEmail("");
        router.push({
          pathname: "/changePassword",
          query: { email: email },
        });
        toast.success("Email has been sent");
      } else {
        toast.error("Failed to send email");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error sending email");
    }
  };

  return (
    <div className="register-container">
      <ToastContainer
        theme="dark"
        toastStyle={{ backgroundColor: "#0e0f32" }}
      />
      <div className="register-logo">
        <img src={mainLogo.src} alt="My Image" />
      </div>

      <div className={styles.forgotpassword_card}>
        <div className={styles.forgotpassword_title}>
          <h1>Account Recovery</h1>
          <h1>Enter an existing email</h1>
        </div>

        <div className={styles.forgotpassword_input}>
          <input
            className="general-input"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>
        </div>

        <div className={styles.forgotpassword_switcher}>
          <Link href="/login" className="general-button">
            Back
          </Link>
          <button className="general-button" onClick={forgotPassword}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
