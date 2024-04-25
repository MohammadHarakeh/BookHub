"use client";
import React, { useState } from "react";
import "./page.css";
import mainLogo from "../../../../public/images/mainLogo.png";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);

  const handleContinue = () => {
    if (step === 1 && email.trim() !== "") {
      setStep(2);
    } else if (step === 2 && username.trim() !== "") {
      setStep(3);
    } else if (step === 3 && password.trim() !== "") {
      console.log("User registered:", { email, username, password });
    }
  };

  return (
    <div className="register-container">
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
      </div>
    </div>
  );
};

export default Register;
