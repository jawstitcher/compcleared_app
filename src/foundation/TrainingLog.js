import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { CheckCircle2 } from 'lucide-react';
import './TrainingLog.css';

const TrainingLog = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    // ... rest of state stays same ...
    const [formData, setFormData] = useState({
        training_date: new Date().toISOString().split('T')[0],
        training_type: 'Annual',
        trainer_name: '',
        topic_description: 'Annual SB 553 Workplace Violence Prevention Training',
        attendee_count: '',
        documentation_url: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/training', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    attendee_count: parseInt(formData.attendee_count) || 0
                })
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => navigate('/dashboard'), 2000);
            }
        } catch (error) {
            console.error('Error logging training:', error);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="training-log-container">
                <div className="success-message">
                    <div className="success-icon">
                        <CheckCircle2 size={48} />
                    </div>
                    <h2>Training Record Saved</h2>
                    <p>Redirecting to dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="training-log-container">
            <div className="form-card">
                <div className="form-header">
                    <Logo size="medium" />
                    <h1>SB 553 Training Certification</h1>
                    <p>Log a completed training session for Cal/OSHA compliance.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Training Date</label>
                            <input
                                type="date"
                                name="training_date"
                                value={formData.training_date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Training Type</label>
                            <select
                                name="training_type"
                                value={formData.training_type}
                                onChange={handleChange}
                                required
                            >
                                <option value="Initial">Initial (New Hires)</option>
                                <option value="Annual">Annual Refresher</option>
                                <option value="Post-Incident">Post-Incident Training</option>
                                <option value="New Hazard">New Hazard Identified</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Trainer Name</label>
                            <input
                                type="text"
                                name="trainer_name"
                                value={formData.trainer_name}
                                onChange={handleChange}
                                placeholder="Name of person conducting training"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Attendee Count</label>
                            <input
                                type="number"
                                name="attendee_count"
                                value={formData.attendee_count}
                                onChange={handleChange}
                                placeholder="Number of employees trained"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group full">
                        <label>Training Topics Covered</label>
                        <textarea
                            name="topic_description"
                            value={formData.topic_description}
                            onChange={handleChange}
                            placeholder="Briefly describe topics (e.g., plan review, de-escalation, reporting)"
                            rows="3"
                            required
                        ></textarea>
                    </div>

                    <div className="compliance-note">
                        <p><strong>Compliance Reminder:</strong> SB 553 requires training records to be kept for at least 1 year. This includes training dates, content descriptions, and names/qualifications of trainers.</p>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard')}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Certify Training Session'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TrainingLog;
