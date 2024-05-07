import React from "react";
import "./page.css";
import Header from "../component/header/page";
import Footer from "../component/footer/page";

const invitedPage = () => {
  return (
    <div className="invited-wrapper">
      <Header />

      <div className="invite-card"></div>

      <Footer />
    </div>
  );
};

export default invitedPage;
