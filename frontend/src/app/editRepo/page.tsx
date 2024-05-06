import React from "react";
import "./page.css";
import Header from "../component/header/page";
import Footer from "../component/footer/page";

const EditRepo = () => {
  return (
    <div className="edit-repo-wrapper">
      <Header />
      <div className="story-info">
        <p>Story Image</p>
        <p>Story Name</p>
        <p>public</p>
      </div>
      <Footer />
    </div>
  );
};

export default EditRepo;
