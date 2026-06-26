import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { Shield, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import '../components/LandingPage.css';

const QUESTIONS = [
    {
        id: 'ca_employer',
        q: 'Are you a California-based employer?',
        help: 'Including remote employees physically working in California.'
    },
    {
        id: 'employee_count',
        q: 'Do you have 10 or more employees (including part-time and seasonal)?',
        help: 'SB 553 has limited exemptions for very small teams.'
    },
    {
        id: 'public_access',
        q: 'Is your workplace accessible to the public (retail floor, reception, restaurant dining, etc.)?',
        help: 'Even offices that occasionally have visitors may count.'
    },
    {
        id: 'has_wvpp',
        q: 'Have you written a Workplace Violence Prevention Plan?',
        help: 'A written plan is required. The free Cal/OSHA template counts if customized for your site.'
    },
    {
        id: 'annual_training',
        q: 'Have you trained all employees on workplace violence prevention in the past 12 months?',
        help: 'Annual training is required for every employee.'
    }
];

const RESULTS = {
    low: {
        title: 'Likely Exempt — but document everything',
        color: '#10B981',
        icon: CheckCircle,
        summary: 'Based on your answers, you may be in one of the limited SB 553 exemption categories (under 10 employees with no public access, certain healthcare facilities, etc.).',
        next: [
            'Document your exempt status in writing — keep it with your HR records',
            'Re-evaluate annually as your business grows',
            'Even exempt employers benefit from a basic plan — it protects you from civil liability',
        ]
    },
    medium: {
        title: 'At Risk — Plan Needed',
        color: '#F59E0B',
        icon: AlertTriangle,
        summary: 'Based on your answers, SB 553 likely applies to your business. You probably need a written Workplace Violence Prevention Plan and annual training records.',
        next: [
            'Write or generate a customized WVPP for your specific workplace',
            'Train all current employees on the plan within 30 days',
            'Set up annual training reminders for next year',
            'Keep records of all training for at least 1 year',
        ]
    },
    high: {
        title: 'Likely Non-Compliant — Act Now',
        color: '#EF4444',
        icon: AlertTriangle,
        summary: 'Based on your answers, SB 553 almost certainly applies to your business and you may be out of compliance. Cal/OSHA penalties start at $18,000 per serious violation.',
        next: [
            'Write a Workplace Violence Prevention Plan this week — not next quarter',
            'Train all employees and document it (date, attendees, topics)',
            'Set up a violent incident log before you need one',
            'Consult a California employment attorney for a 30-minute review ($300-500)',
        ]
    }
};

const scoreResult = (answers) => {
    // Higher score = more non-compliant. Inverted from "how many yeses" because "have you written a plan" being "no" is bad.
    let score = 0;
    if (answers.ca_employer === 'yes') score += 1;
    if (answers.employee_count === 'yes') score += 1;
    if (answers.public_access === 'yes') score += 1;
    if (answers.has_wvpp === 'no') score += 1;
    if (answers.annual_training === 'no') score += 1;
    if (score <= 1) return 'low';
    if (score <= 3) return 'medium';
    return 'high';
};

const ExposureCheck = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [email, setEmail] = useState('');

    const handleAnswer = (id, value) => {
        const next = { ...answers, [id]: value };
        setAnswers(next);
        if (step < QUESTIONS.length - 1) {
            setStep(step + 1);
        } else {
            setResult(scoreResult(next));
        }
    };

    const reset = () => {
        setStep(0);
        setAnswers({});
        setResult(null);
        setEmail('');
    };

    return (
        <div className="landing-page" style={{ backgroundColor: '#F8FAFC' }}>
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

            <div style={{ maxWidth: '700px', margin: '60px auto', padding: '0 20px' }}>
                {!result ? (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#EFF6FF', color: '#2563EB', padding: '6px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: '600', marginBottom: '16px' }}>
                                <Shield size={14} /> Free · 60 seconds · No signup
                            </div>
                            <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
                                Is SB 553 a problem for your business?
                            </h1>
                            <p style={{ fontSize: '17px', color: '#475569' }}>
                                Answer {QUESTIONS.length} questions. Find out if California's workplace violence
                                prevention law applies to you — and what to do if it does.
                            </p>
                        </div>

                        {/* Progress bar */}
                        <div style={{ background: '#E2E8F0', height: '6px', borderRadius: '3px', marginBottom: '32px', overflow: 'hidden' }}>
                            <div style={{
                                background: '#2563EB',
                                height: '100%',
                                width: `${((step + 1) / QUESTIONS.length) * 100}%`,
                                transition: 'width 0.3s ease'
                            }} />
                        </div>

                        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '40px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#64748B', marginBottom: '8px' }}>
                                Question {step + 1} of {QUESTIONS.length}
                            </div>
                            <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginBottom: '12px', lineHeight: '1.4' }}>
                                {QUESTIONS[step].q}
                            </h2>
                            <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '32px' }}>
                                {QUESTIONS[step].help}
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <button
                                    onClick={() => handleAnswer(QUESTIONS[step].id, 'yes')}
                                    style={{
                                        padding: '20px',
                                        background: '#fff',
                                        border: '2px solid #2563EB',
                                        borderRadius: '8px',
                                        color: '#2563EB',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        fontFamily: 'inherit',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = '#EFF6FF'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => handleAnswer(QUESTIONS[step].id, 'no')}
                                    style={{
                                        padding: '20px',
                                        background: '#fff',
                                        border: '2px solid #CBD5E1',
                                        borderRadius: '8px',
                                        color: '#475569',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        fontFamily: 'inherit',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = '#F1F5F9'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {(() => {
                            const ResultIcon = RESULTS[result].icon;
                            return (
                                <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '40px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                                        <div style={{
                                            background: RESULTS[result].color,
                                            borderRadius: '50%',
                                            width: '56px',
                                            height: '56px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <ResultIcon size={28} color="#fff" />
                                        </div>
                                        <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a' }}>
                                            {RESULTS[result].title}
                                        </h2>
                                    </div>
                                    <p style={{ fontSize: '17px', color: '#334155', lineHeight: '1.7', marginBottom: '24px' }}>
                                        {RESULTS[result].summary}
                                    </p>
                                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        What to do next
                                    </h3>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        {RESULTS[result].next.map((action, i) => (
                                            <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '12px', color: '#334155', lineHeight: '1.6' }}>
                                                <ArrowRight size={18} color={RESULTS[result].color} style={{ flexShrink: 0, marginTop: '3px' }} />
                                                <span>{action}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })()}

                        <div style={{ background: '#fff', border: '2px solid #2563EB', borderRadius: '12px', padding: '32px', marginTop: '24px', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
                                Want a customized plan in 20 minutes?
                            </h3>
                            <p style={{ fontSize: '15px', color: '#475569', marginBottom: '20px' }}>
                                CompCleared generates a Cal/OSHA-aligned Workplace Violence Prevention Plan tailored to your business. Free to start.
                            </p>
                            <button
                                onClick={() => navigate('/signup')}
                                className="btn-cta"
                                style={{ marginRight: '12px' }}
                            >
                                Get Started Free
                            </button>
                            <button
                                onClick={reset}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid #CBD5E1',
                                    color: '#475569',
                                    padding: '14px 24px',
                                    borderRadius: '8px',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit'
                                }}
                            >
                                Retake the Check
                            </button>
                        </div>
                    </>
                )}
            </div>

            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-links">
                        <a href="/privacy" className="footer-link">Privacy</a>
                        <a href="/terms" className="footer-link">Terms</a>
                        <a href="/about" className="footer-link">About</a>
                        <p className="footer-disclaimer">
                            This is a screening tool, not legal advice. For complex situations, consult a
                            California-licensed employment attorney.
                        </p>
                        <p>&copy; 2026 CompCleared. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ExposureCheck;
