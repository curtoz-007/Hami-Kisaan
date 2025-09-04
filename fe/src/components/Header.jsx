import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "../api/auth";
import { FaSignOutAlt, FaRegBell } from "react-icons/fa";
import "../styles/header.css";

const Header = () => {
  const { user } = useAuth();

  let navLinks = [
    { name: "Home", href: "/", },
    { name: "बजार", href: "/explore", },
    { name: "About", href: "/about",},
    { name: "Disease Detection", href: "/disease", },
    { name: "बाली परामर्श", href: "/recommend",},
  ];

  if (user) {
    navLinks = [
      { name: "Dashboard", href: "/dashboard",  },
      { name: "बजार", href: "/explore", },
      { name: "Plant Clinic", href: "/disease",  },
      { name: "Alerts", href: "/alerts"},
      { name: "बाली परामर्श", href: "/recommend", },
      { name: "Tutorials", href: "/tutorial", },
    ];
  }
  const navigate = useNavigate();
  return (
    <header className="header shadow-dark-md">
      <Link to={"/"} className="logo">
        Hami Kisaan
      </Link>
      <nav className="nav">
        {navLinks.map((link) => (
          <Link key={link.name} to={link.href} className="nav-link">
            {link.icon && <span className="nav-icon">{link.icon}</span>}
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
              style={{ display: "flex", alignItems: "center" }}
              onClick={async (e) => {
                e.preventDefault();
                await signOut();
                navigate("/");
              }}
            >
        Sign out <FaSignOutAlt style={{ color: "inherit" , marginLeft: "5px", fontSize: "16px"}} />
            </button>
            <Link to="/notifications" className="nav-icon" title="Notifications" style={{color:"white", fontSize:"24px"}}>
              <FaRegBell />
            </Link>
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
