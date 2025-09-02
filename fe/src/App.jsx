import { useEffect, useState, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import DiseaseDetection from "./pages/DiseaseDetection";
import Recommend from "./pages/Recommend";
import AuthCallback from "./pages/AuthCallback";
import AgriToolkit from "./pages/AgriToolkit";
import MapAlerts from "./pages/MapAlerts";
import WeatherAlerts from "./pages/WeatherAlerts";
import HamikissanTutorial from "./pages/HamikissanTutorial";
import "./App.css";
import Footer from "./components/Footer";

const App = () => {
  const location = useLocation();
  const headerRef = useRef(null);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, [location.pathname]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app-container">
      {location.pathname !== "/dashboard" && <Header ref={headerRef} />}
      <div
      // style={{
      //   paddingTop: location.pathname === "/dashboard" ? "0px" : "72px",
      // }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="explore" element={<Explore />} />
          <Route path="/about" element={<About />} />
          <Route path="/disease" element={<DiseaseDetection />} />
          <Route path="/recommend" element={<Recommend />} />
          <Route path="/toolkit" element={<AgriToolkit />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/alerts" element={<MapAlerts />} />
          <Route path="/weatheralerts" element={<WeatherAlerts />} />
          <Route path="/hamikissantutorial" element={<HamikissanTutorial />} />
        </Routes>
      </div>
      {location.pathname !== "/dashboard" && <Footer />}
    </div>
  );
};

export default App;
