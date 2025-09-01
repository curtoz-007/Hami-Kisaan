import React from "react";
import { Link } from "react-router-dom";
import "../styles/heroSection.css";
import heroImageUrl from "../assets/hero-image.png";

const HeroSection = () => {
  return (
    <div className="hero-section">
      <img className="hero-image" src={heroImageUrl} />

      <div className="content">
        <h1 className="hero-title">Hami Kissan</h1>
        <h2 className="hero-subtitle">
          Smart Agriculture Technology for Modern Farmers
        </h2>
        <div className="cta-btns">
          <Link to="/recommend" className="btn">
            🌱 Discover Your Crops
            <p>AI Powered Recommendations</p>
          </Link>
          <Link to="/disease" className="btn">
            🦠 Smart Agri-Toolkit
            <p>Complete suite of smart tools</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
