import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import CreateListingModal from "../components/CreateListingModal";
import { useAuth } from "../context/AuthContext";
import { signOut } from "../api/auth";
import { updateUserLocation } from "../api/user";
import { useGeoLocation } from "../api/useGeoLocation";
import "../styles/dashboard.css";

const DashboardHeader = ({ dashboardData, location }) => {
  if (location.error) {
    return <div>Error: {location.error}</div>;
  }

  if (!location.loaded || !dashboardData) {
    return <div>Loading weather data...</div>;
  }

  const { weather } = dashboardData;

  return (
    <header className="dashboard-header">
      <div className="detail-item">
        <span className="detail-label">📍 Location</span>
        <span className="detail-value">
          {location.coordinates.lat.toFixed(2)},{" "}
          {location.coordinates.lng.toFixed(2)}
        </span>
      </div>
      <div className="detail-item">
        <span className="detail-label">⛰️ Elevation</span>
        <span className="detail-value">{weather.altitude?.toFixed(2)} m</span>
      </div>
      <div className="detail-item">
        <span className="detail-label">🧪 Soil pH</span>
        <span className="detail-value">{weather.soil_ph?.toFixed(2)}</span>
      </div>
      <div className="detail-item">
        <span className="detail-label">🌧️ Rainfall</span>
        <span className="detail-value">{weather.rainfall?.toFixed(2)} mm</span>
      </div>
      <div className="detail-item">
        <span className="detail-label">🌤️ Weather</span>
        <span className="detail-value">
          {weather.temperature?.main?.temp?.toFixed(2)}°C
        </span>
      </div>
    </header>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const userId = user?.id;
  const location = useGeoLocation();
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    if (
      user &&
      location.loaded &&
      !location.error &&
      location.coordinates.lat &&
      location.coordinates.lng
    ) {
      // Update user profile with location
      updateUserLocation(
        user.id,
        location.coordinates.lat,
        location.coordinates.lng
      ).catch((err) => {
        console.error("Failed to update user location:", err);
      });
    }
  }, [user, location]);
  // useEffect(() => {
  //   const fetchDashboardData = async () => {
  //     if (location.loaded && !location.error) {
  //       try {
  //         const response = await fetch(
  //           `http://127.0.0.1:8000/dashboard/data/?latitude=${location.coordinates.lat}&longitude=${location.coordinates.lng}`
  //         );
  //         if (!response.ok) {
  //           throw new Error("Network response was not ok");
  //         }
  //         const data = await response.json();
  //         setDashboardData(data);
  //       } catch (error) {
  //         console.error("Error fetching dashboard data:", error);
  //       }
  //     }
  //   };

  //   fetchDashboardData();
  // }, [location]);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  const specialists = [
    { id: 1, name: "Dr. Aarav Sharma", role: "Pathologist" },
    { id: 2, name: "Rina Gupta", role: "Entomologist" },
    { id: 3, name: "Sunil Verma", role: "Agronomist" },
  ];

  return (
    <>
      <div className="dashboard-container">
        <aside className="sidebar">
          <div className="sidebar-header">
            <strong className="brand-title">Hami Kissan</strong>
          </div>
          <nav className="sidebar-nav">
            <Link className="sidebar-link" to="/">
              <span className="icon">🏠</span> Home
            </Link>
            <Link className="sidebar-link" to="/explore">
              <span className="icon">🌾</span> Crops Listings
            </Link>
            <Link className="sidebar-link" to="/disease">
              <span className="icon">🧪</span> Plant Clinic
            </Link>

            <a className="sidebar-link" href="#">
              <span className="icon">📰</span> News & Policies
            </a>
          </nav>
          <div className="sidebar-footer">
            <a className="sidebar-link" href="#">
              <span className="icon">👤</span> About Me
            </a>
            <button className="btn-logout" onClick={handleSignOut}>
              Log Out
            </button>
          </div>
        </aside>

        <main className="main-content">
          <header className="main-header">
            <div>
              <h1 className="welcome-title">
                Welcome back
                {user ? `, ${user.user_metadata?.full_name || user.email}` : ""}
              </h1>
              <p className="welcome-subtitle">Your farming hub at a glance.</p>
            </div>
            <div className="profile-icon">
              <span>🌾</span>
            </div>
          </header>

          <DashboardHeader dashboardData={dashboardData} location={location} />

          <section className="content-grid">
            <div className="grid-col-span-2">
              <div className="panel">
                <h3 className="panel-title">🌱 List your crops</h3>

                <p>
                  Publish products to the marketplace and reach nearby buyers.
                </p>
                <div className="panel-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowModal(true)}
                  >
                    Create Listing
                  </button>
                  <Link to="/explore" className="btn btn-secondary">
                    View Marketplace
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <div className="dashboard-row">
            <div className="panel dashboard-col">
              <h4 className="panel-title">Your latest listings</h4>
              <div className="listings-grid">
                {[
                  { id: 1, name: "Fresh Tomatoes", price: 45, unit: "per kg" },
                  { id: 2, name: "Cauliflower", price: 60, unit: "per kg" },
                  {
                    id: 3,
                    name: "Organic Potatoes",
                    price: 30,
                    unit: "per kg",
                  },
                  { id: 4, name: "Spinach", price: 25, unit: "per bundle" },
                ].map((item) => (
                  <div key={item.id} className="listing-item">
                    <div className="item-name">{item.name}</div>
                    <div className="item-price">
                      Rs {item.price} {item.unit}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel feature-card dashboard-col">
              <h4 className="panel-title">🧪 Plant Clinic</h4>
              <p>Diagnose crop issues using images and symptoms.</p>
              <div className="image-preview">
                <span>Upload image for diagnosis</span>
              </div>
              <Link to="/disease" className="btn btn-tertiary">
                Open Clinic
              </Link>
              <div className="specialists-list">
                <h5>Plant Specialists</h5>
                <ul>
                  {specialists.map((specialist) => (
                    <li key={specialist.id}>
                      <span>
                        {specialist.name} - {specialist.role}
                      </span>
                      <button className="btn-contact">Contact</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>

        <aside className="right-sidebar">
          <div className="panel full-height-panel">
            <h3 className="panel-title">🔔 Notifications</h3>
            <div className="notification-list">
              {[
                "Your seed order has been shipped.",
                "Rain expected in 2 days for your area.",
                "Market price for tomatoes up 6% this week.",
              ].map((n, i) => (
                <div key={i} className="notification-item">
                  {n}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <CreateListingModal
        open={showModal}
        onClose={() => setShowModal(false)}
        userId={userId}
        onCreated={() => alert("Listing created!")}
      />
    </>
  );
}
