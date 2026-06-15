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
                    information from users of our website and service. We are committed to handling your information
                    transparently and in compliance with the California Consumer Privacy Act (CCPA/CPRA), the California
                    Online Privacy Protection Act (CalOPPA), and other applicable laws.
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
                    <li style={{ marginBottom: '8px' }}>Send service-related notifications (regulatory changes, account alerts, support responses)</li>
                    <li style={{ marginBottom: '8px' }}>Comply with legal obligations</li>
                </ul>
                <p style={{ marginBottom: '24px' }}><strong>We do not sell your personal information.</strong> We do not share it with third parties for their marketing purposes.</p>

                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>3. Data Storage and Security</h2>
                <p style={{ marginBottom: '24px' }}>
                    Service data is stored on encrypted database servers. Data is encrypted in transit (TLS) and at rest.
                    We retain service data for the duration of your subscription plus 30 days after cancellation,
                    unless a longer retention period is required by law (SB 553 requires incident log retention for 5 years).
                </p>

                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>4. Your Rights (California Residents)</h2>
                <p style={{ marginBottom: '16px' }}>Under CCPA/CPRA, you have the right to:</p>
                <ul style={{ paddingLeft: '24px', marginBottom: '24px' }}>
                    <li style={{ marginBottom: '8px' }}>Know what personal information we collect and how we use it</li>
                    <li style={{ marginBottom: '8px' }}>Request deletion of your personal information</li>
                    <li style={{ marginBottom: '8px' }}>Correct inaccurate personal information</li>
                    <li style={{ marginBottom: '8px' }}>Opt out of the sale or sharing of personal information (we do not sell or share)</li>
                    <li style={{ marginBottom: '8px' }}>Limit the use of sensitive personal information</li>
                </ul>
                <p style={{ marginBottom: '24px' }}>
                    To exercise these rights, email{' '}
                    <a href="mailto:[email protected]" style={{ color: '#2563EB' }}>[email protected]</a>.
                    We will respond within 45 days as required by California law.
                </p>
                <p style={{ marginBottom: '24px' }}>
                    We honor Global Privacy Control (GPC) signals from your browser.
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
                    We may update this policy from time to time. Material changes will be announced via email and
                    on this page. The "Effective Date" at the top reflects the most recent update.
                </p>

                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>8. Contact</h2>
                <p style={{ marginBottom: '24px' }}>
                    Questions about this policy? Email{' '}
                    <a href="mailto:[email protected]" style={{ color: '#2563EB' }}>[email protected]</a>.
                </p>

                <div style={{ marginTop: '40px', padding: '20px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', color: '#64748B' }}>
                    <strong>Note:</strong> This is a placeholder privacy policy suitable for early-stage launch. It should
                    be reviewed by a California-licensed attorney before you begin collecting personal information
                    from California residents for any commercial purpose. Services like TermsFeed or Termly can
                    generate a more comprehensive version for ~$200.
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
