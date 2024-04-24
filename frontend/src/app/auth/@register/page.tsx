import React from "react";
import "./page.css";
import mainLogo from "../../../../public/images/mainLogo.png";

const Register = () => {
  return (
    <div className="register-container">
      <div className="register-logo">
        <img src={mainLogo.src} alt="My Image" />
      </div>
      <div className="register-card">
        <h1>Join BookHub</h1>
        <h1>Where Stories Unite!</h1>
        <input placeholder="Email"></input>
      </div>
    </div>
  );
};

export default Register;
