"use client";
import React, { useState } from "react";
import "./page.css";
import mainLogo from "../../../../public/images/mainLogo.png";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);

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
