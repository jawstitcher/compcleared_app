import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './foundation/Dashboard';
import IncidentLogForm from './foundation/IncidentLogForm';
import TrainingLog from './foundation/TrainingLog';
import About from './components/About';
import Contact from './components/Contact';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import ComplianceHub from './foundation/ComplianceHub';
import PricingPage from './foundation/PricingPage';
import ExposureCheck from './foundation/ExposureCheck';
import Resources from './foundation/Resources';
import ProtectedRoute from './components/ProtectedRoute';
import Logo from './components/Logo';
import './App.css';


function MainApp() {
  const [view, setView] = React.useState('form');

  const handleLogout = async () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    await fetch(`${apiUrl}/api/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    window.location.href = '/login';
  };

  return (
    <div className="App">
      <nav className="main-nav">
        <Logo size="small" />
        <div style={{ display: 'flex', gap: '10px', marginLeft: '20px' }}>
          <button
            className={`nav-btn ${view === 'form' ? 'active' : ''}`}
            onClick={() => setView('form')}
          >
            Log Incident
          </button>
          <button
            className={`nav-btn ${view === 'dashboard' ? 'active' : ''}`}
            onClick={() => setView('dashboard')}
          >
            Dashboard
          </button>
        </div>
        <button
          className="nav-btn"
          onClick={handleLogout}
          style={{ marginLeft: 'auto' }}
        >
          Log Out
        </button>
      </nav>

      {view === 'form' ? <IncidentLogForm /> : <Dashboard />}
    </div>
  );
}


function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/exposure-check" element={<ExposureCheck />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/success" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/compliance-hub" element={<ProtectedRoute><ComplianceHub /></ProtectedRoute>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/training"
          element={
            <ProtectedRoute>
              <TrainingLog />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
