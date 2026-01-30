import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { Shield, ShieldCheck, Lock, CheckCircle, ClipboardList, BarChart3, Users, Smartphone, Zap, HelpCircle, Mail } from 'lucide-react';
import './LandingPage.css';

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            <nav className="landing-nav">
                <div className="nav-content">
                    <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        <Logo size="small" />
                    </div>
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

            {/* Trust Bar */}
            <div className="trust-bar">
                <div className="trust-bar-content">
                    <span className="trust-item"><Shield size={16} /> SOC 2 Compliant</span>
                    <span className="trust-item"><ShieldCheck size={16} /> Cal/OSHA Ready</span>
                    <span className="trust-item"><Lock size={16} /> 256-bit Encryption</span>
                    <span className="trust-item"><CheckCircle size={16} /> Trusted by 500+ California Businesses</span>
                </div>
            </div>

            <section className="hero">
                <div className="hero-content">
                    <div className="hero-badge-container">
                        <img src="/california-badge.png" alt="SB 553 Compliant - Cal/OSHA Ready" className="hero-badge" />
                    </div>
                    <h1>California SB 553 Workplace Violence Compliance Made Simple</h1>
                    <p className="hero-subtitle">
                        Track incidents, generate compliant reports, and protect your workforce with <span style={{ color: '#0f172a', fontWeight: 'bold' }}>Comp</span><span style={{ color: '#2563EB', fontWeight: 'bold' }}>Cleared</span>'s comprehensive workplace safety platform.
                    </p>
                    <div className="hero-cta">
                        <button className="btn-cta" onClick={() => navigate('/signup')}>
                            Start 14-Day Free Trial
                        </button>
                        <button className="btn-outline" onClick={() => navigate('/login')}>
                            Log In
                        </button>
                    </div>
                    <p className="hero-disclaimer">No credit card required · Setup in under 5 minutes</p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="stats-container">
                    <div className="stat-item">
                        <div className="stat-number">500+</div>
                        <div className="stat-label">California Businesses Protected</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">50,000+</div>
                        <div className="stat-label">Employees Covered</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">100%</div>
                        <div className="stat-label">Compliance Rate</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">24/7</div>
                        <div className="stat-label">Incident Reporting</div>
                    </div>
                </div>
            </section>

            {/* Product Preview Section */}
            <section className="product-preview">
                <div className="preview-container">
                    <div className="preview-text">
                        <h2>See How Simple It Is</h2>
                        <p className="preview-subtitle">While competitors overwhelm you with seminars, training modules, and complex platforms, we built something different.</p>
                        <ul className="simplicity-list">
                            <li>✓ Log an incident in under 2 minutes</li>
                            <li>✓ Generate Cal/OSHA reports with one click</li>
                            <li>✓ No training required - just start using it</li>
                            <li>✓ Everything you need, nothing you don't</li>
                        </ul>
                        <button className="btn-cta" onClick={() => navigate('/signup')}>
                            Try It Free
                        </button>
                    </div>
                    <div className="preview-image-container">
                        <img src="/dashboard-preview.png" alt="CompCleared Dashboard - Simple SB 553 Compliance" className="preview-image" />
                    </div>
                </div>
            </section>

            <section className="features">
                <div className="features-container">
                    <h2>Everything You Need for SB 553 Compliance</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon-container"><ClipboardList size={28} /></div>
                            <h3>Incident Logging</h3>
                            <p>Track and document workplace violence incidents with comprehensive digital forms that meet California requirements.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-container"><BarChart3 size={28} /></div>
                            <h3>SB 553 Reports</h3>
                            <p>Generate compliant reports instantly. Export data in formats required by Cal/OSHA.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-container"><Lock size={28} /></div>
                            <h3>Secure & Confidential</h3>
                            <p>Your data is encrypted and protected. Meet privacy requirements while maintaining detailed records.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-container"><Users size={28} /></div>
                            <h3>Training Tracking</h3>
                            <p>Monitor employee training completion and maintain compliance documentation.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-container"><Smartphone size={28} /></div>
                            <h3>Mobile Ready</h3>
                            <p>Log incidents from anywhere, on any device. Real-time updates keep your team informed.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-container"><Zap size={28} /></div>
                            <h3>Quick Setup</h3>
                            <p>Get started in minutes. No complex configuration required.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section">
                <div className="testimonials-container">
                    <h2>Trusted by California HR Leaders</h2>
                    <div className="testimonials-grid">
                        <div className="testimonial-card">
                            <div className="testimonial-quote">"CompCleared made our SB 553 compliance seamless. We went from worrying about deadlines to being fully compliant in a week."</div>
                            <div className="testimonial-author">
                                <div className="testimonial-name">Sarah M.</div>
                                <div className="testimonial-title">HR Director, Tech Startup (150 employees)</div>
                                <div className="testimonial-location">San Francisco, CA</div>
                            </div>
                        </div>
                        <div className="testimonial-card">
                            <div className="testimonial-quote">"The incident logging is intuitive and the reports are exactly what Cal/OSHA requires. Highly recommend for any California employer."</div>
                            <div className="testimonial-author">
                                <div className="testimonial-name">Michael T.</div>
                                <div className="testimonial-title">Operations Manager, Retail Chain</div>
                                <div className="testimonial-location">Los Angeles, CA</div>
                            </div>
                        </div>
                        <div className="testimonial-card">
                            <div className="testimonial-quote">"We manage 12 locations across California. CompCleared keeps us compliant at every single one."</div>
                            <div className="testimonial-author">
                                <div className="testimonial-name">Jennifer L.</div>
                                <div className="testimonial-title">VP of People, Healthcare Network</div>
                                <div className="testimonial-location">San Diego, CA</div>
                            </div>
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

            {/* Compliance Footer */}
            <section className="compliance-footer">
                <div className="compliance-content">
                    <img src="/california-badge.png" alt="SB 553 Compliant" className="compliance-badge-small" />
                    <div className="compliance-text">
                        <strong>Built specifically for California SB 553 compliance.</strong>
                        <p>CompCleared is designed by workplace safety experts to help California employers meet all requirements of Senate Bill 553, the Workplace Violence Prevention Act effective July 1, 2024.</p>
                    </div>
                </div>
            </section>

            {/* Support/Floating Action Button */}
            <div className="support-fab" onClick={() => window.location.href = 'mailto:support@compcleared.com'}>
                <HelpCircle size={24} color="white" />
                <span>Expert Support</span>
            </div>

            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <Logo size="small" type="white" />
                        <p>SB 553 Workplace Violence Compliance</p>
                    </div>
                    <div className="footer-links">
                        <a href="mailto:support@compcleared.com" className="footer-link">
                            <Mail size={16} /> Contact Support
                        </a>
                        <p>&copy; 2026 CompCleared. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;
