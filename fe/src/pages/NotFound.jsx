import React from 'react';
import { Link } from 'react-router-dom';
import page404 from "../assets/404.png";

const NotFound = () => {
  return (
    <div style={{height: '100vh', display: "flex", alignItems: "center",flexDirection: "column", marginTop: "80px"}} >
      <img src={page404} alt="404 Not Found" style={{aspectRatio: "1/1", width:"70%"}}/>
      <Link 
        to="/" 
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;