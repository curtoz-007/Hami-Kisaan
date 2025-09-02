import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "../api/auth";
import "../styles/header.css";

const Header = () => {
  const { user } = useAuth();

  let navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/explore" },
    { name: "About", href: "/about" },
    { name: "Disease Detection", href: "/disease" },
    { name: "Crop Recommendation", href: "/recommend" },
  ];

  if (user) {
    navLinks = [
      { name: "Home", href: "/" },
      { name: "Dashboard", href: "/dashboard" },
      { name: "Smart Agri-Toolkit", href: "/toolkit" },
      { name: "Explore", href: "/explore" },
      { name: "About", href: "/about" },
    ];
  }
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
        {user ? (
          <>
            <span style={{ fontWeight: 600, color: "white" }}>
              Welcome, {user.user_metadata?.full_name || user.email}
            </span>
            <button
              className="btn btn-signup"
              onClick={async (e) => {
                e.preventDefault();
                await signOut();
                navigate("/");
              }}
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="btn btn-login"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="btn btn-signup"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
