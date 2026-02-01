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
# Session Configuration for Cross-Origin (Vercel -> Railway)
app.config.update(
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='None',
)
# CORS Configuration
# Allow requests from localhost, the configured FRONTEND_URL, and production domains
allowed_origins = [
    'http://localhost:3000',
    os.environ.get('FRONTEND_URL', 'http://localhost:3000'),
    'https://compcleared.com',
    'https://www.compcleared.com',
    'https://compcleared-app.vercel.app'
]
CORS(app, supports_credentials=True, origins=allowed_origins)

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
    
    # Training records table (SB 553 compliance)
    c.execute('''CREATE TABLE IF NOT EXISTS training_records (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    company_id INTEGER,
                    training_date TEXT NOT NULL,
                    training_type TEXT NOT NULL, -- e.g., Annual, Initial, Post-Incident
                    trainer_name TEXT,
                    topic_description TEXT,
                    attendee_count INTEGER,
                    documentation_url TEXT, -- Link to signed sign-in sheets
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
        
        # Hash password (using pbkdf2 for compatibility)
        password_hash = generate_password_hash(data['password'], method='pbkdf2:sha256')
        
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
            },
            allow_promotion_codes=True
        )
        
        return jsonify({
            'success': True,
            'checkout_url': checkout_session.url,
            'company_id': company_id
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/verify-session', methods=['GET'])
def verify_session():
    """Verify Stripe session and activate company"""
    session_id = request.args.get('session_id')
    company_id = request.args.get('company_id')
    
    if not session_id or not company_id:
        return jsonify({'success': False, 'error': 'Missing parameters'}), 400
        
    try:
        checkout_session = stripe.checkout.Session.retrieve(session_id)
        
        if checkout_session.payment_status == 'paid':
            conn = get_db()
            c = conn.cursor()
            c.execute('''UPDATE companies 
                         SET subscription_status = 'active', 
                             stripe_customer_id = ?, 
                             stripe_subscription_id = ? 
                         WHERE id = ?''', 
                      (checkout_session.customer, checkout_session.subscription, company_id))
            conn.commit()
            conn.close()
            return jsonify({'success': True, 'status': 'active'})
        else:
            return jsonify({'success': False, 'status': checkout_session.payment_status})
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/webhook', methods=['POST'])
def stripe_webhook():
    """Handle Stripe webhook events"""
    payload = request.data
    sig_header = request.headers.get('Stripe-Signature')
    endpoint_secret = os.environ.get('STRIPE_WEBHOOK_SECRET')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
    # Handle subscription events
    if event['type'] == 'checkout.session.completed':
        session_data = event['data']['object']
        # Try metadata first, then client_reference_id
        company_id = session_data.get('metadata', {}).get('company_id') or session_data.get('client_reference_id')
        
        if company_id:
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
            print(f"✅ Subscription activated for company {company_id}")
    
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
        company_id, training_date, training_type,
        trainer_name, topic_description, attendee_count,
        documentation_url, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
    (
        session['company_id'],
        data['training_date'],
        data['training_type'],
        data.get('trainer_name', ''),
        data.get('topic_description', ''),
        data.get('attendee_count', 0),
        data.get('documentation_url', ''),
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
@app.route('/api/report/pdf', methods=['GET'])
@login_required
@subscription_required
def generate_pdf_report():
    """Generate a Cal/OSHA compliant PDF incident report"""
    from io import BytesIO
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import letter
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from flask import send_file
    
    company_id = session['company_id']
    
    conn = get_db()
    c = conn.cursor()
    
    # Get company info
    c.execute('SELECT * FROM companies WHERE id = ?', (company_id,))
    company = dict(c.fetchone())
    
    # Get all incidents
    c.execute('''SELECT * FROM incidents 
                 WHERE company_id = ? 
                 ORDER BY incident_date DESC''', (company_id,))
    incidents = [dict(row) for row in c.fetchall()]
    conn.close()
    
    # Create PDF
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=72)
    
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle('Title', parent=styles['Heading1'], fontSize=18, spaceAfter=20, textColor=colors.HexColor('#0f172a'))
    heading_style = ParagraphStyle('Heading', parent=styles['Heading2'], fontSize=14, spaceBefore=15, spaceAfter=10, textColor=colors.HexColor('#2563EB'))
    body_style = ParagraphStyle('Body', parent=styles['Normal'], fontSize=10, spaceAfter=8)
    
    story = []
    
    # Header
    story.append(Paragraph("SB 553 WORKPLACE VIOLENCE INCIDENT LOG", title_style))
    story.append(Paragraph(f"Company: {company['name']}", body_style))
    story.append(Paragraph(f"Report Generated: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}", body_style))
    story.append(Paragraph(f"Total Incidents Recorded: {len(incidents)}", body_style))
    story.append(Spacer(1, 20))
    
    # Compliance statement
    story.append(Paragraph("CALIFORNIA SB 553 COMPLIANCE CERTIFICATION", heading_style))
    story.append(Paragraph(
        "This incident log is maintained in accordance with California Senate Bill 553, which requires employers to "
        "maintain a Workplace Violence Prevention Plan (WVPP) and violent incident log. All incidents are recorded "
        "with required fields including date, time, location, type of violence, and detailed circumstances.",
        body_style
    ))
    story.append(Spacer(1, 20))
    
    # Incidents
    if incidents:
        story.append(Paragraph("INCIDENT RECORDS", heading_style))
        
        for i, incident in enumerate(incidents, 1):
            story.append(Paragraph(f"<b>Incident #{i}</b>", body_style))
            
            # Create table for incident details
            data = [
                ['Date:', incident.get('incident_date', 'N/A'), 'Time:', incident.get('incident_time', 'N/A')],
                ['Location:', incident.get('exact_location', 'N/A'), 'Type:', incident.get('violence_type', 'N/A')],
                ['Offender:', incident.get('offender_classification', 'N/A'), 'Law Enforcement:', 'Yes' if incident.get('law_enforcement_contacted') else 'No'],
            ]
            
            t = Table(data, colWidths=[1.2*inch, 2*inch, 1.2*inch, 2*inch])
            t.setStyle(TableStyle([
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('FONTNAME', (2, 0), (2, -1), 'Helvetica-Bold'),
                ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#475569')),
                ('TEXTCOLOR', (2, 0), (2, -1), colors.HexColor('#475569')),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ]))
            story.append(t)
            
            story.append(Paragraph(f"<b>Description:</b> {incident.get('description', 'N/A')}", body_style))
            if incident.get('corrective_actions'):
                story.append(Paragraph(f"<b>Corrective Actions:</b> {incident.get('corrective_actions')}", body_style))
            story.append(Paragraph(f"<i>Logged by: {incident.get('logged_by_name', 'N/A')}, {incident.get('logged_by_title', 'N/A')} on {incident.get('log_date', 'N/A')}</i>", body_style))
            story.append(Spacer(1, 15))
    else:
        story.append(Paragraph("No incidents have been recorded.", body_style))
    
    # Footer
    story.append(Spacer(1, 30))
    story.append(Paragraph("─" * 50, body_style))
    story.append(Paragraph(
        "<i>This report was generated by CompCleared, a Cal/OSHA SB 553 compliance management system. "
        "Records are maintained with timestamps and audit trails for legal defensibility.</i>",
        body_style
    ))
    
    doc.build(story)
    buffer.seek(0)
    
    filename = f"SB553_Incident_Report_{company['name'].replace(' ', '_')}_{datetime.now().strftime('%Y%m%d')}.pdf"
    
    return send_file(
        buffer,
        as_attachment=True,
        download_name=filename,
        mimetype='application/pdf'
    )

@app.route('/api/report/plan', methods=['GET'])
@login_required
@subscription_required
def generate_written_plan():
    """Generate a custom Written Workplace Violence Prevention Plan (WVPP)"""
    from io import BytesIO
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import letter
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, ListFlowable, ListItem
    from flask import send_file
    
    company_id = session['company_id']
    
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM companies WHERE id = ?', (company_id,))
    company = dict(c.fetchone())
    conn.close()
    
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=72)
    
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle('Title', parent=styles['Heading1'], fontSize=24, spaceAfter=20, alignment=1, textColor=colors.HexColor('#0f172a'))
    subtitle_style = ParagraphStyle('Subtitle', parent=styles['Heading2'], fontSize=14, spaceAfter=30, alignment=1, textColor=colors.HexColor('#64748B'))
    heading_style = ParagraphStyle('Heading', parent=styles['Heading2'], fontSize=16, spaceBefore=20, spaceAfter=12, textColor=colors.HexColor('#2563EB'), borderPadding=5, thickness=1)
    body_style = ParagraphStyle('Body', parent=styles['Normal'], fontSize=11, spaceAfter=10, leading=14)
    item_style = ParagraphStyle('Item', parent=styles['Normal'], fontSize=11, leftIndent=20, spaceAfter=8)
    
    story = []
    
    # Cover Page
    story.append(Spacer(1, 2*inch))
    story.append(Paragraph("Workplace Violence Prevention Plan (WVPP)", title_style))
    story.append(Paragraph(f"For: {company['name']}", subtitle_style))
    story.append(Spacer(1, 0.5*inch))
    story.append(Paragraph(f"In Compliance with California SB 553 / LC 6401.9", body_style))
    story.append(Paragraph(f"Effective Date: {datetime.now().strftime('%B %d, %Y')}", body_style))
    story.append(Paragraph("Last Review Date: " + datetime.now().strftime('%B %d, %Y'), body_style))
    story.append(PageBreak())
    
    # Section 1: Responsibility
    story.append(Paragraph("1. Responsibility and Authority", heading_style))
    story.append(Paragraph(
        f"The designated manager/administrator for {company['name']} has the overall authority and responsibility "
        "for implementing the provisions of this Workplace Violence Prevention Plan (WVPP). All managers and "
        "supervisors are responsible for implementing and maintaining the WVPP in their work areas and for answering "
        "employee questions about the WVPP.",
        body_style
    ))
    
    # Section 2: Employee Involvement
    story.append(Paragraph("2. Employee Involvement", heading_style))
    story.append(Paragraph(
        f"{company['name']} ensures that all employees are involved in developing and implementing the WVPP through:",
        body_style
    ))
    story.append(Paragraph("• Regular safety meetings and discussions specifically addressing workplace violence risks.", item_style))
    story.append(Paragraph("• Participation in workplace hazard assessments and identification.", item_style))
    story.append(Paragraph("• An open reporting system where employees can suggest improvements to safety protocols.", item_style))
    
    # Section 3: Reporting Procedures
    story.append(Paragraph("3. Reporting Workplace Violence", heading_style))
    story.append(Paragraph(
        "Employees can report incidents or concerns of workplace violence, including threats of violence, using the "
        "following methods without fear of retaliation:",
        body_style
    ))
    story.append(Paragraph("• Digital Reporting: Through the CompCleared portal accessible to all employees.", item_style))
    story.append(Paragraph("• Immediate Threats: Call 911 for all emergencies involving immediate danger.", item_style))
    story.append(Paragraph("• Internal Reporting: Report to any supervisor or human resources representative.", item_style))
    
    # Section 4: Hazard Assessment
    story.append(Paragraph("4. Workplace Violence Hazard Assessment", heading_style))
    story.append(Paragraph(
        f"{company['name']} conducts periodic inspections to identify and evaluate workplace violence hazards. "
        "Inspections will be performed when the plan is first established, periodically thereafter, and when "
        "we are made aware of a new or previously unrecognized hazard.",
        body_style
    ))
    
    # Section 5: Incident Investigation
    story.append(Paragraph("5. Workplace Violence Incident Investigation", heading_style))
    story.append(Paragraph(
        "Following any violent incident, a thorough investigation will be conducted to identify root causes and "
        "implement corrective measures. All findings will be recorded in the Violent Incident Log as required by law.",
        body_style
    ))
    
    # Section 6: Training
    story.append(Paragraph("6. Training and Instruction", heading_style))
    story.append(Paragraph(
        "All employees will receive initial and annual training on:",
        body_style
    ))
    story.append(Paragraph("• Definitions and types of workplace violence.", item_style))
    story.append(Paragraph("• How to report incidents and concerns.", item_style))
    story.append(Paragraph("• De-escalation techniques and emergency response.", item_style))
    story.append(Paragraph("• The specific details of this written prevention plan.", item_style))
    
    doc.build(story)
    buffer.seek(0)
    
    filename = f"SB553_Written_Plan_{company['name'].replace(' ', '_')}.pdf"
    
    return send_file(
        buffer,
        as_attachment=True,
        download_name=filename,
        mimetype='application/pdf'
    )

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=False, host='0.0.0.0', port=port)