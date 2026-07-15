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
        description: 'Plan template, digital incident log, training tracker, and available PDF exports.',
        icon: ShieldCheck
    },
    {
        name: 'OSHA 300 / 300A Injury Logs',
        status: 'coming-soon',
        description: 'Planned injury-log tools for organizing workplace injury records.',
        icon: ClipboardList
    },
    {
        name: 'California Employee Handbook Generator',
        status: 'coming-soon',
        description: 'Customizable employee handbook templates for review when this module becomes available.',
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

            <section className="hero-light">
                <div className="hero-inner">
                    <img
                        src="/california-badge.png"
                        alt="California workplace violence prevention badge"
                        className="hero-badge"
                    />
                    <div className="hero-eyebrow">
                        <ShieldCheck size={16} /> California workplace violence prevention records
                    </div>
                    <h1 className="hero-title">
                        Organize your records.<br />Stay prepared. <span className="accent">✓</span>
                    </h1>
                    <p className="hero-lede">
                        CompCleared helps California small businesses organize a workplace violence
                        prevention plan, incident records, training records, and available PDF exports in one place.
                        It is not legal advice.
                    </p>
                    <div className="hero-actions">
                        <button className="btn-hero-primary" onClick={() => navigate('/exposure-check')}>
                            Free SB 553 Readiness Check →
                        </button>
                        <button className="btn-hero-secondary" onClick={() => navigate('/signup')}>
                            Start CompCleared Pro · $19/mo
                        </button>
                    </div>
                    <p className="hero-trust">
                        Free readiness check, no signup &nbsp;·&nbsp; Manage Pro through Stripe &nbsp;·&nbsp; Billing questions? Email support
                    </p>
                </div>
            </section>

            <section style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '24px 32px', maxWidth: '800px', margin: '56px auto 80px', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                    <AlertTriangle size={20} color="#dc2626" />
                    <strong style={{ color: '#991b1b', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        The deadline is real
                    </strong>
                </div>
                <p style={{ fontSize: '16px', color: '#7f1d1d', margin: 0 }}>
                    Use the free readiness check to organize your next steps. CompCleared starts at <strong>$19/month</strong> and does not provide legal advice.
                </p>
            </section>

            <section style={{ maxWidth: '1100px', margin: '0 auto 80px', padding: '0 20px' }}>
                <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a', textAlign: 'center', marginBottom: '12px' }}>
                    One place for workplace violence prevention records.
                </h2>
                <p style={{ fontSize: '16px', color: '#64748b', textAlign: 'center', marginBottom: '48px' }}>
                    CompCleared currently helps organize workplace violence prevention records. Other tools are planned.
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
                                        <Lock size={11} /> Planned
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
                    Organize workplace violence prevention records in 3 steps
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
                    {[
                        { num: '1', title: 'Answer 5 questions about your business', time: '60 seconds' },
                        { num: '2', title: 'Log incidents & training as they happen', time: '2 minutes per entry' },
                        { num: '3', title: 'Generate available PDF records when you need them', time: '30 seconds' }
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

            <section style={{ maxWidth: '1000px', margin: '0 auto 80px', padding: '0 20px' }}>
                <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', borderRadius: '16px', padding: '48px 40px', textAlign: 'center', color: '#fff' }}>
                    <h2 style={{ fontSize: '30px', fontWeight: '800', marginBottom: '12px', lineHeight: 1.2 }}>
                        See where you stand — then organize your records
                    </h2>
                    <p style={{ fontSize: '17px', color: '#CBD5E1', maxWidth: '560px', margin: '0 auto 28px', lineHeight: 1.6 }}>
                        Start with the free SB 553 readiness check. When you're ready, CompCleared Pro
                        helps organize your plan, incident log, and available PDF records for $19/month.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button className="btn-hero-primary" onClick={() => navigate('/exposure-check')}>
                            Free SB 553 Readiness Check →
                        </button>
                        <button className="btn-cta" onClick={() => navigate('/signup')}>
                            Start CompCleared Pro
                        </button>
                    </div>
                    <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '16px' }}>
                        Free check, no signup &nbsp;·&nbsp; Manage Pro through Stripe &nbsp;·&nbsp; Billing questions? Email support
                    </p>
                </div>
            </section>

            <section style={{ maxWidth: '900px', margin: '0 auto 40px', padding: '0 20px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', textAlign: 'center', marginBottom: '32px' }}>
                    Frequently asked questions
                </h2>
                <FAQ />
            </section>

            <Footer />
        </div>
    );
}

export default LandingPage;
