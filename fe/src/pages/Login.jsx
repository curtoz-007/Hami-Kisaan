import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { signInWithProvider, signInWithEmail } from "../api/auth";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import "../styles/auth.style.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      try {
        setSubmitting(true);
        await signInWithEmail({
          email: formData.email,
          password: formData.password,
        });
        navigate("/dashboard");
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
          <h1 className="auth-title">Welcome Back!</h1>
          <p className="auth-subtitle">Continue your farming journey...</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
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

          <button type="submit" className="login-button" disabled={submitting}>
            {submitting ? "LOGGING IN..." : "LOG IN"}
          </button>

          <div className="social-login">
            <div className="social-divider">
              <span>— Or Sign Up With —</span>
            </div>

            <div className="social-buttons">
              <button type="button" className="social-button facebook-button">
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
          </div>
        </form>
        <div className="auth-toggle">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="auth-toggle-btn">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;
