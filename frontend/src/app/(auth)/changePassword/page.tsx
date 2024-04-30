"use client";
import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "./page.module.css";
import "../shared.css";
import mainLogo from "../../../../public/images/mainLogo.png";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const ChangePassword = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const router = useRouter();
  const { token } = router.query; // Extract the token from the URL

  const handleChangePassword = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      // Send a request to your backend to change the password
      const response = await axios.post("/api/reset-password", {
        token,
        newPassword: password,
      });
      toast.success(response.data.message);
      // Redirect the user to a success page or login page
      router.push("/login");
    } catch (error) {
      console.log(error);
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
