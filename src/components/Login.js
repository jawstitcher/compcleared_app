import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                navigate('/dashboard');
            } else {
                setError(data.error || 'Invalid email or password');
                setLoading(false);
            }
        } catch (err) {
            setError('Network error. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{
            maxWidth: '450px',
            margin: '80px auto',
            padding: '20px'
        }}>
            <div style={{
                background: 'white',
                border: '2px solid #ddd',
                borderRadius: '12px',
                padding: '40px'
            }}>
                <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>
                    Welcome Back
                </h1>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>
                    Log in to your CompCleared account
                </p>

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

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 'bold'
                        }}>
                            Email
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

                    <div style={{ marginBottom: '30px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 'bold'
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
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
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <div style={{
                    textAlign: 'center',
                    marginTop: '30px',
                    paddingTop: '30px',
                    borderTop: '1px solid #eee'
                }}>
                    Don't have an account?{' '}
                    <a href="/signup" style={{
                        color: '#2563eb',
                        textDecoration: 'none',
                        fontWeight: 'bold'
                    }}>
                        Sign up
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Login;
