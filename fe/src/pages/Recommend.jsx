import React, { useState, useEffect } from "react";
import { FaSeedling, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { GiWheat } from "react-icons/gi";
import "../styles/recommend.css";
import imagesList from "../images/images.json";

const Recommend = () => {
  const BE_BASE_URL = `http://api1.xento.xyz`;
  const [locationState, setLocationState] = useState("requesting");
  const [crops, setCrops] = useState([]);
  const [userLocation, setUserLocation] = useState({ lat: null, lon: null });
  const [placeName, setPlaceName] = useState("");
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [cropDetails, setCropDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [error, setError] = useState("");
  const [visibleCrops, setVisibleCrops] = useState(8);

  const monthNames = [
    "Poush", "Magh", "Faalgun", "chaitra", "Baishakh", "Jestha",
    "Aasad", "Shraawan", "Bhaadra", "Ashoj", "Kartik", "Mangshir"
  ];

  const currentMonth = monthNames[new Date().getUTCMonth()];

  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationState("error");
      setError("Geolocation is not supported by this browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lon: longitude });
        setLocationState("fetching");

        try {
          await Promise.all([
            fetchCropRecommendations(latitude, longitude),
            fetchPlaceName(latitude, longitude),
          ]);
          setLocationState("success");
        } catch (err) {
          setLocationState("error");
          setError("Failed to fetch crop recommendations");
        }
      },
      (error) => {
        setLocationState("denied");
        setError("Location access denied. Please enable location permissions and refresh the page.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000,
      }
    );
  };

  const fetchCropRecommendations = async (lat, lon) => {
    try {
      const response = await fetch(`${BE_BASE_URL}/Crop_recommendation?lat=${lat}&lon=${lon}`);
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      const data = await response.json();
      const sortedCrops = data.sort((a, b) => b.Score - a.Score);
      setCrops(sortedCrops);
    } catch (err) {
      throw new Error("Failed to fetch crop recommendations");
    }
  };

  const fetchPlaceName = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
      );
      if (!response.ok) throw new Error("Failed to fetch location name");
      const data = await response.json();
      const city = data.address.city || data.address.town || data.address.village || data.address.district || `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
      setPlaceName(city);
    } catch (err) {
      setPlaceName(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
    }
  };

  const getCropImage = (cropName) => {
    const image = imagesList.find(
      (img) => img.name.toLowerCase() === cropName.toLowerCase()
    );
    return image ? image.imagelink : "/api/placeholder/200/150";
  };

  const handleCropClick = async (crop) => {
    setSelectedCrop(crop);
    setIsModalOpen(true);
    setIsLoadingDetails(true);
    setCropDetails(null);

    try {
      const response = await fetch(`${BE_BASE_URL}/Crop_info?name=${encodeURIComponent(crop.Crop)}`);
      if (!response.ok) throw new Error('Failed to fetch crop details');
      const data = await response.json();
      setCropDetails(data[0]);
    } catch (err) {
      setError("Failed to fetch crop details");
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCrop(null);
    setCropDetails(null);
    setError("");
  };

  const formatMonthRange = (startMonth, endMonth) => {
    if (startMonth === endMonth) {
      return monthNames[startMonth - 1];
    }
    return `${monthNames[startMonth - 1]} - ${monthNames[endMonth - 1]}`;
  };

  const handleSeeMore = () => {
    setVisibleCrops((prev) => prev + 8);
  };

  const renderLocationStatus = () => {
    switch (locationState) {
      case "requesting":
        return (
          <div className="status-container">
            <div className="loader"></div>
            <p>Requesting location permission...</p>
          </div>
        );
      case "denied":
        return (
          <div className="status-container error">
            <div className="error-icon">❌</div>
            <p>{error}</p>
            <button onClick={requestLocation} className="retry-btn">
              Try Again
            </button>
          </div>
        );
      case "fetching":
        return (
          <div className="status-container">
            <div className="loader"></div>
            <p>Fetching crop recommendations...</p>
          </div>
        );
      case "error":
        return (
          <div className="status-container error">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
            <button onClick={requestLocation} className="retry-btn">
              Try Again
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (locationState !== "success") {
    return (
      <div className="recommend-container">
        <header className="recommend-header">
          <h1 className="text-3xl font-bold text-green-700">
            <FaSeedling style={{ marginRight: '8px' }} />
            Hami Kisaan Crop Recommendations
          </h1>
        </header>
        {renderLocationStatus()}
      </div>
    );
  }

  return (
    <div className="recommend-container">
      <header className="recommend-header">
        <h1 className="text-3xl font-bold text-green-700">
          <FaSeedling style={{ marginRight: '8px' }} />
          हामी किसान बाली परामर्श
        </h1>
        <div className="location-info">
          <div className="info-item">
            <span className="info-label">
              <FaMapMarkerAlt style={{ marginRight: '4px' }} />
              Location:
            </span>
            <span className="info-value">{placeName}</span>
          </div>
          <div className="info-item">
            <span className="info-label">
              <FaCalendarAlt style={{ marginRight: '4px' }} />
              Current Month:
            </span>
            <span className="info-value">{currentMonth}</span>
          </div>
          <div className="info-item">
            <span className="info-label">
              <GiWheat style={{ marginRight: '4px' }} />
              Crops Found:
            </span>
            <span className="info-value">{crops.length}</span>
          </div>
        </div>
      </header>

      <main className="crops-grid">
        {crops.slice(0, visibleCrops).map((crop, index) => (
          <div
            key={index}
            className="crop-card"
            onClick={() => handleCropClick(crop)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleCropClick(crop);
              }
            }}
          >
            <div className="crop-image-container">
              <img
                src={getCropImage(crop.Crop)}
                alt={crop.Crop}
                className="crop-image"
                onError={(e) => {
                  e.target.src = "/api/placeholder/200/150";
                }}
              />
            </div>
            <div className="crop-info">
              <h3 className="crop-name">{crop.Crop}</h3>
              <p className="suitability-score">Suitability: {crop.Score}%</p>
            </div>
          </div>
        ))}
      </main>

      {visibleCrops < crops.length && (
        <div className="see-more-container">
          <button onClick={handleSeeMore} className="see-more-btn">
            See More
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="text-2xl font-semibold text-green-700">{selectedCrop?.Crop}</h2>
              <button
                className="close-btn"
                onClick={closeModal}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {isLoadingDetails ? (
                <div className="modal-loading">
                  <div className="loader"></div>
                  <p>Loading crop details...</p>
                </div>
              ) : error && !cropDetails ? (
                <div className="modal-error">
                  <p>{error}</p>
                </div>
              ) : cropDetails ? (
                <div className="crop-details">
                  <div className="details-section">
                    <h3 className="section-title">🌡️ Environmental Requirements</h3>
                    <div className="details-grid">
                      <div className="detail-item">
                        <span className="detail-label">Temperature:</span>
                        <span className="detail-value">
                          {cropDetails.Ecology_Temp_Optimal_Min}°C -{" "}
                          {cropDetails.Ecology_Temp_Optimal_Max}°C
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Annual Rainfall:</span>
                        <span className="detail-value">
                          {cropDetails.Ecology_Rainfall_Annual_Optimal_Min} -{" "}
                          {cropDetails.Ecology_Rainfall_Annual_Optimal_Max} mm
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Latitude Range:</span>
                        <span className="detail-value">
                          {cropDetails.Ecology_Latitude_Optimal_Min}° -{" "}
                          {cropDetails.Ecology_Latitude_Optimal_Max}°
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Altitude:</span>
                        <span className="detail-value">
                          {cropDetails.Ecology_Altitude_Optimal_Min} -{" "}
                          {cropDetails.Ecology_Altitude_Optimal_Max} m
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Soil pH:</span>
                        <span className="detail-value">
                          {cropDetails.Ecology_Soil_PH_Optimal_Min} -{" "}
                          {cropDetails.Ecology_Soil_PH_Optimal_Max}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="details-section">
                    <h3 className="section-title">
                      <FaCalendarAlt style={{ marginRight: '8px' }} />
                      Planting & Harvesting
                    </h3>
                    <div className="details-grid">
                      <div className="detail-item">
                        <span className="detail-label">Planting Period:</span>
                        <span className="detail-value">
                          {formatMonthRange(
                            cropDetails.Planting_Start_Month,
                            cropDetails.Planting_End_Month
                          )}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Harvesting Period:</span>
                        <span className="detail-value">
                          {formatMonthRange(
                            cropDetails.Harvesting_Start_Month,
                            cropDetails.Harvesting_End_Month
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="details-section">
                    <h3 className="section-title">🌿 Nutrient Requirements</h3>
                    <div className="details-grid">
                      <div className="detail-item">
                        <span className="detail-label">Nitrogen (N):</span>
                        <span className="detail-value">
                          {cropDetails.N_Required_kg_ha} kg/ha
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Phosphorus (P):</span>
                        <span className="detail-value">
                          {cropDetails.P_Required_kg_ha} kg/ha
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Potassium (K):</span>
                        <span className="detail-value">
                          {cropDetails.K_Required_kg_ha} kg/ha
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="details-section">
                    <h3 className="section-title">💧 Fertilizer Information</h3>
                    <div className="fertilizer-info">
                      <div className="detail-item full-width">
                        <span className="detail-label">Recommended Fertilizers:</span>
                        <span className="detail-value">{cropDetails.Fertilizers}</span>
                      </div>
                      <div className="detail-item full-width">
                        <span className="detail-label">Usage Period:</span>
                        <span className="detail-value">{cropDetails.Usage_Period}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommend;