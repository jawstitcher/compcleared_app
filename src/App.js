import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import IncidentLogForm from './components/IncidentLogForm';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function MainApp() {
  const [view, setView] = React.useState('form');

  const handleLogout = async () => {
    await fetch('http://localhost:5000/api/logout', {
      method: 'POST',
      credentials: 'include'
    });
    window.location.href = '/login';
  };

  return (
    <div className="App">
      <nav className="main-nav">
        <div style={{ display: 'flex', gap: '10px' }}>
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
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/success" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainApp />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

export default App;
