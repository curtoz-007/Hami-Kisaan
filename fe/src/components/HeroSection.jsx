import React from "react";
import { Link } from "react-router-dom";
import "../styles/heroSection.css";
// import heroImageUrl from "../assets/hero-image3.jpg";
// import heroImageUrl from "../assets/hero-image2.png";
import heroImageUrl from "../assets/hero-image.png";

const HeroSection = () => {
  return (
    <div className="hero-section">
      <img className="hero-image" src={heroImageUrl} />

      <div className="content">
        <h1 className="hero-title">
          Hami Kisaan: Growing a Food-Secure Nepal.
        </h1>
        <h2 className="hero-subtitle">
          Our AI platform helps you protect harvests from disease, get smart
          crop recommendations, and increase profits by connecting you directly
          to the community.
        </h2>
        <div className="cta-btns">
          <Link to="/recommend" className="hero-btn">
            🌱 Discover Your Crops
            <p>AI Powered Recommendations</p>
          </Link>
          <Link to="/disease" className="hero-btn">
            🦠 Plant Clinic & Alerts
            <p>Detect diseases and notify others too</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
