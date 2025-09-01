import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/header.css";

const Header = () => {
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/explore" },
    { name: "About", href: "/about" },
    { name: "Disease Detection", href: "/disease" },
    { name: "Crop Recommendation", href: "/recommend" },
  ];

  const navigate = useNavigate();
  return (
    <header className="header shadow-dark-md">
      <Link to={"/"} className="logo">
        Hami Kissan
      </Link>
      <nav className="nav">
        {navLinks.map((link) => (
          <Link key={link.name} to={link.href} className="nav-link">
            {link.name}
          </Link>
        ))}
      </nav>
      <div className="auth-btns">
        <button onClick={() => navigate("/login")} className="btn btn-login">
          Login
        </button>
        <button onClick={() => navigate("/signup")} className="btn btn-signup">
          Sign Up
        </button>
      </div>
    </header>
  );
};

export default Header;
