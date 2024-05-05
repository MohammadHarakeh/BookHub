import React from "react";
import "./page.css";
import "../globals.css";
import Header from "../component/header/page";
import Footer from "../component/footer/page";

const CreateRepo = () => {
  return (
    <div className="repo-wrapper">
      <Header />
      <div className="story-container">
        <div className="story-title">
          <p>Create a new story</p>
        </div>

        <div className="name-description-wrapper">
          <div className="story-owner">
            <p>Owner</p>
            <input type="text" className="general-input"></input>
          </div>
          <p className="test">/</p>
          <div className="story-name">
            <p>Story name</p>
            <input type="text" className="general-input"></input>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateRepo;
