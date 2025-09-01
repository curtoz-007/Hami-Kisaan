import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";

const Login = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="page auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">Welcome Back!</h1>
          <p className="auth-subtitle">Continue your farming journey...</p>
        </div>
        <form className="auth-form">
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
              type={showPassword ? "text" : "password"}
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
            {submitting ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
          </button>

          <div className="social-login">
            <div className="social-divider">
              <span>— Or Sign Up With —</span>
            </div>

            <div className="social-buttons">
              <button type="button" className="social-button facebook-button">
                <span className="social-icon">f</span>
                Facebook
              </button>

              <button
                type="button"
                className="social-button google-button"
                onClick={() => signInWithProvider("google")}
              >
                <span className="social-icon">G</span>
                Google
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
