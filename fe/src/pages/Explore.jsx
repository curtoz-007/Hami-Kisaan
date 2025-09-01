import { useEffect, useState } from "react";
import { getListings } from "../api/listings";
import ContactModal from "../components/ContactModal";
import { FiFilter, FiTrendingUp } from "react-icons/fi";
import "../styles/explore.css";

const Explore = () => {
  const [crops, setCrops] = useState([]);
  const [search, setSearch] = useState("");
  const [contactUser, setContactUser] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listings = await getListings();
        setCrops(listings);
      } catch (error) {
        console.error("Error fetching listings: Explore.jsx", error);
      }
    };
    fetchListings();
  }, []);

  // Filter crops based on search input (case-insensitive)
  const filteredCrops = crops.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.user?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.user?.address?.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="explore-page">
      <ContactModal
        user={contactUser}
        open={!!contactUser}
        onClose={() => setContactUser(null)}
      />
      <div className="explore-container">
        <div className="explore-header">
          <h1>Explore Market Listings</h1>
          <p>Discover farm-fresh produce directly from local farmers.</p>
        </div>

        <div className="explore-content">
          <div className="filter-section">
            <input
              type="text"
              name="search"
              placeholder="Search Startup Ideas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button>
              <FiFilter />
              Filter
            </button>
            <button>
              <FiTrendingUp />
              Top Rated
            </button>
          </div>
          <div className="recommendations-grid" style={{ marginTop: 16 }}>
            {filteredCrops.length === 0 ? (
              <p
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  color: "#666",
                }}
              >
                No listings found.
              </p>
            ) : (
              filteredCrops.map((p) => (
                <div key={p.id} className="card" style={{ textAlign: "left" }}>
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "4/3",
                      overflow: "hidden",
                      borderRadius: 12,
                      marginBottom: 16,
                    }}
                  >
                    <img
                      src={p.image_url}
                      alt={p.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>
                  <h3
                    style={{ margin: "0 0 8px", color: "var(--primary-dark)" }}
                  >
                    {p.name}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                      marginBottom: 12,
                    }}
                  >
                    <span style={{ fontWeight: 700, color: "var(--primary)" }}>
                      Rs {p.price}
                    </span>
                    <span className="muted">{p.unit}</span>
                    <span className="muted">•</span>
                    <span className="muted">Qty: {p.quantity}</span>
                  </div>
                  <div style={{ display: "grid", gap: 6, marginBottom: 16 }}>
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                      }}
                    >
                      <span className="muted">Farmer:</span>
                      <span style={{ fontWeight: 600 }}>
                        {p.user.full_name}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                      }}
                    >
                      <span className="muted">Location:</span>
                      <span style={{ fontWeight: 600 }}>{p.user.address}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <a
                      className="button primary"
                      href="#"
                      onClick={() => setContactUser(p.user)}
                    >
                      Contact farmer
                    </a>
                    <a className="button" href="#">
                      Add to Cart
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
