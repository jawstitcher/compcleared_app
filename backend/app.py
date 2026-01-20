from flask import Flask, request, jsonify, session
from flask_cors import CORS
import random
import string
import os
from datetime import datetime, timedelta
import sqlite3
import json
import stripe
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
from functools import wraps

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
CORS(app, supports_credentials=True, origins=['http://localhost:3000'])

# Stripe configuration
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY', 'sk_test_placeholder')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')

# Stripe price IDs (create these in Stripe Dashboard)
PRICE_IDS = {
    'starter': os.environ.get('STRIPE_PRICE_STARTER', 'price_starter'),
    'professional': os.environ.get('STRIPE_PRICE_PROFESSIONAL', 'price_professional'),
    'enterprise': os.environ.get('STRIPE_PRICE_ENTERPRISE', 'price_enterprise')
}

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
                    subscription_status TEXT,
                    stripe_customer_id TEXT,
                    stripe_subscription_id TEXT
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

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'success': False, 'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

def subscription_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'company_id' not in session:
            return jsonify({'success': False, 'error': 'Authentication required'}), 401
        
        conn = get_db()
        c = conn.cursor()
        c.execute('SELECT subscription_status FROM companies WHERE id = ?', (session['company_id'],))
        company = c.fetchone()
        conn.close()
        
        if not company or company['subscription_status'] != 'active':
            return jsonify({'success': False, 'error': 'Active subscription required'}), 403
        
        return f(*args, **kwargs)
    return decorated_function

# API Routes

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'CompCleared SB 553'})

# Auth endpoints

@app.route('/api/signup', methods=['POST'])
def signup():
    """Create a new user account"""
    data = request.json
    
    conn = get_db()
    c = conn.cursor()
    
    try:
        # Check if email already exists
        c.execute('SELECT id FROM users WHERE email = ?', (data['email'],))
        if c.fetchone():
            conn.close()
            return jsonify({'success': False, 'error': 'Email already registered'}), 400
        
        # Hash password
        password_hash = generate_password_hash(data['password'])
        
        # Create user
        c.execute('''INSERT INTO users (
            company_id, email, password_hash, name, role, created_at
        ) VALUES (?, ?, ?, ?, ?, ?)''',
        (
            data.get('company_id'),
            data['email'],
            password_hash,
            data.get('name', ''),
            data.get('role', 'admin'),
            datetime.now().isoformat()
        ))
        
        user_id = c.lastrowid
        conn.commit()
        conn.close()
        
        # Create session
        session['user_id'] = user_id
        session['company_id'] = data.get('company_id')
        session['email'] = data['email']
        
        return jsonify({
            'success': True,
            'user_id': user_id,
            'message': 'Account created successfully'
        }), 201
        
    except Exception as e:
        conn.close()
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/login', methods=['POST'])
def login():
    """Log in existing user"""
    data = request.json
    
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM users WHERE email = ?', (data['email'],))
    user = c.fetchone()
    conn.close()
    
    if not user or not check_password_hash(user['password_hash'], data['password']):
        return jsonify({'success': False, 'error': 'Invalid email or password'}), 401
    
    # Create session
    session['user_id'] = user['id']
    session['company_id'] = user['company_id']
    session['email'] = user['email']
    
    return jsonify({
        'success': True,
        'user': {
            'id': user['id'],
            'email': user['email'],
            'name': user['name'],
            'company_id': user['company_id']
        }
    })

@app.route('/api/logout', methods=['POST'])
def logout():
    """Log out current user"""
    session.clear()
    return jsonify({'success': True})

@app.route('/api/me', methods=['GET'])
@login_required
def get_current_user():
    """Get current user info"""
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM users WHERE id = ?', (session['user_id'],))
    user = c.fetchone()
    
    if user and user['company_id']:
        c.execute('SELECT * FROM companies WHERE id = ?', (user['company_id'],))
        company = c.fetchone()
    else:
        company = None
    
    conn.close()
    
    return jsonify({
        'success': True,
        'user': dict(user) if user else None,
        'company': dict(company) if company else None
    })

# Stripe endpoints

@app.route('/api/create-checkout-session', methods=['POST'])
def create_checkout_session():
    """Create Stripe checkout session for subscription"""
    data = request.json
    tier = data.get('tier', 'starter')
    
    try:
        # Create or get company
        conn = get_db()
        c = conn.cursor()
        
        c.execute('''INSERT INTO companies (
            name, tier, employee_count, subscription_status, created_at
        ) VALUES (?, ?, ?, ?, ?)''',
        (
            data['company_name'],
            tier,
            data.get('employee_count', 0),
            'pending',
            datetime.now().isoformat()
        ))
        
        company_id = c.lastrowid
        conn.commit()
        conn.close()
        
        # Create Stripe checkout session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price': PRICE_IDS.get(tier, PRICE_IDS['starter']),
                'quantity': 1,
            }],
            mode='subscription',
            success_url=f'{FRONTEND_URL}/signup/success?session_id={{CHECKOUT_SESSION_ID}}&company_id={company_id}',
            cancel_url=f'{FRONTEND_URL}/signup?canceled=true',
            client_reference_id=str(company_id),
            metadata={
                'company_id': company_id,
                'tier': tier
            }
        )
        
        return jsonify({
            'success': True,
            'checkout_url': checkout_session.url,
            'company_id': company_id
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/webhook', methods=['POST'])
def stripe_webhook():
    """Handle Stripe webhook events"""
    payload = request.data
    sig_header = request.headers.get('Stripe-Signature')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, os.environ.get('STRIPE_WEBHOOK_SECRET')
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
    # Handle subscription events
    if event['type'] == 'checkout.session.completed':
        session_data = event['data']['object']
        company_id = session_data['metadata']['company_id']
        
        # Update company with Stripe info
        conn = get_db()
        c = conn.cursor()
        c.execute('''UPDATE companies 
                     SET subscription_status = ?, 
                         stripe_customer_id = ?,
                         stripe_subscription_id = ?
                     WHERE id = ?''',
                  ('active', 
                   session_data['customer'],
                   session_data['subscription'],
                   company_id))
        conn.commit()
        conn.close()
    
    elif event['type'] == 'customer.subscription.deleted':
        subscription = event['data']['object']
        
        conn = get_db()
        c = conn.cursor()
        c.execute('''UPDATE companies 
                     SET subscription_status = ?
                     WHERE stripe_subscription_id = ?''',
                  ('canceled', subscription['id']))
        conn.commit()
        conn.close()
    
    return jsonify({'success': True})

# Protected endpoints (require auth + subscription)

@app.route('/api/incidents', methods=['POST'])
@login_required
@subscription_required
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
            session['company_id'],
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
@login_required
@subscription_required
def get_incidents():
    """Get all incidents for a company"""
    company_id = session['company_id']
    
    conn = get_db()
    c = conn.cursor()
    c.execute('''SELECT * FROM incidents 
                 WHERE company_id = ? 
                 ORDER BY incident_date DESC, incident_time DESC''', (company_id,))
    
    incidents = [dict(row) for row in c.fetchall()]
    conn.close()
    
    return jsonify({'success': True, 'incidents': incidents})

@app.route('/api/incidents/<int:incident_id>', methods=['GET'])
@login_required
@subscription_required
def get_incident(incident_id):
    """Get a specific incident"""
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM incidents WHERE id = ? AND company_id = ?', 
              (incident_id, session['company_id']))
    
    incident = c.fetchone()
    conn.close()
    
    if incident:
        return jsonify({'success': True, 'incident': dict(incident)})
    else:
        return jsonify({'success': False, 'error': 'Incident not found'}), 404

@app.route('/api/training', methods=['POST'])
@login_required
@subscription_required
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
        session['company_id'],
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
@login_required
@subscription_required
def get_training_records():
    """Get training records for a company"""
    company_id = session['company_id']
    
    conn = get_db()
    c = conn.cursor()
    c.execute('''SELECT * FROM training_records 
                 WHERE company_id = ? 
                 ORDER BY training_date DESC''', (company_id,))
    
    records = [dict(row) for row in c.fetchall()]
    conn.close()
    
    return jsonify({'success': True, 'training_records': records})

@app.route('/api/stats', methods=['GET'])
@login_required
@subscription_required
def get_stats():
    """Get incident statistics for dashboard"""
    company_id = session['company_id']
    
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