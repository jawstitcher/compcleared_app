import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import Footer from './Footer';
import { ShieldCheck, ClipboardList, BarChart3, AlertTriangle, Lock } from 'lucide-react';
import FAQ from './FAQ';
import './LandingPage.css';

const MODULES = [
    {
        name: 'SB 553 Workplace Violence Prevention',
        status: 'active',
        description: 'Written WVPP, digital incident log, training tracker, audit-ready PDF.',
        icon: ShieldCheck
    },
    {
        name: 'OSHA 300 / 300A Injury Logs',
        status: 'coming-soon',
        description: 'Extend your incident log to cover all workplace injuries. Auto-fill your end-of-year Cal/OSHA Form 300.',
        icon: ClipboardList
    },
    {
        name: 'California Employee Handbook Generator',
        status: 'coming-soon',
        description: 'Generate a customized, California-compliant employee handbook. Updates when labor laws change.',
        icon: BarChart3
    }
];

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

            <section className="hero" style={{ textAlign: 'center', padding: '80px 20px 40px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <ShieldCheck size={56} color="#10B981" strokeWidth={2.5} />
                    <span style={{ fontSize: '32px', fontWeight: '800', color: '#10B981' }}>✓</span>
                </div>
                <h1 style={{ fontSize: '64px', fontWeight: '800', color: '#0f172a', lineHeight: 1.1, marginBottom: '20px' }}>
                    Complete Compliance.<br />Cleared. <span style={{ color: '#10B981' }}>✓</span>
                </h1>
                <p style={{ fontSize: '20px', lineHeight: 1.5, color: '#475569', maxWidth: '720px', margin: '0 auto 40px' }}>
                    The all-in-one HR compliance platform for California small businesses.
                    Protect your team and check every Cal/OSHA box with one seamless dashboard.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button className="btn-primary" onClick={() => navigate('/signup')} style={{ fontSize: '18px', padding: '14px 32px' }}>
                        Start for $19/month →
                    </button>
                    <button className="btn-secondary" onClick={() => navigate('/exposure-check')} style={{ fontSize: '18px', padding: '14px 32px' }}>
                        Check SB 553 Requirements
                    </button>
                </div>
                <p style={{ fontSize: '14px', color: '#64748b', marginTop: '16px' }}>
                    ✓ 14-day money-back guarantee &nbsp;·&nbsp; ✓ Free SB 553 applicability check &nbsp;·&nbsp; ✓ Cancel anytime
                </p>
            </section>

            <section style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '24px 32px', maxWidth: '800px', margin: '0 auto 60px', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                    <AlertTriangle size={20} color="#dc2626" />
                    <strong style={{ color: '#991b1b', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        The deadline is real
                    </strong>
                </div>
                <p style={{ fontSize: '16px', color: '#7f1d1d', margin: 0 }}>
                    Cal/OSHA citations for SB 553 violations start at <strong>$18,000</strong> and can reach <strong>$150,000</strong> for willful or repeat violations. Criminal penalties are possible. CompCleared starts at <strong>$19/month</strong>.
                </p>
            </section>

            <section style={{ maxWidth: '1100px', margin: '0 auto 80px', padding: '0 20px' }}>
                <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a', textAlign: 'center', marginBottom: '12px' }}>
                    One platform. Every California HR compliance box.
                </h2>
                <p style={{ fontSize: '16px', color: '#64748b', textAlign: 'center', marginBottom: '48px' }}>
                    Start with SB 553 today. OSHA 300 and Employee Handbooks ship next.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    {MODULES.map((mod) => {
                        const Icon = mod.icon;
                        const isActive = mod.status === 'active';
                        return (
                            <div key={mod.name} style={{
                                background: '#fff',
                                border: isActive ? '2px solid #10B981' : '1px solid #e2e8f0',
                                borderRadius: '12px',
                                padding: '28px',
                                position: 'relative',
                                opacity: isActive ? 1 : 0.85
                            }}>
                                {!isActive && (
                                    <div style={{
                                        position: 'absolute', top: '16px', right: '16px',
                                        background: '#fef3c7', color: '#92400e',
                                        fontSize: '11px', fontWeight: '700',
                                        padding: '4px 10px', borderRadius: '12px',
                                        textTransform: 'uppercase', letterSpacing: '0.5px',
                                        display: 'flex', alignItems: 'center', gap: '4px'
                                    }}>
                                        <Lock size={11} /> Coming Q3 2026
                                    </div>
                                )}
                                {isActive && (
                                    <div style={{
                                        position: 'absolute', top: '16px', right: '16px',
                                        background: '#d1fae5', color: '#065f46',
                                        fontSize: '11px', fontWeight: '700',
                                        padding: '4px 10px', borderRadius: '12px',
                                        textTransform: 'uppercase', letterSpacing: '0.5px'
                                    }}>
                                        ✓ Active Now
                                    </div>
                                )}
                                <Icon size={32} color={isActive ? '#10B981' : '#94a3b8'} style={{ marginBottom: '12px' }} />
                                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
                                    {mod.name}
                                </h3>
                                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                                    {mod.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section style={{ maxWidth: '900px', margin: '0 auto 80px', padding: '0 20px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', marginBottom: '40px' }}>
                    From SB 553 uncertainty to audit-ready records in 3 steps
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
                    {[
                        { num: '1', title: 'Answer 5 questions about your business', time: '60 seconds' },
                        { num: '2', title: 'Log incidents & training as they happen', time: '2 minutes per entry' },
                        { num: '3', title: 'Export your audit-ready PDF in one click', time: '30 seconds' }
                    ].map((step) => (
                        <div key={step.num} style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px' }}>
                            <div style={{ fontSize: '36px', fontWeight: '800', color: '#10B981', marginBottom: '8px' }}>
                                {step.num}
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
                                {step.title}
                            </h3>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{step.time}</p>
                        </div>
                    ))}
                </div>
            </section>

            <FAQ />

            <Footer />
        </div>
    );
}

export default LandingPage;
