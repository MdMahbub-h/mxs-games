import "./landing.css";
import Header from "./Header";
import Manue from "./Manue";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Landing = () => {
  const toggleFullscreen = () => {
    const gameRoot = document.getElementById("game-root");
    if (gameRoot) document.fullscreenElement ? document.exitFullscreen() : gameRoot.requestFullscreen();
  };

  return (
    <div className="container">
      <Header />
      <Manue />

      <div className="game-container">
        <button className="fullscreen-btn" onClick={() => toggleFullscreen()}>
          <img src="images/full-screen-open.png" alt="full-screen" />
        </button>

        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Landing;
