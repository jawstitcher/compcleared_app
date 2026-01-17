# CompCleared Whistleblower Portal

A full-stack application for 2026 California SB 53 compliant whistleblower reporting.

## Features

- **Intake Form**: Collects discovery date, incident type, imminent risk flag, and incident description
- **Anonymity Engine**: Generates burner IDs and strips metadata from uploads
- **Legal Logic Gates**: Handles imminent risk alerts and standard reporting deadlines
- **Compliance Tracker**: Automated 30-day status update pings

## Setup

### Frontend (React)

```bash
npm install
npm start
```

### Backend (Flask)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

## Usage

1. Start both frontend and backend servers
2. Access the React app at http://localhost:3000
3. Fill out the whistleblower intake form
4. Submit to receive your anonymous Burner ID

## Disclaimer

CompCleared is an independent third-party portal designed for TFAIA compliance. Not legal advice.
