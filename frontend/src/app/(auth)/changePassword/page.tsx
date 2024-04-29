import React from "react";
import styles from "./page.module.css";
import "../shared.css";
import mainLogo from "../../../../public/images/mainLogo.png";
import { ToastContainer, toast } from "react-toastify";

const ChangePassword = () => {
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
          ></input>
          <input
            placeholder="Confirm Password"
            type="password"
            className="general-input"
          ></input>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
