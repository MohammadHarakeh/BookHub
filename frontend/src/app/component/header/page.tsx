import React, { useEffect, useState } from "react";
import Link from "next/link";
import "./page.css";
import mainLogo from "../../../../public/images/mainLogo.png";
import { useEmailContext } from "@/context/emailContext";
import defaultImage from "../../../../public/images/defaultImage.png";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
  const { userInfo, themeMode, toggleTheme } = useEmailContext();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    if (themeMode === "light") {
      document.documentElement.classList.add("light-mode");
    } else {
      document.documentElement.classList.remove("light-mode");
    }
  }, [themeMode]);

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

  const getProfilePictureSrc = () => {
    if (isLoggedIn && userInfo.user && userInfo.user.profile) {
      if (userInfo.user.profile.profile_picture) {
        if (userInfo.user.profile.profile_picture.startsWith("https://")) {
          return userInfo.user.profile.profile_picture;
        } else {
          return `http://localhost:3001/${
            userInfo.user.profile.profile_picture.split("profilePictures\\")[1]
          }`;
        }
      }
    }
    return defaultImage.src;
  };

  return (
    <header className={themeMode === "dark" ? "" : "light-mode"}>
      <div className="header-logo" onClick={() => router.push("/")}>
        <img src={mainLogo.src} alt="My Image" />
      </div>
      <div className="header-links-wrapper">
        <div className="header-links">
          <Link href="/">Home</Link>
        </div>

        <div className="header-links">
          <Link href="/profile">Profile</Link>
        </div>
      </div>
      <div className="toggle-switch" onClick={toggleTheme}>
        <div
          className={`slider round ${themeMode === "light" ? "light" : ""}`}
        ></div>
      </div>
      <div className="user-profile">
        <div className="dropdown">
          <img
            src={getProfilePictureSrc()}
            alt="Profile Picture"
            className="user-profile-small"
            onClick={handleDropdownToggle}
          />
          {showDropdown && (
            <div className="dropdown-content">
              {isLoggedIn ? (
                <button onClick={handleLogout}>Sign Out</button>
              ) : (
                <button onClick={handleLogin}>Sign In</button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
