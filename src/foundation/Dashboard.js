import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import {
    CheckCircle2,
    Circle,
    FileText,
    Download,
    PlusCircle,
    ClipboardList
} from 'lucide-react';
import { apiUrl } from '../api';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [incidents, setIncidents] = useState([]);
    const [trainings, setTrainings] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [incidentsRes, statsRes, trainingsRes] = await Promise.all([
                fetch(apiUrl('/api/incidents?company_id=1'), { credentials: 'include' }),
                fetch(apiUrl('/api/stats?company_id=1'), { credentials: 'include' }),
                fetch(apiUrl('/api/training'), { credentials: 'include' })
            ]);

            const incidentsData = await incidentsRes.json();
            const statsData = await statsRes.json();
            const trainingsData = await trainingsRes.json();

            if (incidentsData.success) {
                setIncidents(incidentsData.incidents);
            }
            if (statsData.success) {
                setStats(statsData.stats);
            }
            if (trainingsData.success) {
                setTrainings(trainingsData.training_records);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const openBillingPortal = async () => {
        const response = await fetch(apiUrl('/api/billing-portal'), {
            method: 'POST',
            credentials: 'include'
        });
        const data = await response.json();
        if (data.success) window.location.assign(data.url);
        else window.alert(data.error || 'Unable to open subscription management.');
    };

    if (loading) {
        return (
            <div className="dashboard">
                <div className="loading">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <Logo size="large" />
                <button className="btn btn-outline manage-subscription" onClick={openBillingPortal}>
                    Manage subscription
                </button>
                <h1>Workplace Violence Records Dashboard</h1>
            </div>

            {/* Compliance Status Bar */}
            <div className="compliance-status-bar">
                <div className="status-item">
                    <span className="status-icon"><CheckCircle2 size={16} /></span>
                    <span className="status-text">Incident Records</span>
                </div>
                <div className="status-item">
                    <span className="status-icon"><CheckCircle2 size={16} /></span>
                    <span className="status-text">Prevention Plan Template</span>
                </div>
                <div className={`status-item ${stats?.total_incidents > 0 ? 'complete' : 'pending'}`}>
                    <span className="status-icon">
                        {stats?.total_incidents > 0 ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                    </span>
                    <span className="status-text">{stats?.total_incidents > 0 ? 'Records Available to Review' : 'No Incident Records Yet'}</span>
                </div>
            </div>

            {/* Primary Compliance Actions */}
            <div className="compliance-hero-grid">
                {/* Written Plan Card */}
                <div className="compliance-card official">
                    <div className="card-badge">PLAN TEMPLATE</div>
                    <div className="card-content">
                        <h2>Workplace Violence Prevention Plan</h2>
                        <p>Generate a plan template to review and adapt for your business. CompCleared does not provide legal advice.</p>
                        <button
                            className="btn btn-primary btn-official"
                            onClick={() => window.open(apiUrl('/api/report/plan'), '_blank')}
                        >
                            <FileText size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                            Generate Plan Template (PDF)
                        </button>
                    </div>
                </div>

                {/* Training Tracker Mini Card */}
                <div className="compliance-card official secondary">
                    <div className="card-badge">TRAINING RECORDS</div>
                    <div className="card-content">
                        <h2>Employee Training Log</h2>
                        <p>Record completed workplace violence prevention training sessions for your internal records.</p>
                        <button className="btn btn-outline" onClick={() => navigate('/training')}>
                            <ClipboardList size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                            Log Training Session
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">{stats?.total_incidents || 0}</div>
                    <div className="stat-label">Total Incidents</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{stats?.recent_30_days || 0}</div>
                    <div className="stat-label">Last 30 Days</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">
                        {incidents.filter(i => i.law_enforcement_contacted).length}
                    </div>
                    <div className="stat-label">Law Enforcement Involved</div>
                </div>
            </div>

            {/* Incidents by Type */}
            {stats?.by_type && stats.by_type.length > 0 && (
                <div className="chart-card">
                    <h3>Incidents by Type</h3>
                    <div className="type-breakdown">
                        {stats.by_type.map(type => (
                            <div key={type.violence_type} className="type-row">
                                <span className="type-label">{type.violence_type}</span>
                                <div className="type-bar-container">
                                    <div
                                        className="type-bar"
                                        style={{ width: `${(type.count / stats.total_incidents) * 100}%` }}
                                    />
                                </div>
                                <span className="type-count">{type.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="incidents-section">
                <div className="section-header">
                    <h2>Recent Incidents</h2>
                    <div className="header-actions">
                        <button className="btn btn-secondary" onClick={() => window.open(apiUrl('/api/report/pdf'), '_blank')}>
                            <Download size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                            Export Audit Log (PDF)
                        </button>
                        <button className="btn btn-primary" onClick={() => window.location.href = '/'}>
                            <PlusCircle size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                            Log New Incident
                        </button>
                    </div>
                </div>

                {incidents.length === 0 ? (
                    <div className="empty-state">
                        <p>No incidents logged yet.</p>
                        <p className="empty-subtitle">Start logging workplace violence incidents to organize your records.</p>
                    </div>
                ) : (
                    <div className="incidents-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Location</th>
                                    <th>Type</th>
                                    <th>Offender</th>
                                    <th>Law Enforcement</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {incidents.map(incident => (
                                    <tr key={incident.id}>
                                        <td className="incident-id">#{incident.id}</td>
                                        <td>{formatDate(incident.incident_date)}</td>
                                        <td>{incident.incident_time}</td>
                                        <td>{incident.exact_location}</td>
                                        <td>
                                            <span className={`badge badge-${incident.violence_type.toLowerCase().replace(' ', '-')}`}>
                                                {incident.violence_type}
                                            </span>
                                        </td>
                                        <td>{incident.offender_classification}</td>
                                        <td>
                                            {incident.law_enforcement_contacted ? (
                                                <span className="badge badge-yes">Yes</span>
                                            ) : (
                                                <span className="badge badge-no">No</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className="badge badge-compliant">
                                                Recorded
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="training-section">
                <div className="section-header">
                    <h2>Training History</h2>
                    <button className="btn btn-secondary" onClick={() => navigate('/training')}>
                        <PlusCircle size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        Log New Session
                    </button>
                </div>

                {trainings.length === 0 ? (
                    <div className="empty-state">
                        <p>No training sessions recorded yet.</p>
                        <p className="empty-subtitle">Keep your training log updated for your internal records.</p>
                    </div>
                ) : (
                    <div className="incidents-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Training Type</th>
                                    <th>Trainer</th>
                                    <th>Attendees</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trainings.map(training => (
                                    <tr key={training.id}>
                                        <td>{formatDate(training.training_date)}</td>
                                        <td>{training.training_type}</td>
                                        <td>{training.trainer_name}</td>
                                        <td>{training.attendee_count} employees</td>
                                        <td>
                                            <span className="badge badge-compliant">
                                                Recorded
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="compliance-footer">
                <p>
                    CompCleared helps organize plan, training, and incident records. It does not provide legal advice.
                </p>
            </div>
        </div >
    );
};

export default Dashboard;
