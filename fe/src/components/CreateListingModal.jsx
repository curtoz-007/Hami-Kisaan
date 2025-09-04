import { useState } from "react";
import { createListing, uploadFile } from "../api/listings";
import VoiceRecorder from "./VoiceRecorder";

export default function CreateListingModal({
  open,
  onClose,
  userId,
  onCreated,
}) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    unit: "per kg",
    quantity: "",
    image_url: "",
  });
  const [file, setFile] = useState(null);
  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
  };

  const handleCropDataExtracted = (cropData) => {
    setForm((prevForm) => ({
      ...prevForm,
      name: cropData.name || prevForm.name,
      price: cropData.price || prevForm.price,
      unit: cropData.unit || prevForm.unit,
      quantity: cropData.quantity || prevForm.quantity,
    }));
  };
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setSaving(true);

      let imageUrl = "";
      if (file) {
        // Upload the file and get the URL
        imageUrl = await uploadFile(file);
        console.log(imageUrl);
      }

      const created = await createListing({
        name: form.name,
        price: Number(form.price),
        unit: form.unit,
        quantity: Number(form.quantity),
        image_url: imageUrl,
        userId,
      });

      setForm({ name: "", price: "", unit: "per kg", quantity: "" });
      onCreated?.(created);
      onClose?.();
    } catch (err) {
      setError(err.message || "Failed to create listing");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        background: "rgba(0,0,0,0.9)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        maxHeight: "100vh",
        overflowY: "auto",
      }}
    >
      <div
        className="auth-container"
        style={{ width: 500, background: "white", marginTop: "10rem"}}
      >
        <h1 className="auth-title">Create Listing</h1>
        {error && (
          <div className="error-message">
            <span className="error-icon">!</span>
            {error}
          </div>
        )}
        <form onSubmit={submit} className="auth-form">
          <div className="form-group">
            <label>Product name</label>
            <input
              className="form-input"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g., Fresh Tomatoes"
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              className="form-input"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: e.target.value }))
              }
              placeholder="e.g., 45"
            />
          </div>
          <div className="form-group">
            <label>Unit</label>
            <select
              className="form-input"
              value={form.unit}
              onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
            >
              <option value="per kg">per kg</option>
              <option value="per dozen">per dozen</option>
              <option value="per piece">per piece</option>
            </select>
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input
              className="form-input"
              type="number"
              min="0"
              step="1"
              value={form.quantity}
              onChange={(e) =>
                setForm((f) => ({ ...f, quantity: e.target.value }))
              }
              placeholder="e.g., 120"
            />
          </div>
          <div className="form-group">
            <label>Upload image of the crop</label>
            <input type="file" onChange={handleFileUpload} />
          </div>
          <div className="form-actions" style={{ justifyContent: "flex-end" }}>
            <button
              type="button"
              className="button"
              style={{ marginRight: "15px" }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="listing-button" disabled={saving}>
              {saving ? "Saving..." : "Create"}
            </button>
          </div>
        </form>
        <div style={{ marginTop: 16 }}>
          <div className="social-divider" style={{ marginBottom: 12 }}>
            <span>— Or record details —</span>
          </div>
          <VoiceRecorder onCropDataExtracted={handleCropDataExtracted} />
        </div>
      </div>
    </div>
  );
}
