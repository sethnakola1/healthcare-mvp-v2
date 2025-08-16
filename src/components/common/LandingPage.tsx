// src/components/LandingPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';
import '../styles/LandingPage.css';

const LandingPage: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  return (
    <div className="landing-container">
      <header className="landing-header">
        <nav className="navbar">
          <div className="nav-brand">
            <div className="logo-icon">🏥</div>
            <span className="brand-name">HealthHorizon</span>
          </div>
          <div className="nav-links">
            {isAuthenticated ? (
              <div className="user-info">
                <span>Welcome, {user?.firstName}</span>
                <Link to="/dashboard" className="nav-link primary">
                  Dashboard
                </Link>
              </div>
            ) : (
              <Link to="/login" className="nav-link primary">
                Sign In
              </Link>
            )}
          </div>
        </nav>
      </header>

      <main className="landing-main">
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Modern Healthcare Management
              <span className="gradient-text">Made Simple</span>
            </h1>
            <p className="hero-description">
              Streamline your healthcare operations with our comprehensive management platform.
              From appointment booking to patient records, we've got you covered.
            </p>
            <div className="hero-actions">
              {isAuthenticated ? (
                <Link to="/dashboard" className="cta-button">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="cta-button">
                    Get Started
                  </Link>
                  <button className="cta-button secondary">
                    Learn More
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="hero-visual">
            <div className="feature-cards">
              <div className="feature-card">
                <div className="feature-icon">📅</div>
                <h3>Appointment Scheduling</h3>
                <p>Easy booking and management</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">👥</div>
                <h3>Patient Management</h3>
                <p>Comprehensive patient records</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💊</div>
                <h3>Prescription Tracking</h3>
                <p>Digital prescription management</p>
              </div>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="container">
            <h2 className="section-title">Why Choose HealthHorizon?</h2>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon large">🔒</div>
                <h3>Secure & Compliant</h3>
                <p>HIPAA compliant with end-to-end encryption to protect patient data.</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon large">⚡</div>
                <h3>Fast & Reliable</h3>
                <p>Lightning-fast performance with 99.9% uptime guarantee.</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon large">📱</div>
                <h3>Mobile Friendly</h3>
                <p>Access your dashboard from any device, anywhere, anytime.</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon large">🤝</div>
                <h3>24/7 Support</h3>
                <p>Round-the-clock customer support to help you succeed.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo-icon">🏥</div>
              <span className="brand-name">HealthHorizon</span>
            </div>
            <p className="footer-text">
              &copy; 2024 HealthHorizon. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;