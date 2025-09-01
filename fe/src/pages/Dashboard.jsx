import { Link } from "react-router-dom";
import { useState } from "react";
import CreateListingModal from "../components/CreateListingModal";
// import VoiceRecorderTest from "../components/VoiceRecorderTest";
import { useAuth } from "../context/AuthContext";
import { signOut } from "../api/auth";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  // const [showVoiceTest, setShowVoiceTest] = useState(false);
  const userId = user?.id;

  return (
    <>
      <div className="dashboard">
        <div className="container" style={{ width: "100%", padding: "0 24px" }}>
          <div
            className="dashboard-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "260px 1fr 320px",
              gap: 20,
            }}
          >
            <aside className="sidebar-agri panel">
              <div className="brand-chip">
                <strong style={{ fontSize: "24px" }}>Hami Kissan</strong>
              </div>
              <nav className="sidebar-list">
                <Link className="sidebar-link" to="/">
                  🏠 Home
                </Link>
                <Link className="sidebar-link" to="/explore">
                  🌾 Crops Listings
                </Link>
                <Link className="sidebar-link" to="/disease">
                  🧪 Plant Clinic
                </Link>
                <a className="sidebar-link" href="#">
                  ⛈️ Weather Alerts
                </a>
                <a className="sidebar-link" href="#">
                  🧯 Fertilizer Guide
                </a>
                <a className="sidebar-link" href="#">
                  📰 News & Policies
                </a>
              </nav>
              <div className="sidebar-section-label">Account</div>
              <nav className="sidebar-list">
                <a className="sidebar-link" href="#">
                  👤 About Me
                </a>
                <Link to="/login">
                  <button
                    className="btn btn-signup"
                    style={{
                      width: "100%",
                      background: "var(--green-text)",
                      color: "white",
                    }}
                    onClick={async (e) => {
                      e.preventDefault();
                      await signOut();
                      window.location.href = "/";
                    }}
                  >
                    Log Out
                  </button>
                </Link>
              </nav>
            </aside>

            <main style={{ display: "grid", gap: 20 }}>
              <section className="panel" style={{ padding: "10px 20px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div>
                    <h2 style={{ margin: 0 }}>
                      🌿 Welcome back
                      {user
                        ? `, ${user.user_metadata?.full_name || user.email}`
                        : ""}
                    </h2>
                    <p className="muted" style={{ marginTop: 6 }}>
                      Your farming hub at a glance.
                    </p>
                  </div>
                  <div
                    className="brand-round"
                    style={{ width: 44, height: 44 }}
                  >
                    🌾
                  </div>
                </div>
              </section>

              <section
                className="panel"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  padding: "10px 20px",
                }}
              >
                <div>
                  <h3 style={{ marginTop: 0 }}>🌱 List your crops</h3>
                  <p>
                    Publish products to marketplace and reach nearby buyers.
                  </p>
                  <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                    <button
                      className="listing-button"
                      onClick={() => setShowModal(true)}
                    >
                      Create Listing
                    </button>
                    <Link to="/explore" className="listing-button">
                      View Marketplace
                    </Link>
                  </div>
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>Your latest listings</h4>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0,1fr))",
                      gap: 10,
                      marginTop: 10,
                    }}
                  >
                    {[
                      {
                        id: 1,
                        name: "Fresh Tomatoes",
                        price: 45,
                        unit: "per kg",
                      },
                      { id: 2, name: "Cauliflower", price: 60, unit: "per kg" },
                    ].map((item) => (
                      <div
                        key={item.id}
                        className="panel"
                        style={{ padding: 12 }}
                      >
                        <div style={{ fontWeight: 600 }}>{item.name}</div>
                        <div className="muted">
                          Rs {item.price} {item.unit}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section
                className="panel"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 16,
                  padding: 20,
                }}
              >
                <div className="panel three-feature" style={{ padding: 16 }}>
                  <h4 style={{ margin: 0 }}>🧪 Plant Clinic</h4>
                  <p className="muted">
                    Diagnose crop issues using images and symptoms.
                  </p>
                  <Link to="/disease" className="listing-button">
                    Open Clinic
                  </Link>
                </div>
                <div className="panel three-feature" style={{ padding: 16 }}>
                  <h4 style={{ margin: 0 }}>📰 News & Policies</h4>
                  <p className="muted">
                    Get information about latest news & policied.
                  </p>
                  <a href="#" className="listing-button">
                    Know More
                  </a>
                </div>
                <div className="panel three-feature" style={{ padding: 16 }}>
                  <h4 style={{ margin: 0 }}>🧯 Fertilizer guide</h4>
                  <p className="muted">Smart nutrient plans for major crops.</p>
                  <a href="#" className="listing-button">
                    View Guide
                  </a>
                </div>
              </section>
            </main>

            <aside
              className="panel"
              style={{
                display: "grid",
                gap: 12,
                padding: 20,
              }}
            >
              <div className="notifications">
                <h3 style={{ marginTop: 0 }}>🔔 Notifications</h3>
                {[
                  "Your seed order has been shipped.",
                  "Rain expected in 2 days for your area.",
                  "Market price for tomatoes up 6% this week.",
                ].map((n, i) => (
                  <div
                    key={i}
                    className="detail-item"
                    style={{
                      padding: "6px 0",
                      borderBottom:
                        i < 2 ? "1px solid var(--surface-soft)" : "none",
                    }}
                  >
                    <span className="detail-value">{n}</span>
                  </div>
                ))}
              </div>
              <div className="alerts">
                <h3 style={{ marginTop: 0 }}>⛈️ Weather ALerts</h3>
                {[
                  "Heavy rainfall in few days",
                  "Rain expected in 2 days for your area.",
                  "High winds today.",
                ].map((n, i) => (
                  <div
                    key={i}
                    className="detail-item"
                    style={{
                      padding: "6px 0",
                      borderBottom:
                        i < 2 ? "1px solid var(--surface-soft)" : "none",
                    }}
                  >
                    <span className="detail-value" style={{ color: "#d33021" }}>
                      {n}
                    </span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
          {/* Bottom: location details spanning full width */}
          <section className="panel" style={{ marginTop: 20, padding: 20 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, minmax(0,1fr))",
                gap: 16,
              }}
            >
              <div className="detail-item" style={{ borderBottom: "none" }}>
                <span className="detail-label">📍 Location</span>
                <span className="detail-value">Your District</span>
              </div>
              <div className="detail-item" style={{ borderBottom: "none" }}>
                <span className="detail-label">⛰️ Elevation</span>
                <span className="detail-value">1,350 m</span>
              </div>
              <div className="detail-item" style={{ borderBottom: "none" }}>
                <span className="detail-label">🧪 Soil pH</span>
                <span className="detail-value">6.5</span>
              </div>
              <div className="detail-item" style={{ borderBottom: "none" }}>
                <span className="detail-label">🌧️ Rainfall</span>
                <span className="detail-value">24 mm (weekly)</span>
              </div>
              <div className="detail-item" style={{ borderBottom: "none" }}>
                <span className="detail-label">🌤️ Weather</span>
                <span className="detail-value">22°C, Mostly sunny</span>
              </div>
            </div>
          </section>
        </div>
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
