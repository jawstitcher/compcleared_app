import React from 'react';
import Logo from './Logo';

const Footer = () => {
    return (
        <footer style={{
            backgroundColor: '#0f172a',
            color: '#cbd5e1',
            padding: '60px 20px 30px',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '40px',
                    marginBottom: '40px'
                }}>
                    <div>
                        <Logo size="small" type="white" />
                        <p style={{ marginTop: '12px', fontSize: '20px', fontWeight: '700', color: '#fff' }}>
                            ✓ Complete Compliance. Cleared.
                        </p>
                        <p style={{ marginTop: '8px', fontSize: '14px', lineHeight: 1.5 }}>
                            The all-in-one HR compliance platform for California small businesses.
                        </p>
                    </div>

                    <div>
                        <h4 style={{ color: '#fff', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>
                            Product
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 2 }}>
                            <li><a href="/exposure-check" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px' }}>SB 553 Applicability Check</a></li>
                            <li><a href="/pricing" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px' }}>Pricing</a></li>
                            <li><a href="/signup" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px' }}>Get Started</a></li>
                            <li><a href="/resources" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px' }}>Resources</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ color: '#fff', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>
                            Company
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 2 }}>
                            <li><a href="/about" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px' }}>About</a></li>
                            <li><a href="/contact" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px' }}>Contact</a></li>
                            <li><a href="mailto:support@compcleared.com" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px' }}>support@compcleared.com</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ color: '#fff', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>
                            Legal
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 2 }}>
                            <li><a href="/privacy" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px' }}>Privacy Policy</a></li>
                            <li><a href="/terms" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px' }}>Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div style={{
                    borderTop: '1px solid #1e293b',
                    paddingTop: '24px',
                    fontSize: '12px',
                    color: '#94a3b8',
                    lineHeight: 1.6
                }}>
                    <p style={{ marginBottom: '12px' }}>
                        <strong style={{ color: '#cbd5e1' }}>Not Legal Advice.</strong> CompCleared provides compliance tools and templates for informational purposes only.
                        Use of this service does not create an attorney-client relationship. CompCleared is not a law firm. Templates reflect best practices
                        as of the date generated; consult a California-licensed employment attorney before relying on any generated document.
                    </p>
                    <p style={{ margin: 0 }}>
                        &copy; 2026 CompCleared. All rights reserved. &nbsp;·&nbsp;
                        <a href="/about" style={{ color: '#94a3b8' }}>A California small business</a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
