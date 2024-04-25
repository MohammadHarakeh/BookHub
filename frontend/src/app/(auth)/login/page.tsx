"use client";
import React, { useState } from "react";
import { sendRequest } from "../../tools/apiRequest";
import { requestMethods } from "../../tools/apiRequestMethods";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../shared.css";
import "./page.css";
import mainLogo from "../../../../public/images/mainLogo.png";
import { useRouter } from "next/navigation";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async () => {
    try {
      const body = JSON.stringify({
        identifier: email,
        password: password,
      });

      const response = await sendRequest(
        requestMethods.POST,
        `/auth/login`,
        body
      );

      if (response.status === 200) {
        console.log("Loggedin successfully");
        setEmail("");
        setPassword("");
        toast.success("Logged in successfully");
      } else {
        console.error("Failed to login:", response.status);
        toast.error("Failed to login");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Failed to login");
    }
  };

  const switchToRegister = () => {
    router.push("/register");
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

          <input
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>

          <div className="button-container">
            <button onClick={login}>Sign in</button>
          </div>
        </div>

        <div className="switch-paragraph">
          <p>
            Don't have an account?
            <span onClick={switchToRegister}> Signup</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
