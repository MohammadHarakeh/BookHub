import "./globals.css";
import "./page.css";
import Header from "../app/component/header/page";
import Footer from "../app/component/footer/page";
import { FaPlus } from "react-icons/fa";
import profileImage from "../../public/images/profileImage.jpeg";

export default function Home() {
  return (
    <div className="home-wrapper">
      <Header />
      <div className="homepage-wrapper">
        <div className="homepage-left">
          <div className="homepage-left-title">
            <p>Collaboration</p>
            <button>
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

        <div className="homepage-middle">
          <div className="homepage-middle-upload">
            <img src={profileImage.src}></img>
            <input
              placeholder="What's on your mind"
              className="homepage-input-text"
            ></input>
            <input type="file"></input>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
