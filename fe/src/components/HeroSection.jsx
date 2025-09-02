import React from "react";
import { Link } from "react-router-dom";
import "../styles/heroSection.css";

const HeroSection = ({ headerHeight }) => {
  return (
    <div className="hero-section" style={{ paddingTop: `${headerHeight}px` }}>
      <div className="container">
        <h1 className="hero-title">
          Hami Kissan: Growing a Food-Secure Nepal.
        </h1>
        <h2 className="hero-subtitle">
          Our AI platform helps you protect harvests from disease, get smart
          crop recommendations, and increase profits by connecting you directly
          to the community.
        </h2>
        <div className="cta-btns">
          <Link to="/recommend" className="hero-btn">
            Discover Your Crops
          </Link>
          <Link to="/disease" className="hero-btn">
            Smart Agri-Toolkit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
