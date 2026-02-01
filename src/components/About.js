import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import './LandingPage.css'; // Reusing landing page styles for consistency

const About = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-page" style={{ backgroundColor: '#fff' }}>
            <nav className="landing-nav">
                <div className="nav-content">
                    <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        <Logo size="small" />
                    </div>
                    <div className="nav-buttons">
                        <button className="btn-secondary" onClick={() => navigate('/login')}>Log In</button>
                        <button className="btn-primary" onClick={() => navigate('/signup')}>Get Started</button>
                    </div>
                </div>
            </nav>

            <div style={{ maxWidth: '800px', margin: '80px auto', padding: '0 20px', fontFamily: "'Inter', sans-serif" }}>
                <h1 style={{ fontSize: '42px', fontWeight: '800', color: '#0f172a', marginBottom: '20px', textAlign: 'center' }}>
                    Securing California's Workforces
                </h1>
                <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#475569', textAlign: 'center', marginBottom: '60px' }}>
                    CompCleared provides enterprise-grade compliance infrastructure for Senate Bill 553.
                </p>

                <section style={{ marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '15px' }}>Our Mission</h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#334155' }}>
                        Founded by workplace safety experts and legal compliance technologists, CompCleared is dedicated to simplifying the complex regulatory landscape of California's workplace violence prevention laws. We believe that compliance should not be a burden, but a byproduct of a safer, more transparent work environment.
                    </p>
                </section>

                <section style={{ marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '15px' }}>Enterprise Standards</h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#334155', marginBottom: '20px' }}>
                        We operate with a "Compliance First" architecture. Our platform is built to meet the rigorous standards of Cal/OSHA, ensuring that every incident log, training record, and generated report withstands regulatory scrutiny.
                    </p>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px', color: '#334155' }}>
                        <li style={{ marginBottom: '10px' }}>SOC 2 Type II Ready Infrastructure</li>
                        <li style={{ marginBottom: '10px' }}>AES-256 Data Encryption at Rest and in Transit</li>
                        <li style={{ marginBottom: '10px' }}>Double-Lock Audit Trails for immutable record keeping</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '60px', backgroundColor: '#f8fafc', padding: '40px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '15px' }}>Leadership</h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#334155' }}>
                        Our leadership team comprises veterans from the security, legal, and enterprise software industries, united by a commitment to regulatory excellence and data privacy.
                    </p>
                </section>
            </div>

            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <Logo size="small" type="white" />
                        <p>SB 553 Workplace Violence Compliance</p>
                    </div>
                    <div className="footer-links">
                        <p>&copy; 2026 CompCleared. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default About;
