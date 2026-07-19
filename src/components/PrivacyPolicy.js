import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import './LandingPage.css';

const PrivacyPolicy = () => {
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
                    </div>
                </div>
            </nav>
            <div style={{ maxWidth: '800px', margin: '60px auto', padding: '0 20px', fontFamily: "'Inter', sans-serif", color: '#334155', lineHeight: '1.7' }}>
                <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>Privacy Policy</h1>
                <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '32px' }}>Effective Date: June 14, 2026 · Last Updated: June 14, 2026</p>

                <p style={{ marginBottom: '24px' }}>
                    This Privacy Policy describes how CompCleared ("we," "us," or "our") collects, uses, and protects
                    information from users of our website and service.
                </p>

                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>1. Information We Collect</h2>
                <p style={{ marginBottom: '16px' }}>We collect the following categories of information:</p>
                <ul style={{ paddingLeft: '24px', marginBottom: '24px' }}>
                    <li style={{ marginBottom: '8px' }}><strong>Account information:</strong> name, email address, business name, employee count</li>
                    <li style={{ marginBottom: '8px' }}><strong>Billing information:</strong> payment card details are processed by Stripe; we do not store full card numbers on our servers</li>
                    <li style={{ marginBottom: '8px' }}><strong>Service data:</strong> workplace violence incident records, training records, generated plans and reports</li>
                    <li style={{ marginBottom: '8px' }}><strong>Usage data:</strong> pages visited, features used, basic device and browser information</li>
                </ul>

                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>2. How We Use Information</h2>
                <p style={{ marginBottom: '16px' }}>We use the information we collect to:</p>
                <ul style={{ paddingLeft: '24px', marginBottom: '24px' }}>
                    <li style={{ marginBottom: '8px' }}>Provide, maintain, and improve the CompCleared service</li>
                    <li style={{ marginBottom: '8px' }}>Process subscription payments</li>
                    <li style={{ marginBottom: '8px' }}>Respond to support requests</li>
                    <li style={{ marginBottom: '8px' }}>Comply with legal obligations</li>
                </ul>
                <p style={{ marginBottom: '24px' }}><strong>We do not sell your personal information.</strong> We do not share it with third parties for their marketing purposes.</p>

                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>3. Data Storage and Security</h2>
                <p style={{ marginBottom: '24px' }}>
                    We store service data to provide the CompCleared service. For questions or requests about your data,
                    email <a href="mailto:support@compcleared.com" style={{ color: '#2563EB' }}>support@compcleared.com</a>.
                </p>

                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>4. Data Requests</h2>
                <p style={{ marginBottom: '24px' }}>
                    To make a request about your personal information, email{' '}
                    <a href="mailto:support@compcleared.com" style={{ color: '#2563EB' }}>support@compcleared.com</a>.
                </p>

                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>5. HIPAA and Protected Health Information</h2>
                <p style={{ marginBottom: '24px' }}>
                    CompCleared is not a HIPAA-covered entity. Our Terms of Service prohibit using the service to
                    store Protected Health Information (PHI). We do not offer Business Associate Agreements (BAAs).
                </p>

                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>6. Children</h2>
                <p style={{ marginBottom: '24px' }}>
                    CompCleared is a B2B service not directed at children under 13. We do not knowingly collect
                    information from children under 13.
                </p>

                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>7. Changes to This Policy</h2>
                <p style={{ marginBottom: '24px' }}>
                    We may update this policy from time to time. Material updates will be posted on this page. The
                    "Effective Date" at the top reflects the most recent update.
                </p>

                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>8. Contact</h2>
                <p style={{ marginBottom: '24px' }}>
                    Questions about this policy? Email{' '}
                    <a href="mailto:support@compcleared.com" style={{ color: '#2563EB' }}>support@compcleared.com</a>.
                </p>

                {/* Internal launch note: keep privacy language under attorney review as the business matures. */}
            </div>
        </div>
    );
};

export default PrivacyPolicy;
