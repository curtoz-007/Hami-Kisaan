import { useEffect, useRef } from "react";
import "../styles/about.css";

export default function About() {
  const progressRef = useRef(null);

  useEffect(() => {
    const progressBars = progressRef.current?.querySelectorAll(".progress-bar");
    if (progressBars) {
      progressBars.forEach((bar, index) => {
        setTimeout(() => {
          bar.style.width = bar.dataset.progress;
        }, index * 200);
      });
    }
  }, []);

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-container">
          <div className="hero-content">
            <h1>About Hami Kissan</h1>
            <p>
              Empowering farmers with cutting-edge technology for sustainable
              agriculture
            </p>
            <button className="button primary hero-cta">
              Explore Our Solutions
            </button>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="about-container">
          <h2 className="section-title">Our Story</h2>
          <div className="story-content">
            <div className="story-text">
              <p>
                Launched in 2025, <strong>Hami Kissan</strong> was born from a
                passion to revolutionize farming. Our mission is to empower
                farmers with real-time insights and tools to enhance
                productivity and sustainability.
              </p>
              <p>
                From a hackathon spark, we’re growing into a leading agri-tech
                platform, supporting thousands with AI-driven crop management,
                weather forecasts, and sustainable practices. Our vision is to
                make modern agriculture accessible to all farmers.
              </p>
            </div>
            <div className="story-visual">
              <div className="timeline">
                <div className="timeline-item">
                  <div className="year">2025</div>
                  <div className="milestone">Project Kickoff</div>
                </div>
                <div className="timeline-item">
                  <div className="year">2025</div>
                  <div className="milestone">First 500 Farmers</div>
                </div>
                <div className="timeline-item">
                  <div className="year">2026</div>
                  <div className="milestone">AI-Powered Insights</div>
                </div>
                <div className="timeline-item">
                  <div className="year">2026</div>
                  <div className="milestone">1,000+ Users</div>
                </div>
                <div className="timeline-item">
                  <div className="year">2027</div>
                  <div className="milestone">Regional Expansion</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="impact-section">
        <div className="about-container">
          <h2 className="section-title">Our Impact</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <svg
                className="metric-icon"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4caf50"
              >
                <path d="M12 2v6l3 3-3 3v6m-6-9h12" />
              </svg>
              <div className="metric-number">15%</div>
              <div className="metric-label">Yield Increase</div>
            </div>
            <div className="metric-card">
              <svg
                className="metric-icon"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4caf50"
              >
                <path d="M12 2v20m8-16h-4v12h4M4 6h4v12H4" />
              </svg>
              <div className="metric-number">25%</div>
              <div className="metric-label">Income Growth</div>
            </div>
            <div className="metric-card">
              <svg
                className="metric-icon"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4caf50"
              >
                <path d="M12 2a10 10 0 00-10 10c0 4.42 2.87 8.17 6.84 9.5" />
              </svg>
              <div className="metric-number">40%</div>
              <div className="metric-label">Water Conservation</div>
            </div>
            <div className="metric-card">
              <svg
                className="metric-icon"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4caf50"
              >
                <path d="M12 2a10 10 0 0110 10c0 4.42-2.87 8.17-6.84 9.5" />
              </svg>
              <div className="metric-number">95%</div>
              <div className="metric-label">Disease Detection</div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="tech-section" ref={progressRef}>
        <div className="about-container">
          <h2 className="section-title">Our Technology</h2>
          <div className="tech-grid">
            <div className="tech-category">
              <h3>AI & Machine Learning</h3>
              <div className="tech-items">
                <div className="tech-item">
                  <span className="tech-name">TensorFlow</span>
                  <div className="progress-bar" data-progress="90%"></div>
                </div>
                <div className="tech-item">
                  <span className="tech-name">PyTorch</span>
                  <div className="progress-bar" data-progress="85%"></div>
                </div>
                <div className="tech-item">
                  <span className="tech-name">Computer Vision</span>
                  <div className="progress-bar" data-progress="95%"></div>
                </div>
              </div>
            </div>
            <div className="tech-category">
              <h3>Data & Analytics</h3>
              <div className="tech-items">
                <div className="tech-item">
                  <span className="tech-name">Python</span>
                  <div className="progress-bar" data-progress="95%"></div>
                </div>
                <div className="tech-item">
                  <span className="tech-name">Pandas</span>
                  <div className="progress-bar" data-progress="90%"></div>
                </div>
                <div className="tech-item">
                  <span className="tech-name">SQL</span>
                  <div className="progress-bar" data-progress="85%"></div>
                </div>
              </div>
            </div>
            <div className="tech-category">
              <h3>Frontend & Mobile</h3>
              <div className="tech-items">
                <div className="tech-item">
                  <span className="tech-name">React</span>
                  <div className="progress-bar" data-progress="90%"></div>
                </div>
                <div className="tech-item">
                  <span className="tech-name">React Native</span>
                  <div className="progress-bar" data-progress="80%"></div>
                </div>
                <div className="tech-item">
                  <span className="tech-name">Node.js</span>
                  <div className="progress-bar" data-progress="85%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="about-container">
          <h2 className="section-title">Meet Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <svg
                className="member-avatar"
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4caf50"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <h3>Shital Gautam</h3>
              <p className="member-role">Team Member</p>
              <p className="member-bio">
                Frontend developer with 3+ years in React
              </p>
            </div>
            <div className="team-member">
              <svg
                className="member-avatar"
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4caf50"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <h3>Immense Raj Subedi</h3>
              <p className="member-role">Team Member</p>
              <p className="member-bio">
                Python Developer specializing in NumPy
              </p>
            </div>
            <div className="team-member">
              <svg
                className="member-avatar"
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4caf50"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <h3>Ananta Pokhrel</h3>
              <p className="member-role">Team Member</p>
              <p className="member-bio">Database Manager skilled in MySQL</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="about-container">
          <h2 className="section-title">Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <svg
                className="value-icon"
                width="50"
                height="50"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4caf50"
              >
                <path d="M9 18.5l-3-3 1.5-1.5 1.5 1.5 4.5-4.5 1.5 1.5-6 6z" />
              </svg>
              <h3>Trust</h3>
              <p>Fostering transparency and reliability with farmers</p>
            </div>
            <div className="value-card">
              <svg
                className="value-icon"
                width="50"
                height="50"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4caf50"
              >
                <path d="M12 2v6l3 3-3 3v6m-6-9h12" />
              </svg>
              <h3>Innovation</h3>
              <p>Advancing technology to solve agricultural challenges</p>
            </div>
            <div className="value-card">
              <svg
                className="value-icon"
                width="50"
                height="50"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4caf50"
              >
                <path d="M12 2a10 10 0 00-10 10c0 4.42 2.87 8.17 6.84 9.5" />
              </svg>
              <h3>Sustainability</h3>
              <p>Promoting eco-friendly farming practices</p>
            </div>
            <div className="value-card">
              <svg
                className="value-icon"
                width="50"
                height="50"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4caf50"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <h3>Impact</h3>
              <p>Driving positive change in farmers' lives</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="contact-cta">
        <div className="about-container">
          <div className="cta-content">
            <h2>Transform Your Farming Today</h2>
            <p>Join thousands of farmers leveraging our platform for success</p>
            <div className="cta-buttons">
              <button className="button primary">Get Started</button>
              <button className="button secondary">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
