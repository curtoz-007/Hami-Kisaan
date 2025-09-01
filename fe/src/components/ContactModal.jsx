import React from "react";
import { FiX } from "react-icons/fi";

const ContactModal = ({ user, open, onClose }) => {
  if (!open || !user) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 28,
          maxWidth: 340,
          margin: "10vh auto",
          boxShadow: "0 8px 32px rgba(30,60,47,0.18)",
          position: "relative",
          top: 10,
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "none",
            border: "none",
            fontSize: 22,
            cursor: "pointer",
            color: "#888",
          }}
          aria-label="Close"
        >
          <FiX />
        </button>
        <h2 style={{ marginTop: 0, marginBottom: 16 }}>Farmer Contact Info</h2>
        <div style={{ display: "grid", gap: 10 }}>
          <div>
            <span className="muted">Name:</span>
            <span style={{ fontWeight: 600, marginLeft: 8 }}>
              {user.full_name}
            </span>
          </div>
          <div>
            <span className="muted">Email:</span>
            <span style={{ fontWeight: 600, marginLeft: 8 }}>{user.email}</span>
          </div>
          <div>
            <span className="muted">Phone:</span>
            <span style={{ fontWeight: 600, marginLeft: 8 }}>{user.phone}</span>
          </div>
          <div>
            <span className="muted">Address:</span>
            <span style={{ fontWeight: 600, marginLeft: 8 }}>
              {user.address}
            </span>
          </div>
          {user.facebook_profile_url && (
            <div>
              <span className="muted">Facebook:</span>
              <a
                href={
                  user.facebook_profile_url.startsWith("http")
                    ? user.facebook_profile_url
                    : `https://${user.facebook_profile_url}`
                }
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginLeft: 8, color: "#2e7d32", fontWeight: 600 }}
              >
                Profile Link
              </a>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .modal-backdrop {
          position: fixed;
          z-index: 1000;
          inset: 0;
          background: rgba(30,60,47,0.18);
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

export default ContactModal;
