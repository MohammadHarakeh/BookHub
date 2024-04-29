import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "./../shared.css";
import styles from "./page.module.css";
import mainLogo from "../../../../public/images/mainLogo.png";
import Link from "next/link";

const ForgotPassword = () => {
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
          <input className="general-input" placeholder="Email"></input>
        </div>

        <div className={styles.forgotpassword_switcher}>
          <button className="general-button">Contiue</button>
          <Link href="/login" className="general-button">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
