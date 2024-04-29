import React from "react";
import { FaPlus } from "react-icons/fa";
import "./page.css";

const HomeLeft: React.FC = () => {
  return (
    <div className="homepage-left">
      <div className="homepage-left-title">
        <p>Collaboration</p>
        <button className="general-button">
          <FaPlus /> New
        </button>
      </div>

      <div className="homepage-left-stories">
        <p>Story name</p>
        <p>Story name</p>
        <p>Story name</p>
        <p>Story name</p>
      </div>
    </div>
  );
};

export default HomeLeft;
