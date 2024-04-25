"use client";
import React, { useState } from "react";
import { sendRequest } from "../../tools/apiRequest";
import { requestMethods } from "../../tools/apiRequestMethods";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../@register/page.css";
import "../shared.css";
import mainLogo from "../../../../public/images/mainLogo.png";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);

  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

  const register = async () => {
    try {
      const body = JSON.stringify({
        email: email,
        username: username,
        password: password,
      });

      const response = await sendRequest(
        requestMethods.POST,
        `/auth/register`,
        body
      );

      if (response.status === 201) {
        console.log("User registered successfully");
        setStep(1);
        setEmail("");
        setUsername("");
        setPassword("");
      } else {
        console.error("Failed to register user:", response.status);
      }
    } catch (error) {
      console.log("error registering using:", error);
    }
  };

  const handleContinue = () => {
    if (step === 1 && email.trim() !== "") {
      if (!emailRegex.test(email)) {
        toast.error("Invalid email address");
        return;
      }
      setStep(2);
    } else if (step === 2 && username.trim().length < 5) {
      toast.error("Username must be at least 5 characters");
    } else if (step === 3 && password.trim().length < 6) {
      toast.error("Password must be at least 6 characters");
    } else if (step === 2 && username.trim() !== "") {
      setStep(3);
    } else if (step === 3 && password.trim() !== "") {
      register();
      console.log("User registered:", { email, username, password });
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

      <div className="register-card">
        <div className="register-title">
          <h1>Join BookHub</h1>
          <h1>Where Stories Unite!</h1>
        </div>
        <div className="input-btn-container">
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>

          {step === 1 && (
            <button className="continue-btn" onClick={handleContinue}>
              Continue
            </button>
          )}
        </div>

        {step >= 2 && (
          <div className="input-btn-container">
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            {step === 2 && (
              <button className="continue-btn" onClick={handleContinue}>
                Continue
              </button>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="input-btn-container">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <button className="continue-btn" onClick={handleContinue}>
              Register
            </button>
          </div>
        )}
        <div className="switch-paragraph">
          <p>
            Already have an account? <span>Sign in</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
