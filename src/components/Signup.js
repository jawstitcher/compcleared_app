import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import '../App.css';
import './Signup.css';

const TIERS = {
    monthly: {
        name: 'Monthly',
        price: '$19/month',
        employees: 'For any California employer',
        features: [
            'Customized WVPP plan template',
            'Violent Incident Log (digital, all 14 fields)',
            'Training tracker (annual, initial, post-incident, new-hazard)',
            'Available PDF exports for product records',
        ]
    },
    annual: {
        name: 'Annual',
        price: '$149/year',
        employees: 'Save $79/year vs monthly',
        popular: true,
        features: [
            'Everything in Monthly, plus:',
            'Save $79 vs monthly billing',
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
        tier: 'annual',
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

        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    name: formData.name,
                    role: 'admin'
                })
            });

            const data = await response.json();

            if (data.success) {
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
                    const res = await fetch(
                        `${apiUrl}/api/verify-session?session_id=${sessionId}&company_id=${companyId}`,
                        { credentials: 'include' }
                    );
                    const verificationData = await res.json();

                    if (verificationData.success) {
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
        <main className="signup-page">
            <div className="signup-container">
                <header className="signup-header">
                    <button className="brand-link" type="button" onClick={() => navigate('/')}>
                        <Logo size="large" />
                    </button>
                    <p className="signup-eyebrow">Secure Stripe checkout</p>
                    <h1>Start CompCleared Pro</h1>
                    <p>Choose a plan, complete payment, then create your workspace account.</p>
                </header>

                {error && (
                    <div className="error-alert" role="alert">
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <>
                        <div className="tiers-grid" role="radiogroup" aria-label="Choose a CompCleared Pro plan">
                            {Object.entries(TIERS).map(([key, tier]) => {
                                const isSelected = formData.tier === key;

                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        role="radio"
                                        aria-checked={isSelected}
                                        aria-label={`${tier.name} plan: ${tier.price}`}
                                        className={`tier-card ${isSelected ? 'selected' : ''}`}
                                        onClick={() => handleTierSelect(key)}
                                    >
                                        <span className="tier-card-header">
                                            <span>
                                                <span className="tier-name">{tier.name}</span>
                                                <span className="tier-employees">{tier.employees}</span>
                                            </span>
                                            {tier.popular && <span className="tier-badge">Best value</span>}
                                        </span>
                                        <span className="tier-price">{tier.price}</span>
                                        <ul className="tier-features">
                                            {tier.features.map((feature, idx) => (
                                                <li key={idx}>{feature}</li>
                                            ))}
                                        </ul>
                                    </button>
                                );
                            })}
                        </div>

                        <form className="signup-form" onSubmit={handleCompanySubmit}>
                            <h2>Company information</h2>

                            <div className="form-group">
                                <label htmlFor="company_name">Company name *</label>
                                <input
                                    id="company_name"
                                    type="text"
                                    name="company_name"
                                    value={formData.company_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="employee_count">Number of employees *</label>
                                <input
                                    id="employee_count"
                                    type="number"
                                    name="employee_count"
                                    value={formData.employee_count}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                />
                            </div>

                            <p className="checkout-note">
                                You’ll be taken to Stripe to complete your selected paid plan. The free readiness
                                check is available without an account. For billing or refund questions, email
                                support@compcleared.com.
                            </p>
                            <button type="submit" disabled={loading} className="submit-btn">
                                {loading ? 'Processing...' : 'Continue to Stripe'}
                            </button>
                        </form>
                    </>
                )}

                {step === 2 && (
                    <form className="signup-form" onSubmit={handleAccountSubmit}>
                        <div className="success-alert" role="status">
                            Payment successful. Complete your account setup.
                        </div>

                        <h2>Create your account</h2>

                        <div className="form-group">
                            <label htmlFor="name">Full name *</label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email *</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password *</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength="8"
                            />
                            <small>Minimum 8 characters</small>
                        </div>

                        <button type="submit" disabled={loading} className="submit-btn">
                            {loading ? 'Creating account...' : 'Complete setup'}
                        </button>
                    </form>
                )}

                <div className="signup-footer">
                    Already have an account? <a href="/login">Log in</a>
                </div>
            </div>
        </main>
    );
}

export default Signup;
