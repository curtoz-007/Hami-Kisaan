import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Circle,
  Popup,
  GeoJSON,
  Marker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import nepalStates from "../assets/nepal-states.json";
import { fetchDiseaseAlerts, fetchUserLocation } from "../api/alerts";
import { useAuth } from "../context/AuthContext";
import L from "leaflet";

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const MapView = () => {
  const navigate = useNavigate();
  const [position, setPosition] = useState(null); // Kathmandu
  const [alerts, setAlerts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const getAlerts = async () => {
      try {
        const data = await fetchDiseaseAlerts();
        setAlerts(data || []);
      } catch (e) {
        setAlerts([]);
      }
    };
    const getLocation = async () => {
      if (!user) return;
      try {
        const pos = await fetchUserLocation(user.id);

        setPosition([pos.latitude, pos.longitude]);
      } catch (error) {
        console.error("Error fetching user location:", error);
      }
    };
    getLocation();
    getAlerts();
  }, [user]);

  const stateStyle = {
    color: "#333",
    weight: 2,
    fillOpacity: 0.05,
  };

  if (!position) {
    return (
      <div className="flex-center" style={{ height: "100%" }}>
        <p style={{ fontSize: "2rem", color: "var(--soil-brown)" }}>
          Loading map...
        </p>
      </div>
    );
  }

  return (
    <MapContainer
      center={position}
      zoom={9}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <GeoJSON data={nepalStates} style={stateStyle} />

      {/* Disease alerts from database */}
      {alerts.map((alert) => (
        <Circle
          key={alert.id}
          center={[alert.latitude, alert.longitude]}
          radius={10000} // 10km in meters
          pathOptions={{ color: "red", fillOpacity: 0.2 }}
        >
          <Popup>
            <strong>{alert.disease_name}</strong>
            <br />
            Detected at: {new Date(alert.detected_at).toLocaleString()}
            <button
              style={{
                marginTop: 8,
                background: "#2e7d32",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "6px 14px",
                fontSize: "1rem",
                cursor: "pointer",
                fontWeight: 600,
              }}
              onClick={() => navigate("/disease")}
            >
              विवरण हेर्नुहोस्
            </button>
          </Popup>
        </Circle>
      ))}
      {/* User's current location marker */}
      <Marker position={position} icon={userIcon}>
        <Popup>
          <strong>Your Current Location</strong>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapView;
