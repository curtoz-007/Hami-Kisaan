import { useState } from "react";
import { uploadKYCFile } from "../api/user";
import "../styles/auth.style.css";

export default function CompleteProfileModal({
  open,
  onClose,
  onSubmit,
  defaultValues,
}) {
  const [form, setForm] = useState({
    role: defaultValues?.role || "Consumer",
    phone: defaultValues?.phone || "",
    address: defaultValues?.address || "",
    facebook_profile_url: defaultValues?.facebook_profile_url || "",
    kyc_image_url: defaultValues?.kyc_image_url || "",
  });
  const [file, setFile] = useState(null);
  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
  };
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setSaving(true);

      let imageUrl = "";
      if (file) {
        // Upload the file and get the URL
        imageUrl = await uploadKYCFile(file);
        console.log(imageUrl);
      }
      setForm((p) => ({ ...p, kyc_image_url: imageUrl || p.kyc_image_url }));
      await onSubmit?.(form);
      onClose?.();
    } catch (err) {
      setError(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-container">
        <h1 className="auth-title" style={{ fontSize: "2.2rem" }}>
          Complete your profile
        </h1>
        {error && (
          <div className="error-message">
            <span className="error-icon">!</span>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group" style={{ marginTop: 4 }}>
            <div className="social-divider">
              <span>— Joining as a —</span>
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "space-around",
              }}
            >
              <button
                type="button"
                className="social-button" //for same css
                style={{
                  background:
                    form.role === "Consumer"
                      ? "var(--secondary-green)"
                      : undefined,
                  color:
                    form.role === "Consumer" ? "white" : "var(--muted-gray)",
                }}
                onClick={() => setForm((p) => ({ ...p, role: "Consumer" }))}
              >
                Consumer
              </button>

              <button
                type="button"
                className="social-button" //for same css
                style={{
                  background:
                    form.role === "Farmer"
                      ? "var(--secondary-green)"
                      : undefined,
                  color: form.role === "Farmer" ? "white" : "var(--muted-gray)",
                }}
                onClick={() => setForm((p) => ({ ...p, role: "Farmer" }))}
              >
                Farmer
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Phone number</label>
            <input
              className="form-input"
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
              placeholder="e.g., +977-98xxxxxxx"
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              className="form-input"
              value={form.address}
              onChange={(e) =>
                setForm((f) => ({ ...f, address: e.target.value }))
              }
              placeholder="City, District"
            />
          </div>
          <div className="form-group">
            <label>Identity Confirmation(enter valid document)</label>
            <input type="file" onChange={handleFileUpload} />
          </div>
          <div className="form-group">
            <label>Facebook profile URL</label>
            <input
              className="form-input"
              value={form.facebook_profile_url}
              onChange={(e) =>
                setForm((f) => ({ ...f, facebook_profile_url: e.target.value }))
              }
              placeholder="https://facebook.com/your.profile"
            />
          </div>

          <button type="submit" className="login-button" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
