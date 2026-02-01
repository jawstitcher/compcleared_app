import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { CheckCircle2, ShieldCheck, CreditCard, UserPlus, Loader2 } from 'lucide-react';
import '../App.css';
import './Signup.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const TIERS = {
    starter: {
        name: 'Starter',
        price: '$49/month',
        employees: '1-50 employees',
        features: [
            'Unlimited incident logging',
            'SB 553 compliant reports',
            'Training tracking',
            'Basic analytics'
        ]
    },
    professional: {
        name: 'Professional',
        price: '$99/month',
        employees: '51-200 employees',
        features: [
            'Everything in Starter',
            'Multi-location support',
            'Advanced analytics',
            'Priority support'
        ]
    },
    enterprise: {
        name: 'Enterprise',
        price: '$199/month',
        employees: '201+ employees',
        features: [
            'Everything in Professional',
            'Custom integrations',
            'Dedicated account manager',
            'SLA guarantee'
        ]
    }
};

function Signup() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        company_name: '',
        employee_count: '',
        tier: 'starter',
        email: '',
        password: '',
        name: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleTierSelect = (tier) => {
        setFormData({ ...formData, tier });
    };

    const handleCompanySubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Create checkout session
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/create-checkout-session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    company_name: formData.company_name,
                    employee_count: parseInt(formData.employee_count),
                    tier: formData.tier
                })
            });

            const data = await response.json();

            if (data.success) {
                // Save company_id for after payment
                sessionStorage.setItem('company_id', data.company_id);
                sessionStorage.setItem('signup_data', JSON.stringify(formData));

                // Redirect to Stripe checkout
                window.location.href = data.checkout_url;
            } else {
                setError(data.error || 'Failed to create checkout session');
                setLoading(false);
            }
        } catch (err) {
            setError('Network error. Please try again.');
            setLoading(false);
        }
    };

    const handleAccountSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const company_id = sessionStorage.getItem('company_id');

        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    company_id: parseInt(company_id),
                    email: formData.email,
                    password: formData.password,
                    name: formData.name,
                    role: 'admin'
                })
            });

            const data = await response.json();

            if (data.success) {
                sessionStorage.removeItem('company_id');
                sessionStorage.removeItem('signup_data');
                navigate('/dashboard');
            } else {
                setError(data.error || 'Failed to create account');
                setLoading(false);
            }
        } catch (err) {
            setError('Network error. Please try again.');
            setLoading(false);
        }
    };

    // Check if returning from Stripe
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');
        const companyId = urlParams.get('company_id');

        if (sessionId && companyId) {
            setLoading(true);
            const verifyPayment = async () => {
                try {
                    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
                    const res = await fetch(`${apiUrl}/api/verify-session?session_id=${sessionId}&company_id=${companyId}`);
                    const verificationData = await res.json();

                    if (verificationData.success) {
                        sessionStorage.setItem('company_id', companyId);
                        const savedData = sessionStorage.getItem('signup_data');
                        if (savedData) {
                            setFormData(JSON.parse(savedData));
                        }
                        setStep(2);
                    } else {
                        setError('Payment verification failed. Please contact support.');
                    }
                } catch (err) {
                    setError('Verification error. Please refresh.');
                } finally {
                    setLoading(false);
                }
            };
            verifyPayment();
        }
    }, [navigate]);

    return (
        <div className="container" style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <Logo size="large" />
            </div>
            <h1 style={{ textAlign: 'center', marginBottom: '40px', color: '#0f172a', fontSize: '2.5rem' }}>
                Get Started with <span style={{ color: '#0f172a', fontWeight: '800' }}>Comp</span><span style={{ color: '#2563EB', fontWeight: '800' }}>Cleared</span>
            </h1>

            {error && (
                <div style={{
                    background: '#fee',
                    border: '1px solid #c00',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    color: '#c00'
                }}>
                    {error}
                </div>
            )}

            {step === 1 && (
                <>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '20px',
                        marginBottom: '40px'
                    }}>
                        {Object.entries(TIERS).map(([key, tier]) => (
                            <div
                                key={key}
                                onClick={() => handleTierSelect(key)}
                                style={{
                                    border: formData.tier === key ? '3px solid #2563EB' : '2px solid #ddd',
                                    borderRadius: '12px',
                                    padding: '30px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    background: formData.tier === key ? '#f0f9ff' : 'white'
                                }}
                            >
                                <h3 style={{ marginTop: 0 }}>{tier.name}</h3>
                                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563EB', margin: '15px 0' }}>
                                    {tier.price}
                                </div>
                                <div style={{ color: '#666', marginBottom: '20px' }}>{tier.employees}</div>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {tier.features.map((feature, idx) => (
                                        <li key={idx} style={{ padding: '8px 0', borderTop: '1px solid #eee' }}>
                                            ✓ {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleCompanySubmit} style={{
                        background: 'white',
                        border: '2px solid #ddd',
                        borderRadius: '12px',
                        padding: '30px',
                        maxWidth: '500px',
                        margin: '0 auto'
                    }}>
                        <h3>Company Information</h3>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                                Company Name *
                            </label>
                            <input
                                type="text"
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                    fontSize: '16px'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                                Number of Employees *
                            </label>
                            <input
                                type="number"
                                name="employee_count"
                                value={formData.employee_count}
                                onChange={handleChange}
                                required
                                min="1"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                    fontSize: '16px'
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '15px',
                                background: '#2563EB',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.6 : 1
                            }}
                        >
                            {loading ? 'Processing...' : 'Continue to Payment'}
                        </button>
                    </form>
                </>
            )}

            {step === 2 && (
                <form onSubmit={handleAccountSubmit} style={{
                    background: 'white',
                    border: '2px solid #ddd',
                    borderRadius: '12px',
                    padding: '30px',
                    maxWidth: '500px',
                    margin: '0 auto'
                }}>
                    <div style={{
                        background: '#d1fae5',
                        border: '1px solid #10b981',
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '30px',
                        textAlign: 'center'
                    }}>
                        ✓ Payment successful! Complete your account setup.
                    </div>

                    <h3>Create Your Account</h3>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                            Full Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                            Email *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                            Password *
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="8"
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '16px'
                            }}
                        />
                        <small style={{ color: '#666' }}>Minimum 8 characters</small>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '15px',
                            background: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.6 : 1
                        }}
                    >
                        {loading ? 'Creating Account...' : 'Complete Setup'}
                    </button>
                </form>
            )}

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                Already have an account?{' '}
                <a href="/login" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 'bold' }}>
                    Log in
                </a>
            </div>
        </div>
    );
}

export default Signup;
