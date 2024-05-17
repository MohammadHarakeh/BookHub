import React, { useEffect, useState } from "react";
import Link from "next/link";
import "./page.css";
import mainLogo from "../../../../public/images/mainLogo.png";
import { useEmailContext } from "@/context/emailContext";
import defaultImage from "../../../../public/images/defaultImage.png";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
  const { userInfo } = useEmailContext();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header>
      <div className="header-logo">
        <img
          src={mainLogo.src}
          alt="My Image"
          onClick={() => {
            router.push("/");
          }}
        />
      </div>

      <div className="header-links-wrapper">
        <div className="header-links">
          <Link href="/">Home</Link>
        </div>

        {/* <div className="header-links">
          <Link href="/about">Stories</Link>
        </div> */}

        <div className="header-links">
          <Link href="/profile">Profile</Link>
        </div>
      </div>

      <div className="user-profile">
        {userInfo.user ? (
          <div className="dropdown">
            <img
              src={userInfo.user.profile.profile_picture}
              onClick={handleDropdownToggle}
            />
            {showDropdown && (
              <div className="dropdown-content">
                <button onClick={handleLogout}>Sign Out</button>
              </div>
            )}
          </div>
        ) : (
          <img src={defaultImage.src}></img>
        )}
      </div>
    </header>
  );
};

export default Header;
