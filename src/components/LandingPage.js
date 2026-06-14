import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { ShieldCheck, Lock, CheckCircle, ClipboardList, BarChart3, Users, Smartphone, Zap, HelpCircle, Mail } from 'lucide-react';
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
                    <span className="trust-item"><ShieldCheck size={16} /> Cal/OSHA SB 553 Ready</span>
                    <span className="trust-item"><Lock size={16} /> Encrypted Records</span>
                    <span className="trust-item"><CheckCircle size={16} /> 5-Year Retention</span>
                </div>
            </div>

            <section className="hero">
                <div className="hero-content">
                    <div className="hero-badge-container">
                        <img src="/california-badge.png" alt="SB 553 Compliant - Cal/OSHA Ready" className="hero-badge" />
                    </div>
                    <h1>California SB 553 Workplace Violence Compliance Made Simple</h1>
                    <p className="hero-subtitle">
                        Track incidents, generate compliant reports, and protect your workforce with <span style={{ color: '#ffffff', fontWeight: 'bold' }}>Comp</span><span style={{ color: '#38bdf8', fontWeight: 'bold' }}>Cleared</span>'s comprehensive workplace safety platform.

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

            {/* How It Works */}
            <section className="stats-section">
                <div className="stats-container">
                    <div className="stat-item">
                        <div className="stat-number">1</div>
                        <div className="stat-label">Tell us about your business</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">2</div>
                        <div className="stat-label">Log incidents &amp; training in minutes</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">3</div>
                        <div className="stat-label">Export audit-ready PDF anytime</div>
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

            {/* Founding Customers */}
            <section className="testimonials-section">
                <div className="testimonials-container">
                    <h2>Be Our First Case Study</h2>
                    <p className="testimonials-subtitle">
                        We're looking for 10 California small businesses to lock in lifetime pricing of $79/year
                        in exchange for honest feedback and a public case study. Help us build the right tool — and
                        never see a price increase.
                    </p>
                    <button className="btn-cta" onClick={() => navigate('/signup')}>
                        Apply for Founding Pricing
                    </button>
                </div>
            </section>

            <section className="pricing-preview">
                <div className="pricing-content">
                    <h2>Simple, Transparent Pricing</h2>
                    <p>Free to start. Paid plans from $9/month or $79/year. Cancel anytime.</p>
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
                        <p>CompCleared helps California employers meet the recordkeeping requirements of Senate Bill 553, the Workplace Violence Prevention Act effective July 1, 2024. Templates reflect best practices as of the date shown above; consult a licensed California employment attorney before relying on any generated document.</p>
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
                        <p className="footer-disclaimer">
                            CompCleared provides compliance tools and templates for informational purposes only and
                            does not constitute legal advice. Use of this service does not create an attorney-client
                            relationship. Consult a California-licensed employment attorney before relying on any
                            generated document. Not a substitute for counsel.
                        </p>
                        <p>&copy; 2026 CompCleared. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;
