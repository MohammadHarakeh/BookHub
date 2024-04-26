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

      <div>
        <Link href="/">Home</Link>
      </div>
      <div>
        <Link href="/about">About</Link>
      </div>

      <div>
        <Link href="/contact">Contact</Link>
      </div>
    </header>
  );
};

export default Header;
