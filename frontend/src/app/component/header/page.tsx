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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
  };

  const handleLogin = () => {
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

        <div className="header-links">
          <Link href="/profile">Profile</Link>
        </div>
      </div>

      <div className="user-profile">
        {isLoggedIn && userInfo.user ? (
          <div className="dropdown">
            {userInfo.user.profile.profile_picture ? (
              <img
                src={`http://localhost:3001/${
                  userInfo.user.profile.profile_picture.split(
                    "profilePictures\\"
                  )[1]
                }`}
                alt="Profile Picture"
                className="user-profile-small"
              />
            ) : (
              <img
                src={defaultImage.src}
                alt="Default Image"
                className="user-profile-small"
              />
            )}
            {showDropdown && (
              <div className="dropdown-content">
                <button onClick={handleLogout}>Sign Out</button>
              </div>
            )}
          </div>
        ) : (
          <div className="dropdown">
            <img src={defaultImage.src} onClick={handleDropdownToggle} />
            {showDropdown && (
              <div className="dropdown-content">
                <button onClick={handleLogin}>Sign In</button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
