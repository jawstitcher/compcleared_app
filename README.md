# CompCleared

Workplace violence prevention record organization for California small businesses.

A guided builder that helps California employers organize workplace violence
prevention plans, training records, incident records, and available PDF exports.
It is not legal advice.

## What this app does

- **Workplace Violence Prevention Plan (WVPP) generator** — produces a plan
  template in PDF form for review and adaptation.
- **Incident log** — records incident details entered by the customer.
- **Training log** — records training sessions entered by the customer.
- **Dashboard** — at-a-glance view of plan, incident, and training records,
  with available PDF exports.
- **Free SB 553 readiness check** — 5-question screening tool at `/exposure-check` that
  tells a visitor in 60 seconds whether SB 553 applies to them.
- **Resource center** — `/resources` has general educational guides about
  workplace violence prevention topics.

## Marketing pages (no backend required)

These pages are all client-side React, deployed statically to Vercel:

- `/` — landing page with hero, how-it-works, features, FAQ
- `/pricing` — 2 tiers (Free, $19/mo or $149/yr) with feature comparison
- `/resources` — 6 plain-English guides on SB 553
- `/exposure-check` — 5-question free tool (lead generation)
- `/about`, `/contact`, `/privacy`, `/terms` — required standard pages

## App pages (require backend)

- `/signup`, `/login` — auth flow
- `/dashboard` — main app (incident log, training log, PDF export)
- `/training` — training record form
- `/compliance-hub` — interactive Q&A assistant

## What this app does not do

- It does not provide legal advice. Templates are starting points; consult a
  California-licensed employment attorney before relying on any document.
- It does not replace HR, safety, or legal counsel.
- It does not file anything with Cal/OSHA on your behalf.
- It does not monitor your business in real time.

## Stack

- **Frontend:** React 19 (Create React App), React Router 7
- **Backend:** Python 3 + Flask + psycopg + Postgres
- **Payments:** Stripe Checkout + Subscriptions
- **PDF generation:** ReportLab
- **Deploy:** Vercel (frontend) + Railway (backend)
- **Marketing analytics:** (none yet — add Plausible or Fathom when ready)

## Local development

### Frontend

```bash
npm install
npm start
```

Runs on `http://localhost:3000`. The CRA proxy forwards `/api/*` to the backend
on `http://localhost:5000`.

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask db upgrade   # run migrations
python app.py
```

### Environment

Copy `.env.example` to `.env` in both the project root and `backend/`. Required
keys for the backend:

```
SECRET_KEY=<32+ char string>
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://localhost/compcleared
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_ANNUAL=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Required keys for the frontend (in `.env`):

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## Production

- Frontend is deployed to Vercel from the `main` branch.
- Backend is deployed to Railway.
- `compcleared.com` is the production domain; both `https://compcleared.com`
  and `https://www.compcleared.com` are configured as allowed CORS origins.

## Pricing

- **Free** — `/exposure-check` 5-question tool + read the `/resources` knowledge
  center. No account required.
- **$19/month or $149/year** — full platform: plan template, incident log,
  training log, dashboard, and available PDF exports. For billing or refund
  questions, email support@compcleared.com.

See `/pricing` for details.

## Legal

- **Privacy Policy:** [`/privacy`](src/components/PrivacyPolicy.js)
- **Terms of Service:** [`/terms`](src/components/TermsOfService.js)
- **Disclaimer:** CompCleared provides compliance tools and templates for
  informational purposes only and does not constitute legal advice. Use of
  this service does not create an attorney-client relationship. CompCleared
  is not a law firm and does not provide legal representation. Consult a
  California-licensed employment attorney before relying on any generated
  document.

## License

Proprietary. All rights reserved.
