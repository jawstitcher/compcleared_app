import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { Check, X } from 'lucide-react';
import './LandingPage.css';

const PricingPage = () => {
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

            <div style={{ maxWidth: '1100px', margin: '60px auto', padding: '0 20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h1 style={{ fontSize: '44px', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>
                        Simple pricing. No surprises.
                    </h1>
                    <p style={{ fontSize: '18px', color: '#475569', maxWidth: '640px', margin: '0 auto' }}>
                        Start free. Upgrade when you need the full platform.
                        Cheaper than one hour with a compliance attorney.
                    </p>
                    <p style={{ fontSize: '14px', color: '#64748B', marginTop: '20px', fontStyle: 'italic' }}>
                        For context: a single Cal/OSHA SB 553 citation starts at <strong style={{ color: '#0f172a' }}>$18,000</strong>.
                        A compliance attorney charges <strong style={{ color: '#0f172a' }}>$300-500/hour</strong>.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                    {/* Free tier */}
                    <div style={{
                        background: '#fff',
                        border: '1px solid #E2E8F0',
                        borderRadius: '12px',
                        padding: '40px 32px',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Free</h3>
                        <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px' }}>
                            For employers who just want to understand the law
                        </p>
                        <div style={{ marginBottom: '24px' }}>
                            <span style={{ fontSize: '48px', fontWeight: '800', color: '#0f172a' }}>$0</span>
                        </div>
                        <button
                            onClick={() => navigate('/exposure-check')}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: '#fff',
                                color: '#2563EB',
                                border: '2px solid #2563EB',
                                borderRadius: '8px',
                                fontSize: '15px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                marginBottom: '24px'
                            }}
                        >
                            Take the Free Check
                        </button>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                'Free SB 553 exposure screening (5 questions)',
                                'Read the SB 553 reference guide',
                                'Download the Cal/OSHA model WVPP template',
                                'No account required'
                            ].map((f, i) => (
                                <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '15px', color: '#334155' }}>
                                    <Check size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Pro tier */}
                    <div style={{
                        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                        border: '2px solid #F97316',
                        borderRadius: '12px',
                        padding: '40px 32px',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        color: '#fff'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '-12px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: '#F97316',
                            color: '#fff',
                            padding: '4px 14px',
                            borderRadius: '999px',
                            fontSize: '12px',
                            fontWeight: '700',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase'
                        }}>
                            Most Popular
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Pro</h3>
                        <p style={{ fontSize: '14px', color: '#CBD5E1', marginBottom: '24px' }}>
                            For California employers who need to actually comply
                        </p>
                        <div style={{ marginBottom: '8px' }}>
                            <span style={{ fontSize: '48px', fontWeight: '800' }}>$9</span>
                            <span style={{ fontSize: '18px', color: '#CBD5E1' }}> /month</span>
                        </div>
                        <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '24px' }}>
                            or <strong style={{ color: '#fff' }}>$79/year</strong> (save $29)
                        </p>
                        <button
                            onClick={() => navigate('/signup')}
                            className="btn-cta"
                            style={{ width: '100%', marginBottom: '24px' }}
                        >
                            Start 14-Day Free Trial
                        </button>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                'Everything in Free, plus:',
                                'Customized WVPP generator (PDF, all 6 sections)',
                                'Violent Incident Log (digital, all 14 fields)',
                                'Training tracker (annual, initial, post-incident, new-hazard)',
                                'Audit-ready PDF export (one click)',
                                'Email alerts on Cal/OSHA regulatory changes',
                                '5-year retention of all records',
                                '14-day money-back guarantee',
                            ].map((f, i) => (
                                <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '15px', color: i === 0 ? '#CBD5E1' : '#fff' }}>
                                    {i === 0 ? (
                                        <span style={{ width: '18px', flexShrink: 0 }} />
                                    ) : (
                                        <Check size={18} color="#F97316" style={{ flexShrink: 0, marginTop: '2px' }} />
                                    )}
                                    <span style={{ fontWeight: i === 0 ? '600' : '400' }}>{f}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Comparison footer */}
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
                    <p style={{ fontSize: '15px', color: '#334155', marginBottom: '8px' }}>
                        <strong>For larger organizations (200+ employees, multi-state, custom integrations):</strong>
                    </p>
                    <p style={{ fontSize: '15px', color: '#475569', marginBottom: '16px' }}>
                        Email <a href="mailto:support@compcleared.com" style={{ color: '#2563EB' }}>support@compcleared.com</a> — we'll
                        figure out if we can help, and if not, we'll point you to someone who can.
                    </p>
                    <p style={{ fontSize: '13px', color: '#64748B' }}>
                        All plans include: encrypted data in transit and at rest · CCPA/CPRA-compliant data handling ·
                        one-click cancellation · no hidden fees.
                    </p>
                </div>

                {/* FAQ mini-section */}
                <div style={{ marginTop: '60px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '24px', textAlign: 'center' }}>
                        Pricing questions
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        {[
                            { q: 'Can I cancel anytime?', a: 'Yes. One click in your account settings, no retention games, no "are you sure" loops. Cancellation is effective immediately.' },
                            { q: 'Do you charge sales tax?', a: 'No, not in California. SaaS is not currently taxed in CA. We will add tax collection if/when the law changes in 2027.' },
                            { q: 'What happens to my data if I cancel?', a: 'You can export everything as PDF before canceling. We retain your records for 30 days after cancellation in case you change your mind, then they are permanently deleted.' },
                            { q: 'Is there a free trial?', a: 'Yes — 14 days, no credit card required. If you decide not to continue, your account simply stops working. No charges, no awkward emails.' },
                        ].map((item, i) => (
                            <div key={i} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px' }}>
                                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>{item.q}</h3>
                                <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: 0 }}>{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-links">
                        <a href="/privacy" className="footer-link">Privacy</a>
                        <a href="/terms" className="footer-link">Terms</a>
                        <a href="/about" className="footer-link">About</a>
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

export default PricingPage;
