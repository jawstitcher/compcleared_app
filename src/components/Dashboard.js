import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import {
    CheckCircle2,
    Circle,
    FileText,
    Download,
    PlusCircle,
    ClipboardList,
    ShieldAlert,
    History
} from 'lucide-react';
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
                fetch('/api/incidents?company_id=1'),
                fetch('/api/stats?company_id=1'),
                fetch('/api/training')
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
                <h1>SB 553 Compliance Dashboard</h1>
            </div>

            {/* Compliance Status Bar */}
            <div className="compliance-status-bar">
                <div className="status-item complete">
                    <span className="status-icon"><CheckCircle2 size={16} /></span>
                    <span className="status-text">Violent Incident Log</span>
                </div>
                <div className="status-item complete">
                    <span className="status-icon"><CheckCircle2 size={16} /></span>
                    <span className="status-text">Written Prevention Plan</span>
                </div>
                <div className={`status-item ${stats?.total_incidents > 0 ? 'complete' : 'pending'}`}>
                    <span className="status-icon">
                        {stats?.total_incidents > 0 ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                    </span>
                    <span className="status-text">{stats?.total_incidents > 0 ? 'Annual Audit Ready' : 'Awaiting Audit Entry'}</span>
                </div>
            </div>

            {/* Primary Compliance Actions */}
            <div className="compliance-hero-grid">
                {/* Written Plan Card */}
                <div className="compliance-card official">
                    <div className="card-badge">SB 553 MANDATORY</div>
                    <div className="card-content">
                        <h2>Written Prevention Plan (WVPP)</h2>
                        <p>Download your customized Cal/OSHA model-compliant written plan. Keep a copy accessible to all employees at all times.</p>
                        <button
                            className="btn btn-primary btn-official"
                            onClick={() => window.open('/api/report/plan', '_blank')}
                        >
                            <FileText size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                            Generate Official Plan (PDF)
                        </button>
                    </div>
                </div>

                {/* Training Tracker Mini Card */}
                <div className="compliance-card official secondary">
                    <div className="card-badge">LEGAL GAP</div>
                    <div className="card-content">
                        <h2>Employee Training Log</h2>
                        <p>Ensure every employee has completed annual de-escalation and safety training to avoid $18k+ fines.</p>
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
                <div className="stat-card">
                    <div className="stat-value">5 Years</div>
                    <div className="stat-label">Retention Period</div>
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
                        <button className="btn btn-secondary" onClick={() => window.open('/api/report/pdf', '_blank')}>
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
                        <p className="empty-subtitle">Start logging workplace violence incidents to maintain SB 553 compliance.</p>
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
                                                ✓ Compliant
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
                        <p className="empty-subtitle">Keep your log updated to prove you have a trained workforce.</p>
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
                                                ✓ Certified
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
                    <strong>SB 553 Compliance:</strong> All incidents and training records are stored for 5 years.
                    Records available to Cal/OSHA within 15 days upon request.
                </p>
            </div>
        </div >
    );
};

export default Dashboard;
