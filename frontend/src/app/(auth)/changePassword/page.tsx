"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import "../shared.css";
import { ToastContainer, toast } from "react-toastify";
import { sendRequest } from "@/app/tools/apiRequest";
import { requestMethods } from "@/app/tools/apiRequestMethods";
import mainLogo from "../../../../public/images/mainLogo.png";

const ChangePassword = () => {
  const [pin, setPin] = useState<number>();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleChangePassword = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const body = {
      pin: pin,
      newPassword: password,
    };

    try {
      const response = await sendRequest(
        requestMethods.POST,
        `/user/resetPassword`,
        body
      );

      if (response.status === 200) {
        toast.success("Password reset successful");
      } else {
        toast.error("An error occurred");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
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

      <div className={styles.changepassword_card}>
        <div>
          <h1>Enter a new password</h1>
        </div>

        <div>
          <input
            placeholder="PIN"
            type="text"
            className="general-input"
            value={pin || ""}
            onChange={(e) => setPin(parseInt(e.target.value))}
          />

          <input
            placeholder="Password"
            type="password"
            className="general-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            placeholder="Confirm Password"
            type="password"
            className="general-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button onClick={handleChangePassword}>Change Password</button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
