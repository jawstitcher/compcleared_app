import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            <nav className="landing-nav">
                <div className="nav-content">
                    <img src="/logo.png" alt="CompCleared" className="logo-image" />
                    <div className="nav-buttons">
                        <button className="btn-secondary" onClick={() => navigate('/login')}>
                            Log In
                        </button>
                        <button className="btn-primary" onClick={() => navigate('/signup')}>
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            <section className="hero">
                <div className="hero-content">
                    <h1>California SB 553 Workplace Violence Compliance Made Simple</h1>
                    <p className="hero-subtitle">
                        Track incidents, generate compliant reports, and protect your workforce with CompCleared's comprehensive workplace safety platform.
                    </p>
                    <div className="hero-cta">
                        <button className="btn-cta" onClick={() => navigate('/signup')}>
                            Start 14-Day Free Trial
                        </button>
                        <button className="btn-outline" onClick={() => navigate('/login')}>
                            Log In
                        </button>
                    </div>
                </div>
            </section>

            <section className="features">
                <div className="features-container">
                    <h2>Everything You Need for SB 553 Compliance</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">📋</div>
                            <h3>Incident Logging</h3>
                            <p>Track and document workplace violence incidents with comprehensive digital forms that meet California requirements.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📊</div>
                            <h3>SB 553 Reports</h3>
                            <p>Generate compliant reports instantly. Export data in formats required by Cal/OSHA.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔒</div>
                            <h3>Secure & Confidential</h3>
                            <p>Your data is encrypted and protected. Meet privacy requirements while maintaining detailed records.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">👥</div>
                            <h3>Training Tracking</h3>
                            <p>Monitor employee training completion and maintain compliance documentation.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📱</div>
                            <h3>Mobile Ready</h3>
                            <p>Log incidents from anywhere, on any device. Real-time updates keep your team informed.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">⚡</div>
                            <h3>Quick Setup</h3>
                            <p>Get started in minutes. No complex configuration required.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pricing-preview">
                <div className="pricing-content">
                    <h2>Simple, Transparent Pricing</h2>
                    <p>14-day free trial. Plans starting at $49/month. Cancel anytime.</p>
                    <button className="btn-cta" onClick={() => navigate('/signup')}>
                        Start Your Free Trial
                    </button>
                </div>
            </section>

            <footer className="landing-footer">
                <p>&copy; 2026 CompCleared. California SB 553 Workplace Violence Compliance Platform.</p>
            </footer>
        </div>
    );
}

export default LandingPage;
