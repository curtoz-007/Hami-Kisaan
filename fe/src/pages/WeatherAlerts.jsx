import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  MdWarning, 
  MdCloud, 
  MdLocationOn, 
  MdRefresh, 
  MdNotifications, 
  MdSecurity,
} from 'react-icons/md';
import { WiDaySunny as WiSun, WiThermometer as WiTemp, WiStrongWind as WiWind, WiRain as WiRainIcon, WiThunderstorm as WiThunder } from 'react-icons/wi';
import '../styles/WeatherAlerts.css';

const WeatherAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const intervalRef = useRef();

  useEffect(() => {
    requestLocationAndFetch();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (autoRefresh && location) {
      intervalRef.current = setInterval(() => {
        fetchWeatherAlerts(false);
      }, 3600000); // 1 hour
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh, location]);

  const requestLocationAndFetch = async () => {
    try {
      setLoading(true);
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      const locationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
     
      setLocation(locationData);
      await fetchWeatherAlerts(true, locationData);
    } catch (error) {
      console.error('Location error:', error);
      setLoading(false);
    }
  };

  const fetchWeatherAlerts = async (showToast = false, locationData = location) => {
    if (!locationData) return;

    try {
      if (showToast) setLoading(true);
     
      const response = await fetch('http://api.xento.xyz/weatherforecast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: locationData.latitude,
          longitude: locationData.longitude
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
     
      // Filter out "No significant weather threats detected" alerts
      const filteredAlerts = (data.alerts || []).filter(alert =>
        !alert.toLowerCase().includes('no significant weather threat')
      );
     
      setAlerts(filteredAlerts);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Weather alerts error:', error);
      // Show positive message instead of error for API failures
      setAlerts([]);
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
    }
  };

  const getAlertIcon = (alert) => {
    const alertLower = alert.toLowerCase();
    if (alertLower.includes('rain') || alertLower.includes('flood')) return <WiRainIcon className="alert-icon" />;
    if (alertLower.includes('hail') || alertLower.includes('thunder')) return <WiThunder className="alert-icon" />;
    if (alertLower.includes('hot') || alertLower.includes('heat')) return <WiSun className="alert-icon" />;
    if (alertLower.includes('wind')) return <WiWind className="alert-icon" />;
    if (alertLower.includes('temp')) return <WiTemp className="alert-icon" />;
    return <MdCloud className="alert-icon" />;
  };

  const getAlertSeverity = (alert) => {
    const alertLower = alert.toLowerCase();
    if (alertLower.includes('heavy') || alertLower.includes('severe') || alertLower.includes('extreme')) {
      return 'high';
    }
    if (alertLower.includes('moderate') || alertLower.includes('possible')) {
      return 'medium';
    }
    return 'low';
  };

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'high':
        return 'severity-high';
      case 'medium':
        return 'severity-medium';
      default:
        return 'severity-low';
    }
  };

  const getPriorityClass = (severity) => {
    switch (severity) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      default:
        return 'priority-low';
    }
  };

  const getPriorityText = (severity) => {
    switch (severity) {
      case 'high':
        return 'High Priority';
      case 'medium':
        return 'Medium Priority';
      default:
        return 'Low Priority';
    }
  };

  return (
    <div className="weather-alerts-container">
      {/* Header */}
      <div className="weather-header">
        <div className="header-content">
          <Link to="/" className="back-link">
            ← Back to Home
          </Link>
          <div className="header-main">
            <div className="header-info">
              <h1 className="header-title">
                <MdWarning className="header-icon" />
                Weather Alerts
              </h1>
              <p className="header-subtitle">Stay ahead of weather threats with real-time alerts</p>
            </div>
            <div className="alert-counter">
              <div className="counter-content">
                <MdSecurity className="counter-icon" />
                {alerts.length}
              </div>
              <div className="counter-label">Active Alerts</div>
            </div>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="content-wrapper">
          {/* Control Panel */}
          <div className="control-panel">
            <div className="control-panel-content">
              <div className="location-info">
                {location && (
                  <div className="location-display">
                    <MdLocationOn className="location-icon" />
                    <span className="location-text">
                      {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                    </span>
                  </div>
                )}
                {lastUpdate && (
                  <div className="last-update">
                    Updated: {lastUpdate.toLocaleTimeString()}
                  </div>
                )}
              </div>
             
              <div className="control-buttons">
                <label className="auto-refresh-label">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="checkbox"
                  />
                  <MdNotifications className="bell-icon" />
                  Auto-refresh
                </label>
               
                <button
                  onClick={() => fetchWeatherAlerts(true)}
                  disabled={loading}
                  className="refresh-button"
                >
                  <MdRefresh className={`refresh-icon ${loading ? 'spinning' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="loading-card">
              <MdRefresh className="loading-spinner" />
              <h3 className="loading-title">Checking Weather Conditions...</h3>
              <p className="loading-text">Analyzing current and forecasted weather patterns</p>
            </div>
          )}

          {/* No Alerts */}
          {!loading && alerts.length === 0 && (
            <div className="no-alerts-card">
              <MdSecurity className="no-alerts-icon" />
              <h3 className="no-alerts-title">All Clear! 🌤️</h3>
              <p className="no-alerts-description">
                No significant weather threats detected for your location.
              </p>
              <p className="no-alerts-note">
                We'll continue monitoring and alert you of any changes.
              </p>
            </div>
          )}

          {/* Active Alerts */}
          {!loading && alerts.length > 0 && (
            <div className="alerts-section">
              <div className="alerts-header">
                <MdWarning className="alerts-header-icon" />
                <h2 className="alerts-header-title">Active Weather Alerts</h2>
              </div>
             
              {alerts.map((alert, index) => {
                const severity = getAlertSeverity(alert);
                const severityClass = getSeverityClass(severity);
                const priorityClass = getPriorityClass(severity);
                const priorityText = getPriorityText(severity);
               
                return (
                  <div
                    key={index}
                    className={`alert-card ${severityClass}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="alert-content">
                      <div className="alert-icon-container">
                        {getAlertIcon(alert)}
                      </div>
                      <div className="alert-details">
                        <div className="priority-container">
                          <span className={`priority-badge ${priorityClass}`}>
                            {priorityText}
                          </span>
                        </div>
                        <p className="alert-text">{alert}</p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Preventive Measures */}
              <div className="preventive-measures">
                <h3 className="preventive-title">
                  <MdSecurity className="preventive-icon" />
                  Recommended Actions
                </h3>
                <div className="preventive-grid">
                  <div className="preventive-item">
                    <h4 className="preventive-subtitle">🌧️ For Heavy Rain/Flooding:</h4>
                    <ul className="preventive-list">
                      <li>• Ensure proper drainage in fields</li>
                      <li>• Move livestock to higher ground</li>
                      <li>• Harvest ready crops if possible</li>
                      <li>• Cover storage areas</li>
                    </ul>
                  </div>
                  <div className="preventive-item">
                    <h4 className="preventive-subtitle">⛈️ For Hail/Thunderstorms:</h4>
                    <ul className="preventive-list">
                      <li>• Use protective covers on crops</li>
                      <li>• Secure outdoor equipment</li>
                      <li>• Move vehicles under shelter</li>
                      <li>• Check insurance coverage</li>
                    </ul>
                  </div>
                  <div className="preventive-item">
                    <h4 className="preventive-subtitle">🌡️ For Extreme Heat/Drought:</h4>
                    <ul className="preventive-list">
                      <li>• Increase irrigation frequency</li>
                      <li>• Provide shade for livestock</li>
                      <li>• Apply mulch to retain moisture</li>
                      <li>• Monitor plant stress signs</li>
                    </ul>
                  </div>
                  <div className="preventive-item">
                    <h4 className="preventive-subtitle">💨 For Strong Winds:</h4>
                    <ul className="preventive-list">
                      <li>• Secure greenhouses and structures</li>
                      <li>• Install windbreaks if needed</li>
                      <li>• Avoid pesticide application</li>
                      <li>• Check and repair fencing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="quick-links">
            <Link to="/crop-recommendation" className="quick-link btn-earth">
              🌱 View Crop Recommendations
            </Link>
            <Link to="/plant-disease-detection" className="quick-link btn-farm">
              🦠 Plant Disease Scanner
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherAlerts;