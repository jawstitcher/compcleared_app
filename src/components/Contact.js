import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import './LandingPage.css';

const Contact = () => {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

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

            <div style={{ maxWidth: '600px', margin: '80px auto', padding: '0 20px', fontFamily: "'Inter', sans-serif" }}>
                <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a', marginBottom: '20px', textAlign: 'center' }}>
                    Contact Support
                </h1>
                <p style={{ fontSize: '16px', color: '#64748b', textAlign: 'center', marginBottom: '40px' }}>
                    Our California-based compliance team is available Mon-Fri, 9am - 5pm PT.
                </p>

                {submitted ? (
                    <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #10b981', borderRadius: '8px', padding: '30px', textAlign: 'center' }}>
                        <h3 style={{ color: '#047857', marginBottom: '10px' }}>Message Received</h3>
                        <p style={{ color: '#065f46' }}>Thank you for contacting CompCleared Enterprise Support. A compliance specialist will respond to your inquiry within 24 hours.</p>
                        <button
                            onClick={() => navigate('/')}
                            style={{ marginTop: '20px', padding: '10px 20px', background: '#059669', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Return Home
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ border: '1px solid #e2e8f0', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#334155' }}>Work Email</label>
                            <input type="email" required style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#334155' }}>Subject</label>
                            <select style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                                <option>Technical Support</option>
                                <option>Sales Inquiry</option>
                                <option>Compliance Question (SB 553)</option>
                                <option>Partnership</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#334155' }}>Message</label>
                            <textarea required rows="5" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}></textarea>
                        </div>

                        <button type="submit" style={{ width: '100%', padding: '14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
                            Send Message
                        </button>
                    </form>
                )}

                <div style={{ textAlign: 'center', marginTop: '40px', color: '#94a3b8', fontSize: '14px' }}>
                    <p>CompCleared Inc. • San Francisco, CA</p>
                    <p>support@compcleared.com</p>
                </div>
            </div>
        </div>
    );
};

export default Contact;
