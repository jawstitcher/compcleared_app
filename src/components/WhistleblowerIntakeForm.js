import React, { useState } from 'react';
import './WhistleblowerIntakeForm.css';

const WhistleblowerIntakeForm = () => {
  const [formData, setFormData] = useState({
    discoveryDate: '',
    incidentType: '',
    imminentRisk: false,
    description: '',
    files: []
  });
  const [burnerId, setBurnerId] = useState(null);

  const incidentTypes = [
    'CBRN Weapon Assistance',
    'Autonomous Cyberoffensive',
    'Model Deception/Evasion',
    'Mass Casualty Risk'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      files: Array.from(e.target.files)
    });
  };

  const generateBurnerId = () => {
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `CC-2026-${randomNum}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('discoveryDate', formData.discoveryDate);
    formDataToSend.append('incidentType', formData.incidentType);
    formDataToSend.append('imminentRisk', formData.imminentRisk.toString());
    formDataToSend.append('description', formData.description);
    formData.files.forEach((file, index) => {
      formDataToSend.append('files', file);
    });

    try {
      const response = await fetch('/submit_report', {
        method: 'POST',
        body: formDataToSend,
      });
      const result = await response.json();
      setBurnerId(result.burner_id);
      alert(`Form submitted successfully. Your Burner ID is: ${result.burner_id}`);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  return (
    <div className="whistleblower-form">
      <h2>Whistleblower Intake Form - CompCleared.com</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="discoveryDate">Discovery Date:</label>
          <input
            type="date"
            id="discoveryDate"
            name="discoveryDate"
            value={formData.discoveryDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="incidentType">Incident Type:</label>
          <select
            id="incidentType"
            name="incidentType"
            value={formData.incidentType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Incident Type</option>
            {incidentTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="toggle-label">
            <input
              type="checkbox"
              name="imminentRisk"
              checked={formData.imminentRisk}
              onChange={handleInputChange}
            />
            Does this pose a risk of death/injury within 72 hours?
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="description">Incident Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe the incident in detail..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="files">Upload Files:</label>
          <input
            type="file"
            id="files"
            name="files"
            multiple
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="submit-btn">Submit Whistleblower Report</button>
      </form>

      {burnerId && (
        <div className="burner-id">
          <p>Your anonymous Burner ID: <strong>{burnerId}</strong></p>
          <p>Use this ID to check the status of your report.</p>
        </div>
      )}

      <div className="disclaimer">
        <p>CompCleared is an independent third-party portal designed for TFAIA compliance. Not legal advice.</p>
      </div>
    </div>
  );
};

export default WhistleblowerIntakeForm;