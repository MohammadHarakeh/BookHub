"use client";
import React, { useEffect, useState } from "react";
import { sendRequest } from "../../tools/apiRequest";
import { requestMethods } from "../../tools/apiRequestMethods";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./page.module.css";
import "./../shared.css";
import mainLogo from "../../../../public/images/mainLogo.png";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

import { useGoogleLogin } from "@react-oauth/google";
import { useEmailContext } from "@/context/emailContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const { userLoggedIn, setUserLoggedIn } = useEmailContext();

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v1/userinfo",
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          }
        );
        console.log("normal response:", res.data);

        const backendResponse = await axios.post(
          "http://localhost:3001/user/googleLogin",
          res.data
        );
        console.log("backend response:", backendResponse.data);
        localStorage.setItem(
          "token",
          JSON.stringify(backendResponse.data.token)
        );
        router.push("/");
      } catch (err) {
        console.error(err);
      }
    },
  });

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
        const data = await response.data;
        localStorage.setItem("token", JSON.stringify(data.token));
        console.log("Logged in successfully");
        setEmail("");
        setPassword("");
        toast.success("Logged in successfully");
        setUserLoggedIn(true);
        router.push("/");
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

      <div className={styles.register_card}>
        <div className="register-title">
          <h1 className={styles.register_title}>Login</h1>
        </div>
        <div className={styles.input_btn_container}>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value.toLowerCase());
            }}
          ></input>

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>

          <div className={styles.forgot_password}>
            <Link href="/forgotPassword">Forgot password?</Link>
          </div>

          <div className={styles.button_container}>
            <button onClick={login}>Sign in</button>
          </div>
        </div>

        <div className={styles.or_line}>
          <div className={styles.line} />
          or
          <div className={styles.line} />
        </div>

        <div className={styles.button_container}>
          <button onClick={() => googleLogin()}>Sign in with Google</button>
        </div>

        <div className="switch-paragraph">
          <p>
            Don't have an account?
            <span onClick={switchToRegister}> Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;
