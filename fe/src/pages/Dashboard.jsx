import { Link } from 'react-router-dom';
import '../styles/dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-content">
            <div className="nav-brand">                                                                                           
              <div className="brand-icon">
                <span className="brand-emoji">🌾</span>
              </div>
              <span className="brand-text">Dashboard</span>
            </div>
            <div className="nav-links">
              <Link to="../recommend" className="nav-link">Crops</Link>
              <Link to="../explore" className="nav-link">Marketplace</Link>
              <Link to="../alerts" className="nav-link">Weather</Link>
              <Link to="../disease" className="nav-link">Plant Clinic</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Main Section */}
      <div className="dashboard-main-section">
        {/* Background Pattern */}
        <div className="dashboard-background"></div>
        
        {/* Animated Background Elements */}
        <div className="floating-elements">
          <div className="floating-circle circle-1"></div>
          <div className="floating-circle circle-2"></div>
          <div className="floating-circle circle-3"></div>
          <div className="floating-circle circle-4"></div>
        </div>

        <div className="dashboard-content">
        <h1 className="dashboard-title">
            <span className="gradient-text">Hami Kisaan </span>
          </h1>
          
          <p className="dashboard-subtitle">
            AI-Powered Agriculture Solutions
          </p>
          
          <p className="dashboard-description">
            Transform your farming with intelligent crop recommendations, disease detection, and real-time weather insights.
          </p>

          {/* Quick Actions */}
          <div className="quick-actions">
            <Link to="../recommend" className="action-card card-crops"
            
            >
              <div className="action-icon">🌱</div>
              <h3 className="action-title">Crop Advisor And Fertilizer Guide</h3>
              <p className="action-description">AI recommendations</p>
            </Link>
            
            <Link to="/disease" className="action-card card-disease"
            
            >
              <div className="action-icon">🔬</div>
              <h3 className="action-title">Plant Doctor</h3>
              <p className="action-description">Disease detection</p>
            </Link>
            
            <Link to="/weatheralerts" className="action-card card-weather"
            
            >
              <div className="action-icon">🌦️</div>
              <h3 className="action-title">Weather Hub</h3>
              <p className="action-description">Live Weather alerts</p>
            </Link>
            
            <Link to="/alerts" className="action-card card-alert">
              <div className="action-icon">🛡️</div>
              <h3 className="action-title">Crop Protections</h3>
              <p className="action-description">Disease Alerts To Protect Your Crops</p>
            </Link>




            <Link to="/tutorial" className="action-card card-toturial">
              <div className="action-icon">®️</div>
              <h3 className="action-title">Guides for Crops</h3>
              <p className="action-description">Tutorials/Advice on how to Grow Crops Effectively</p>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">120+</div>
              <div className="stat-label">Crop Types</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">AI</div>
              <div className="stat-label">Powered</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Monitoring</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">Free</div>
              <div className="stat-label">Platform</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Features */}
      <div className="features-section">
        <div className="features-container">
          <div className="section-header">
            <h2 className="section-title">
              Complete Farming Dashboard
            </h2>
            <p className="section-description">
              Everything you need to make informed agricultural decisions in one place
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon analytics-icon">
                <span>📊</span>
              </div>
              <h3 className="feature-title">Smart Analytics</h3>
              <p className="feature-description">
                Real-time data analysis and insights for optimal farming decisions based on weather, soil, and market conditions.
              </p>
              <div className="feature-link">
                <span>Learn more</span>
                <span className="arrow">→</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon precision-icon">
                <span>🎯</span>
              </div>
              <h3 className="feature-title">Precision Farming</h3>
              <p className="feature-description">
                Get precise recommendations for seeds, fertilizers, and farming techniques tailored to your specific location.
              </p>
              <div className="feature-link">
                <span>Explore features</span>
                <span className="arrow">→</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon protection-icon">
                <span>🛡️</span>
              </div>
              <h3 className="feature-title">Crop Protection</h3>
              <p className="feature-description">
                Early disease detection, pest monitoring, and weather alerts to protect your crops from potential threats.
              </p>
              <div className="feature-link">
                <span>Stay protected</span>
                <span className="arrow">→</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="steps-section">
        <div className="steps-container">
          <div className="section-header">
            <h2 className="section-title">Simple. Smart. Effective.</h2>
            <p className="section-description">Get started in just three easy steps</p>
          </div>
          
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-number step-1">
                <span>1</span>
              </div>
              <h3 className="step-title">Input Your Data</h3>
              <p className="step-description">
                Share your location, soil type, and farming preferences to get personalized recommendations.
              </p>
            </div>
            
            <div className="step-item">
              <div className="step-number step-2">
                <span>2</span>
              </div>
              <h3 className="step-title">AI Analysis</h3>
              <p className="step-description">
                Our advanced AI processes weather patterns, soil data, and market trends for optimal results.
              </p>
            </div>
            
            <div className="step-item">
              <div className="step-number step-3">
                <span>3</span>
              </div>
              <h3 className="step-title">Take Action</h3>
              <p className="step-description">
                Implement smart recommendations and monitor your crops with real-time alerts and guidance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;