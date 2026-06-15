import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import './LandingPage.css';

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
                    About CompCleared
                </h1>
                <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#475569', textAlign: 'center', marginBottom: '60px' }}>
                    CompCleared is a small, California-based tool that helps small businesses meet the
                    recordkeeping requirements of Senate Bill 553 — the California Workplace Violence Prevention Act.
                </p>

                <section style={{ marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '15px' }}>Who we built it for</h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#334155' }}>
                        Restaurant owners, retail managers, salon and gym operators, small office administrators,
                        healthcare practice managers — the kind of California businesses that have 5 to 200 employees
                        and don't have a dedicated HR or legal team. The compliance tools that exist for big companies
                        (NAVEX, CalChamber's HR suite, Mineral) cost hundreds to thousands per year and assume
                        someone on staff knows what they're doing. CompCleared is the alternative: cheap, simple,
                        and built for people who would rather fill out a form than read a 60-page regulation.
                    </p>
                </section>

                <section style={{ marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '15px' }}>What we actually do</h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#334155', marginBottom: '16px' }}>
                        CompCleared helps you:
                    </p>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '24px', color: '#334155', lineHeight: '1.8' }}>
                        <li style={{ marginBottom: '8px' }}>Generate a written Workplace Violence Prevention Plan (WVPP) with the six sections SB 553 requires</li>
                        <li style={{ marginBottom: '8px' }}>Log workplace violence incidents with all 14 fields Cal/OSHA requires</li>
                        <li style={{ marginBottom: '8px' }}>Track employee training completion (annual, initial, post-incident, new-hazard)</li>
                        <li style={{ marginBottom: '8px' }}>Export a Cal/OSHA-formatted PDF audit bundle when you need it</li>
                        <li style={{ marginBottom: '8px' }}>Get notified when Cal/OSHA's permanent standard (due Dec 31, 2026) changes the rules</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '15px' }}>What we don't do</h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#334155', marginBottom: '16px' }}>
                        We're honest about the limits:
                    </p>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '24px', color: '#334155', lineHeight: '1.8' }}>
                        <li style={{ marginBottom: '8px' }}>We are not a law firm and do not provide legal advice</li>
                        <li style={{ marginBottom: '8px' }}>We do not file anything with Cal/OSHA on your behalf</li>
                        <li style={{ marginBottom: '8px' }}>We do not replace HR, safety, or legal counsel</li>
                        <li style={{ marginBottom: '8px' }}>Templates are starting points — consult a California-licensed employment attorney before relying on any generated document</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '60px', backgroundColor: '#f8fafc', padding: '40px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '15px' }}>Who's behind it</h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#334155' }}>
                        CompCleared is built and run by a small California team. We're not a venture-backed startup.
                        We don't have a sales team. The product is the product, and if you email us, you get a real
                        person. Questions, complaints, feature requests — all welcome at{' '}
                        <a href="mailto:support@compcleared.com" style={{ color: '#2563EB' }}>support@compcleared.com</a>.
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
                        <a href="/privacy" className="footer-link">Privacy</a>
                        <a href="/terms" className="footer-link">Terms</a>
                        <a href="/contact" className="footer-link">Contact</a>
                        <p className="footer-disclaimer">
                            CompCleared provides compliance tools and templates for informational purposes only and
                            does not constitute legal advice. Not a substitute for counsel.
                        </p>
                        <p>&copy; 2026 CompCleared. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default About;
