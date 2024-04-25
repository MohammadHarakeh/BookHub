"use client";
import React, { useState } from "react";
import { sendRequest } from "../../tools/apiRequest";
import { requestMethods } from "../../tools/apiRequestMethods";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../shared.css";
import "./page.css";
import mainLogo from "../../../../public/images/mainLogo.png";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="register-container">
      <ToastContainer
        theme="dark"
        toastStyle={{ backgroundColor: "#0e0f32" }}
      />

      <div className="register-logo">
        <img src={mainLogo.src} alt="My Image" />
      </div>

      <div className="register-card">
        <div className="register-title">
          <h1>Login</h1>
        </div>
        <div className="input-btn-container">
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>

          <button className="continue-btn">Continue</button>
        </div>

        <div className="switch-paragraph">
          <p>
            Already have an account? <span>Sign in</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
