from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import string
import os
from datetime import datetime, timedelta
import sqlite3
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Database setup for SB 553 Workplace Violence Compliance
def init_db():
    conn = sqlite3.connect('compcleared.db')
    c = conn.cursor()
    
    # Companies table
    c.execute('''CREATE TABLE IF NOT EXISTS companies (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    tier TEXT NOT NULL,
                    employee_count INTEGER,
                    locations TEXT,
                    created_at TEXT,
                    subscription_status TEXT
                )''')
    
    # Users table
    c.execute('''CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    company_id INTEGER,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT,
                    name TEXT,
                    role TEXT,
                    location_id TEXT,
                    created_at TEXT,
                    FOREIGN KEY (company_id) REFERENCES companies (id)
                )''')
    
    # Workplace Violence Incidents table (SB 553 compliant)
    c.execute('''CREATE TABLE IF NOT EXISTS incidents (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    company_id INTEGER,
                    location_id TEXT,
                    
                    -- SB 553 Required Fields
                    incident_date TEXT NOT NULL,
                    incident_time TEXT NOT NULL,
                    exact_location TEXT NOT NULL,
                    
                    violence_type TEXT NOT NULL,
                    offender_classification TEXT NOT NULL,
                    
                    description TEXT NOT NULL,
                    circumstances TEXT,
                    violence_nature TEXT,
                    
                    consequences TEXT,
                    law_enforcement_contacted INTEGER,
                    injuries TEXT,
                    protective_measures TEXT,
                    
                    employees_involved TEXT,
                    corrective_actions TEXT,
                    
                    logged_by_name TEXT NOT NULL,
                    logged_by_title TEXT NOT NULL,
                    log_date TEXT NOT NULL,
                    
                    created_at TEXT,
                    
                    FOREIGN KEY (company_id) REFERENCES companies (id)
                )''')
    
    # Training records table
    c.execute('''CREATE TABLE IF NOT EXISTS training_records (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    company_id INTEGER,
                    employee_name TEXT NOT NULL,
                    employee_id TEXT,
                    training_date TEXT NOT NULL,
                    training_type TEXT NOT NULL,
                    completed INTEGER,
                    certificate_url TEXT,
                    created_at TEXT,
                    FOREIGN KEY (company_id) REFERENCES companies (id)
                )''')
    
    conn.commit()
    conn.close()
    print("✅ SB 553 database initialized")

init_db()

# Helper functions
def get_db():
    conn = sqlite3.connect('compcleared.db')
    conn.row_factory = sqlite3.Row
    return conn

# API Routes

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'CompCleared SB 553'})

@app.route('/api/incidents', methods=['POST'])
def create_incident():
    """Log a new workplace violence incident (SB 553)"""
    data = request.json
    
    conn = get_db()
    c = conn.cursor()
    
    try:
        c.execute('''INSERT INTO incidents (
            company_id, location_id,
            incident_date, incident_time, exact_location,
            violence_type, offender_classification,
            description, circumstances, violence_nature,
            consequences, law_enforcement_contacted, injuries, protective_measures,
            employees_involved, corrective_actions,
            logged_by_name, logged_by_title, log_date,
            created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
        (
            data.get('company_id', 1),  # Default for MVP
            data.get('location_id', 'main'),
            data['incident_date'],
            data['incident_time'],
            data['exact_location'],
            data['violence_type'],
            data['offender_classification'],
            data['description'],
            data.get('circumstances', ''),
            data.get('violence_nature', ''),
            data.get('consequences', ''),
            1 if data.get('law_enforcement_contacted') else 0,
            data.get('injuries', ''),
            data.get('protective_measures', ''),
            json.dumps(data.get('employees_involved', [])),
            data.get('corrective_actions', ''),
            data['logged_by_name'],
            data['logged_by_title'],
            datetime.now().isoformat(),
            datetime.now().isoformat()
        ))
        
        incident_id = c.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'incident_id': incident_id,
            'message': 'Incident logged successfully'
        }), 201
        
    except Exception as e:
        conn.close()
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/incidents', methods=['GET'])
def get_incidents():
    """Get all incidents for a company"""
    company_id = request.args.get('company_id', 1)
    
    conn = get_db()
    c = conn.cursor()
    c.execute('''SELECT * FROM incidents 
                 WHERE company_id = ? 
                 ORDER BY incident_date DESC, incident_time DESC''', (company_id,))
    
    incidents = [dict(row) for row in c.fetchall()]
    conn.close()
    
    return jsonify({'success': True, 'incidents': incidents})

@app.route('/api/incidents/<int:incident_id>', methods=['GET'])
def get_incident(incident_id):
    """Get a specific incident"""
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM incidents WHERE id = ?', (incident_id,))
    
    incident = c.fetchone()
    conn.close()
    
    if incident:
        return jsonify({'success': True, 'incident': dict(incident)})
    else:
        return jsonify({'success': False, 'error': 'Incident not found'}), 404

@app.route('/api/training', methods=['POST'])
def create_training_record():
    """Log employee training completion"""
    data = request.json
    
    conn = get_db()
    c = conn.cursor()
    
    c.execute('''INSERT INTO training_records (
        company_id, employee_name, employee_id,
        training_date, training_type, completed,
        created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)''',
    (
        data.get('company_id', 1),
        data['employee_name'],
        data.get('employee_id', ''),
        data['training_date'],
        data['training_type'],
        1 if data.get('completed') else 0,
        datetime.now().isoformat()
    ))
    
    training_id = c.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({
        'success': True,
        'training_id': training_id,
        'message': 'Training record created'
    }), 201

@app.route('/api/training', methods=['GET'])
def get_training_records():
    """Get training records for a company"""
    company_id = request.args.get('company_id', 1)
    
    conn = get_db()
    c = conn.cursor()
    c.execute('''SELECT * FROM training_records 
                 WHERE company_id = ? 
                 ORDER BY training_date DESC''', (company_id,))
    
    records = [dict(row) for row in c.fetchall()]
    conn.close()
    
    return jsonify({'success': True, 'training_records': records})

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get incident statistics for dashboard"""
    company_id = request.args.get('company_id', 1)
    
    conn = get_db()
    c = conn.cursor()
    
    # Total incidents
    c.execute('SELECT COUNT(*) as count FROM incidents WHERE company_id = ?', (company_id,))
    total = c.fetchone()['count']
    
    # By violence type
    c.execute('''SELECT violence_type, COUNT(*) as count 
                 FROM incidents 
                 WHERE company_id = ? 
                 GROUP BY violence_type''', (company_id,))
    by_type = [dict(row) for row in c.fetchall()]
    
    # Recent incidents (last 30 days)
    thirty_days_ago = (datetime.now() - timedelta(days=30)).isoformat()[:10]
    c.execute('''SELECT COUNT(*) as count FROM incidents 
                 WHERE company_id = ? AND incident_date >= ?''', 
                 (company_id, thirty_days_ago))
    recent = c.fetchone()['count']
    
    conn.close()
    
    return jsonify({
        'success': True,
        'stats': {
            'total_incidents': total,
            'by_type': by_type,
            'recent_30_days': recent
        }
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)