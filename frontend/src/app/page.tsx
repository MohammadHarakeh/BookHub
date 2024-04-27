import "./globals.css";
import "./page.css";
import Header from "../app/component/header/page";
import Footer from "../app/component/footer/page";

export default function Home() {
  return (
    <div className="home-wrapper">
      <Header />
      <div className="homepage-wrapper">
        <div className="homepage-left">
          <div className="homepage-left-title">
            <p>Collaboration</p>
            <button>New</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
