import React from "react";
import HeroSection from "../components/HeroSection";

const Home = ({ headerHeight }) => {
  return (
    <>
      <HeroSection headerHeight={headerHeight} />
      <div className="container"></div>
    </>
  );
};

export default Home;
