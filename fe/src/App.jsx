import { useEffect } from "react";
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
import VoiceButton from "./components/VoiceButton";
import NotFound from "./pages/NotFound";
import "./App.css";
import Notifications from "./pages/Notifications";
import CreateListingModal from "./components/CreateListingModal";

const App = () => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app-container">
      <VoiceButton />
       <Header />
      <div
      // style={{
      //   paddingTop: location.pathname === "/dashboard" ? "0px" : "72px",
      // }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/explore" element={<Explore />} />
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
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/404" element={<NotFound />} />
        </Routes>
      </div>
       <Footer />
    </div>
  );
};

export default App;
