import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
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
import Footer from "./components/Footer";
import VoiceRoutingModal from "./components/VoiceRoutingModal";
import NotFound from "./pages/NotFound";
import { IoMdMic } from "react-icons/io";
import "./App.css";

const App = () => {
  const location = useLocation();
  const [opened, setOpened] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app-container">
      <div className="voice-routing" onClick={() => setOpened(true)}>
        {console.log("voice routing opened", opened)}
        <IoMdMic />
      </div>
       <Header />
       {opened ? <VoiceRoutingModal opened={opened} setOpened={setOpened} /> : null}
      <div
      // style={{
      //   paddingTop: location.pathname === "/dashboard" ? "0px" : "72px",
      // }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
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
          <Route path="/tutorial" element={<HamikissanTutorial />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
       <Footer />
    </div>
  );
};

export default App;
