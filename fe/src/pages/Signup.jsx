import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { signInWithProvider, signUpWithEmail } from "../api/auth";
import { createUserProfile } from "../api/user";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import "../styles/auth.style.css";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "Consumer",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      try {
        setSubmitting(true);
        const { user } = await signUpWithEmail({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          role: formData.role,
        });
        if (user) {
          await createUserProfile({
            id: user.id,
            fullName: formData.fullName,
            email: formData.email,
            role: formData.role,
          });
        }
        navigate("/auth/callback");
      } catch (err) {
        setErrors({ root: err.message });
      } finally {
        setSubmitting(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">Join Hami Kissan</h1>
          <p className="auth-subtitle">Start your farming journey with us...</p>
        </div>
        {errors.root && <p className="error-text">{errors.root}</p>}
        <form className="auth-form" onSubmit={(e) => handleSubmit(e)}>
          <div className="form-group">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`form-input ${errors.fullName ? "error" : ""}`}
            />
            {errors.fullName && (
              <span className="error-text">{errors.fullName}</span>
            )}
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? "error" : ""}`}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className={`form-input ${errors.password ? "error" : ""}`}
            />

            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <div className="social-buttons">
              <button
                type="button"
                className="social-button"
                onClick={() => setFormData((p) => ({ ...p, role: "Consumer" }))}
                style={{
                  backgroundColor:
                    formData.role === "Consumer"
                      ? "var(--secondary-green)"
                      : null,
                  color: formData.role === "Consumer" ? "white" : null,
                }}
              >
                Consumer
              </button>
              <button
                type="button"
                className="social-button"
                onClick={() => setFormData((p) => ({ ...p, role: "Farmer" }))}
                style={{
                  backgroundColor:
                    formData.role === "Farmer"
                      ? "var(--secondary-green)"
                      : null,
                  color: formData.role === "Farmer" ? "white" : null,
                }}
              >
                Farmer
              </button>
            </div>
          </div>

          <button type="submit" className="login-button" disabled={submitting}>
            {submitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        <div className="social-divider">— Or continue with —</div>
        <div className="social-buttons">
          <button
            type="button"
            className="social-button facebook-button"
            onClick={() => signInWithProvider("facebook")}
          >
            <FaFacebook size={24} color="#1877F2" />
            <span className="social-icon">Facebook</span>
          </button>
          <button
            type="button"
            className="social-button google-button"
            onClick={() => signInWithProvider("google")}
          >
            <FcGoogle size={24} />
            <span className="social-icon">Google</span>
          </button>
        </div>
        <div className="auth-toggle">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-toggle-btn">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
