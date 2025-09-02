import React from "react";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-logo">🌱 Team QuBits</span>
          <span className="footer-tagline">
            Empowering Nepali Agriculture with AI & Community
          </span>
        </div>
        <div className="footer-links">
          <a href="/about">About</a>
          <a href="/explore">Explore</a>
          <a href="/toolkit">Toolkit</a>
          <a href="/alerts">Disease Alerts</a>
        </div>
        <div className="footer-copy">
          &copy; {new Date().getFullYear()} Team QuBits. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
