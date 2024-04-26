import React from "react";
import Link from "next/link";
import "./page.css";
import mainLogo from "../../../../public/images/mainLogo.png";

const Header: React.FC = () => {
  return (
    <header>
      <div className="header-logo">
        <img src={mainLogo.src} alt="My Image" />
      </div>

      <div className="header-links-wrapper">
        <div className="header-links">
          <Link href="/">Home</Link>
        </div>

        <div className="header-links">
          <Link href="/about">About</Link>
        </div>

        <div className="header-links">
          <Link href="/contact">Contact</Link>
        </div>
      </div>

      <div className="user-profile">
        <p>User image</p>
      </div>
    </header>
  );
};

export default Header;
