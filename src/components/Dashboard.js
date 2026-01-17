import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
    const [incidents, setIncidents] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [incidentsRes, statsRes] = await Promise.all([
                fetch('/api/incidents?company_id=1'),
                fetch('/api/stats?company_id=1')
            ]);

            const incidentsData = await incidentsRes.json();
            const statsData = await statsRes.json();

            if (incidentsData.success) {
                setIncidents(incidentsData.incidents);
            }
            if (statsData.success) {
                setStats(statsData.stats);
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
                <img src="/logo.png" alt="CompCleared" className="logo" />
                <h1>SB 553 Compliance Dashboard</h1>
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

            {/* Incident List */}
            <div className="incidents-section">
                <div className="section-header">
                    <h2>Recent Incidents</h2>
                    <button className="btn btn-primary" onClick={() => window.location.href = '/'}>
                        + Log New Incident
                    </button>
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="compliance-footer">
                <p>
                    <strong>SB 553 Compliance:</strong> All incidents are stored for 5 years.
                    Records available to Cal/OSHA within 15 days upon request.
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
