import React from "react";
import "./page.css";
import "../globals.css";
import Header from "../component/header/page";
import Footer from "../component/footer/page";
import { FaBook, FaLock } from "react-icons/fa";

const CreateRepo = () => {
  return (
    <div className="repo-wrapper">
      <Header />
      <div className="story-container">
        <div className="story-title">
          <p>Create a new story</p>
        </div>
        <hr />

        <div className="name-description-wrapper">
          <div className="story-owner">
            <p>Owner</p>
            <input type="text" className="general-input"></input>
          </div>
          <p className="story-seperator">/</p>
          <div className="story-name">
            <p>Story name</p>
            <input type="text" className="general-input"></input>
          </div>
        </div>
        <div className="story-description">
          <p>Description</p>
          <input
            type="text"
            className="general-input description-input"
          ></input>
        </div>
        <hr />

        <div className="story-visablility">
          <div className="story-public">
            <input type="radio"></input>
            <FaBook />
            <div className="test">
              <label>Public</label>
              <p className="public-info">
                Anyone on the internet can see this story. You choose who can
                commit.
              </p>
            </div>
          </div>

          <div className="story-private">
            <input type="radio"></input>
            <FaLock />
            <div>
              <label>Private</label>
              <p className="private-info">
                You choose who can see and commit to this story.
              </p>
            </div>
          </div>
        </div>
        <hr />
      </div>
      <Footer />
    </div>
  );
};

export default CreateRepo;
