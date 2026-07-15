import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import './LandingPage.css';

const Contact = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('General Question');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const emailSubject = encodeURIComponent(subject);
        const emailBody = encodeURIComponent(`From: ${email}\n\n${message}`);
        window.location.href = `mailto:support@compcleared.com?subject=${emailSubject}&body=${emailBody}`;
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
                    Contact
                </h1>
                <p style={{ fontSize: '16px', color: '#64748b', textAlign: 'center', marginBottom: '40px' }}>
                    Email support@compcleared.com; we typically respond within 1–2 business days.
                </p>

                <form onSubmit={handleSubmit} style={{ border: '1px solid #e2e8f0', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <label htmlFor="contact-email" style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#334155' }}>Email</label>
                            <input id="contact-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label htmlFor="contact-subject" style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#334155' }}>Subject</label>
                            <select id="contact-subject" value={subject} onChange={(e) => setSubject(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                                <option>General Question</option>
                                <option>Technical Support</option>
                                <option>Billing Question</option>
                                <option>Compliance Question (SB 553)</option>
                                <option>Feature Request</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label htmlFor="contact-message" style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#334155' }}>Message</label>
                            <textarea id="contact-message" required rows="5" value={message} onChange={(e) => setMessage(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                        </div>

                        <button type="submit" style={{ width: '100%', padding: '14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
                            Send Message
                        </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '40px', color: '#94a3b8', fontSize: '14px' }}>
                    <p>CompCleared</p>
                    <p>support@compcleared.com</p>
                </div>
            </div>

            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-links">
                        <a href="/privacy" className="footer-link">Privacy</a>
                        <a href="/terms" className="footer-link">Terms</a>
                        <a href="/about" className="footer-link">About</a>
                        <p>&copy; 2026 CompCleared. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Contact;
