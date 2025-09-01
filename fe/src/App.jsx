import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import DiseaseDetection from "./pages/DiseaseDetection";
import Recommend from "./pages/Recommend";

const App = () => {
  return (
    <div className="app-container">
      <Header />
      <div style={{ marginTop: "72px" }}>
        {/*to offset fixed header height*/}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="explore" element={<Explore />} />
          <Route path="/about" element={<About />} />
          <Route path="/disease" element={<DiseaseDetection />} />
          <Route path="/recommend" element={<Recommend />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
