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
        <h1>Join BookHub</h1>
        <h1>Where Stories Unite!</h1>
        <input placeholder="Email"></input>
        <button>Continue</button>
      </div>
    </div>
  );
};

export default Register;
