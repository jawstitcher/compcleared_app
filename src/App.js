import React, { useState } from 'react';
import IncidentLogForm from './components/IncidentLogForm';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [view, setView] = useState('form'); // 'form' or 'dashboard'

  return (
    <div className="App">
      <nav className="main-nav">
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
      </nav>

      {view === 'form' ? <IncidentLogForm /> : <Dashboard />}
    </div>
  );
}

export default App;
