"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import "../shared.css";
import { ToastContainer, toast } from "react-toastify";
import { sendRequest } from "@/app/tools/apiRequest";
import { requestMethods } from "@/app/tools/apiRequestMethods";
import mainLogo from "../../../../public/images/mainLogo.png";
import { useEmailContext } from "@/context/emailContext";
import { useRouter } from "next/navigation";

const ChangePassword = () => {
  const [pin, setPin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const { email, setEmail } = useEmailContext();

  const router = useRouter();

  const handleChangePassword = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const body = {
        email: email,
        pin: pin,
        newPassword: password,
      };

      const response = await sendRequest(
        requestMethods.POST,
        `/user/resetPassword`,
        body
      );

      if (response.status === 200) {
        toast.success("Password reset successful");
        setPin("");
        setPassword("");
        setConfirmPassword("");
        setEmail("");
        router.push("/login");
      } else {
        toast.error("An error occurred");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  useEffect(() => {
    console.log("Email:", email);
  }, []);

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
        <div className={styles.changepassword_title}>
          <h1>Enter a new password</h1>
        </div>

        <div className={styles.changepassword_wrapper}>
          <input
            placeholder="PIN"
            type="text"
            className="general-input"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
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

          <button onClick={handleChangePassword} className="general-button">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
