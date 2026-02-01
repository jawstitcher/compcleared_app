import React, { useState } from 'react';
import './IncidentLogForm.css';

const IncidentLogForm = () => {
    const [formData, setFormData] = useState({
        incident_date: '',
        incident_time: '',
        exact_location: '',
        violence_type: '',
        offender_classification: '',
        description: '',
        circumstances: [],
        violence_nature: [],
        consequences: '',
        law_enforcement_contacted: false,
        injuries: '',
        protective_measures: '',
        employees_involved: '',
        corrective_actions: '',
        logged_by_name: '',
        logged_by_title: ''
    });

    const [submitted, setSubmitted] = useState(false);
    const [incidentId, setIncidentId] = useState(null);

    const violenceTypes = [
        { value: 'Type 1', label: 'Type 1 - Stranger (no legitimate relationship to business)' },
        { value: 'Type 2', label: 'Type 2 - Customer/Client/Patient' },
        { value: 'Type 3', label: 'Type 3 - Worker-on-Worker' },
        { value: 'Type 4', label: 'Type 4 - Personal Relationship (domestic violence spillover)' }
    ];

    const offenderClassifications = [
        'Stranger',
        'Customer/Client',
        'Patient',
        'Co-worker',
        'Supervisor',
        'Employee\'s relative/partner',
        'Former employee',
        'Other'
    ];

    const circumstanceOptions = [
        'Poor lighting',
        'Low staffing',
        'Isolated location',
        'Working alone',
        'Late night/early morning hours',
        'High-risk area',
        'Unfamiliar location',
        'Performing usual duties',
        'Other'
    ];

    const violenceNatureOptions = [
        'Physical attack',
        'Threat of physical violence',
        'Verbal abuse/harassment',
        'Weapon involved',
        'Sexual assault/harassment',
        'Intimidation',
        'Property damage',
        'Other'
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleCheckboxGroup = (name, value) => {
        const current = formData[name];
        const updated = current.includes(value)
            ? current.filter(item => item !== value)
            : [...current, value];

        setFormData({ ...formData, [name]: updated });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            circumstances: formData.circumstances.join('; '),
            violence_nature: formData.violence_nature.join('; '),
            company_id: 1, // Default for MVP
            location_id: 'main'
        };

        try {
            const response = await fetch('/api/incidents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.success) {
                setIncidentId(result.incident_id);
                setSubmitted(true);
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            console.error('Error submitting incident:', error);
            alert('Error submitting incident. Please try again.');
        }
    };

    if (submitted) {
        return (
            <div className="incident-log-form">
                <div className="success-message">
                    <div className="success-icon">✓</div>
                    <h2>Incident Logged Successfully</h2>
                    <p>Incident ID: <strong>#{incidentId}</strong></p>
                    <p>This incident has been recorded in compliance with California SB 553.</p>
                    <p>Records will be maintained for 5 years as required by law.</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setSubmitted(false);
                            setFormData({
                                incident_date: '',
                                incident_time: '',
                                exact_location: '',
                                violence_type: '',
                                offender_classification: '',
                                description: '',
                                circumstances: [],
                                violence_nature: [],
                                consequences: '',
                                law_enforcement_contacted: false,
                                injuries: '',
                                protective_measures: '',
                                employees_involved: '',
                                corrective_actions: '',
                                logged_by_name: '',
                                logged_by_title: ''
                            });
                        }}
                    >
                        Log Another Incident
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="incident-log-form">
            <div className="form-header">
                <img src="/logo.png" alt="CompCleared" className="logo" />
                <h2>California SB 553 Workplace Violence Incident Log</h2>
                <p className="form-subtitle">All fields marked with * are required by California law</p>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Date, Time, and Location */}
                <section className="form-section">
                    <h3>Incident Details</h3>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="incident_date">Incident Date *</label>
                            <input
                                type="date"
                                id="incident_date"
                                name="incident_date"
                                value={formData.incident_date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="incident_time">Incident Time *</label>
                            <input
                                type="time"
                                id="incident_time"
                                name="incident_time"
                                value={formData.incident_time}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="exact_location">Exact Location *</label>
                        <input
                            type="text"
                            id="exact_location"
                            name="exact_location"
                            value={formData.exact_location}
                            onChange={handleInputChange}
                            placeholder="e.g., Breakroom, Parking Lot, Office 203"
                            required
                        />
                        <small>Specify the exact area within your workplace</small>
                    </div>
                </section>

                {/* Violence Classification */}
                <section className="form-section">
                    <h3>Classification</h3>

                    <div className="form-group">
                        <label htmlFor="violence_type">Type of Workplace Violence *</label>
                        <select
                            id="violence_type"
                            name="violence_type"
                            value={formData.violence_type}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Type</option>
                            {violenceTypes.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="offender_classification">Offender Classification *</label>
                        <select
                            id="offender_classification"
                            name="offender_classification"
                            value={formData.offender_classification}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Classification</option>
                            {offenderClassifications.map(classification => (
                                <option key={classification} value={classification}>{classification}</option>
                            ))}
                        </select>
                    </div>
                </section>

                {/* Description */}
                <section className="form-section">
                    <h3>Incident Description</h3>

                    <div className="form-group">
                        <label htmlFor="description">Detailed Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Provide a detailed account of what occurred..."
                            rows="5"
                            required
                        />
                        <small>Do not include personally identifying information</small>
                    </div>

                    <div className="form-group">
                        <label>Circumstances</label>
                        <div className="checkbox-group">
                            {circumstanceOptions.map(option => (
                                <label key={option} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.circumstances.includes(option)}
                                        onChange={() => handleCheckboxGroup('circumstances', option)}
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Nature of Violence</label>
                        <div className="checkbox-group">
                            {violenceNatureOptions.map(option => (
                                <label key={option} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.violence_nature.includes(option)}
                                        onChange={() => handleCheckboxGroup('violence_nature', option)}
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Consequences */}
                <section className="form-section">
                    <h3>Consequences & Response</h3>

                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="law_enforcement_contacted"
                                checked={formData.law_enforcement_contacted}
                                onChange={handleInputChange}
                            />
                            Law enforcement was contacted
                        </label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="injuries">Injuries Sustained</label>
                        <textarea
                            id="injuries"
                            name="injuries"
                            value={formData.injuries}
                            onChange={handleInputChange}
                            placeholder="Describe any injuries (if applicable)"
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="protective_measures">Protective Measures Taken</label>
                        <textarea
                            id="protective_measures"
                            name="protective_measures"
                            value={formData.protective_measures}
                            onChange={handleInputChange}
                            placeholder="What immediate protective measures were taken?"
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="employees_involved">Employees Involved</label>
                        <input
                            type="text"
                            id="employees_involved"
                            name="employees_involved"
                            value={formData.employees_involved}
                            onChange={handleInputChange}
                            placeholder="Names and job titles of affected employees"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="corrective_actions">Corrective Actions Taken</label>
                        <textarea
                            id="corrective_actions"
                            name="corrective_actions"
                            value={formData.corrective_actions}
                            onChange={handleInputChange}
                            placeholder="What actions were taken to prevent future incidents?"
                            rows="3"
                        />
                    </div>
                </section>

                {/* Logger Info */}
                <section className="form-section">
                    <h3>Logged By</h3>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="logged_by_name">Your Name *</label>
                            <input
                                type="text"
                                id="logged_by_name"
                                name="logged_by_name"
                                value={formData.logged_by_name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="logged_by_title">Your Title *</label>
                            <input
                                type="text"
                                id="logged_by_title"
                                name="logged_by_title"
                                value={formData.logged_by_title}
                                onChange={handleInputChange}
                                placeholder="e.g., HR Manager, Safety Officer"
                                required
                            />
                        </div>
                    </div>
                </section>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                        Submit Incident Report
                    </button>
                </div>

                <div className="compliance-notice">
                    <p>
                        This log is maintained in compliance with California SB 553.
                        Records will be stored securely for 5 years and made available to
                        Cal/OSHA upon request.
                    </p>
                </div>
            </form>
        </div>
    );
};

export default IncidentLogForm;
