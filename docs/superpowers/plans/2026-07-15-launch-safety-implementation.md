# CompCleared Launch Safety Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make paid signup secure, give customers a functional billing-management route, and ensure the public site makes only support and product promises it can currently fulfill.

**Architecture:** The Flask backend becomes the authority for mapping a Stripe Checkout Session to one pending company and for authorizing first-account creation. A signed-in customer gets a Stripe-hosted Billing Portal URL via a small protected API endpoint. The React application removes fake form behavior and unsupported claims, exposing only the backend endpoints it needs.

**Tech Stack:** Flask 3, Stripe Python SDK, psycopg/Postgres, React 19, React Testing Library, Jest, Python `unittest.mock`.

## Global Constraints

- Never commit Stripe keys, webhook secrets, database URLs, personal addresses, or real customer data.
- Do not make a live charge, purchase ads, send email, publish posts, or contact prospects.
- Preserve the $19/month and $149/year plans; do not enable Stripe Tax in this patch.
- Use “helps organize” and “not legal advice”; do not claim legal compliance, certification, penalty amounts, guaranteed retention, scheduled alerts, or automatic deletion.
- Keep `.claude/` untouched because it is user-owned untracked work.

---

## File structure

- `backend/app.py` — secure checkout verification, verified signup binding, Billing Portal endpoint, webhook guards.
- `backend/test_app.py` — backend behavior tests using Flask test client and mocks; no live database or Stripe call.
- `src/components/Contact.js` — mailto support flow instead of a false-success form.
- `src/components/Signup.js` — accurate product copy and no client authority over company binding.
- `src/foundation/Dashboard.js` — visible subscription-management action.
- `src/foundation/PricingPage.js` — accurate plan, cancellation, export, and tax copy.
- `src/components/TermsOfService.js` and `src/components/PrivacyPolicy.js` — repair contact email and remove unsupported operational claims.
- `src/components/Contact.test.js` and `src/foundation/PricingPage.test.js` — public support/copy regression tests.

## Task 1: Add a test seam for Stripe checkout verification and authenticated signup

**Files:**
- Create: `backend/test_app.py`
- Modify: `backend/app.py:177-224,345-373`

**Interfaces:**
- Consumes: `GET /api/verify-session?session_id=<id>&company_id=<id>`.
- Produces: Flask session key `verified_checkout_company_id` only after a paid, matching checkout is verified.
- Consumes: `POST /api/signup` JSON `{email,password,name,role}`.
- Produces: `201` only when the signed session contains `verified_checkout_company_id`; user is attached to that ID.

- [ ] **Step 1: Write failing tests for rejected checkout verification and unverified signup.**

```python
from types import SimpleNamespace
from unittest.mock import MagicMock, patch

import backend.app as app_module


def test_verify_session_rejects_company_not_owned_by_checkout(client):
    checkout = SimpleNamespace(
        payment_status="paid",
        subscription="sub_123",
        customer="cus_123",
        client_reference_id="7",
        metadata={"company_id": "7"},
    )
    with patch.object(app_module.stripe.checkout.Session, "retrieve", return_value=checkout):
        response = client.get("/api/verify-session?session_id=cs_123&company_id=8")
    assert response.status_code == 403
    assert response.get_json()["error"] == "Checkout session does not match this company"


def test_signup_rejects_client_selected_company_without_verified_checkout(client):
    response = client.post("/api/signup", json={
        "company_id": 999,
        "email": "owner@example.com",
        "password": "safe-password",
        "name": "Owner",
    })
    assert response.status_code == 403
    assert response.get_json()["error"] == "Complete payment verification before creating an account"
```

- [ ] **Step 2: Add a Flask test fixture that prevents database initialization and creates a test client.**

```python
import os
os.environ.pop("DATABASE_URL", None)

import pytest
import backend.app as app_module


@pytest.fixture
def client():
    app_module.app.config.update(TESTING=True, SECRET_KEY="test-secret")
    with app_module.app.test_client() as test_client:
        yield test_client
```

- [ ] **Step 3: Run the failing tests.**

Run: `python -m pytest backend/test_app.py -q`

Expected: FAIL because the current API accepts a mismatched company ID and unverified signup.

- [ ] **Step 4: Implement the minimum server-authoritative binding.**

In `verify_session`, read `metadata.company_id` and `client_reference_id`, require them both to equal the request `company_id`, require the company row to exist with `subscription_status = 'pending'`, and require a paid session with a subscription. On success set `session['verified_checkout_company_id'] = int(company_id)` before the database update.

In `signup`, replace `data.get('company_id')` with:

```python
company_id = session.get('verified_checkout_company_id')
if not company_id:
    return jsonify({
        'success': False,
        'error': 'Complete payment verification before creating an account'
    }), 403
```

Use `company_id` for both the user insert and `session['company_id']`, then remove it after a successful commit:

```python
session.pop('verified_checkout_company_id', None)
```

- [ ] **Step 5: Run the tests.**

Run: `python -m pytest backend/test_app.py -q`

Expected: PASS.

- [ ] **Step 6: Commit Task 1.**

```bash
git add backend/app.py backend/test_app.py backend/requirements.txt
git commit -m "Secure checkout account binding"
```

## Task 2: Add the Stripe Billing Portal route and dashboard entry point

**Files:**
- Modify: `backend/app.py:375-425`
- Modify: `src/foundation/Dashboard.js:1-80`
- Modify: `src/foundation/Dashboard.css`
- Modify: `backend/test_app.py`

**Interfaces:**
- Consumes: `POST /api/billing-portal` with a signed-in, active subscriber session.
- Produces: JSON `{success: true, url: "https://billing.stripe.com/..."}`.
- Consumes: dashboard click.
- Produces: browser redirect to the returned Stripe Billing Portal URL.

- [ ] **Step 1: Write failing portal tests.**

```python
def test_billing_portal_requires_login(client):
    response = client.post("/api/billing-portal")
    assert response.status_code == 401


def test_billing_portal_uses_signed_in_company_customer_id(client):
    fake_connection = MagicMock()
    fake_cursor = fake_connection.cursor.return_value
    fake_cursor.fetchone.return_value = {
        "subscription_status": "active",
        "stripe_customer_id": "cus_correct",
    }
    portal = SimpleNamespace(url="https://billing.stripe.com/session/test")
    with client.session_transaction() as flask_session:
        flask_session["user_id"] = 11
        flask_session["company_id"] = 7
    with patch.object(app_module, "get_db", return_value=fake_connection), \
         patch.object(app_module.stripe.billing_portal.Session, "create", return_value=portal) as create:
        response = client.post("/api/billing-portal")
    assert response.status_code == 200
    assert response.get_json()["url"] == portal.url
    create.assert_called_once_with(customer="cus_correct", return_url=app_module.FRONTEND_URL + "/dashboard")
```

- [ ] **Step 2: Run the portal tests.**

Run: `python -m pytest backend/test_app.py -q`

Expected: FAIL because `/api/billing-portal` does not exist.

- [ ] **Step 3: Implement the protected endpoint.**

```python
@app.route('/api/billing-portal', methods=['POST'])
@login_required
@subscription_required
def create_billing_portal():
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT stripe_customer_id FROM companies WHERE id = %s', (session['company_id'],))
    company = c.fetchone()
    conn.close()
    if not company or not company['stripe_customer_id']:
        return jsonify({'success': False, 'error': 'Billing account is not available yet'}), 409
    portal_session = stripe.billing_portal.Session.create(
        customer=company['stripe_customer_id'],
        return_url=f'{FRONTEND_URL}/dashboard',
    )
    return jsonify({'success': True, 'url': portal_session.url})
```

- [ ] **Step 4: Add a dashboard button and failure message.**

```javascript
const openBillingPortal = async () => {
  const response = await fetch(apiUrl('/api/billing-portal'), {
    method: 'POST', credentials: 'include'
  });
  const data = await response.json();
  if (data.success) window.location.assign(data.url);
  else window.alert(data.error || 'Unable to open subscription management.');
};
```

Render a `Manage subscription` button in the dashboard header beside the product logo. Do not render it in public marketing pages.

- [ ] **Step 5: Run backend and frontend validation.**

Run: `python -m pytest backend/test_app.py -q && CI=true npm test -- --watchAll=false && CI=true npm run build`

Expected: all commands exit 0.

- [ ] **Step 6: Commit Task 2.**

```bash
git add backend/app.py backend/test_app.py src/foundation/Dashboard.js src/foundation/Dashboard.css
git commit -m "Add subscription management portal"
```

## Task 3: Make customer support real and remove false success states

**Files:**
- Modify: `src/components/Contact.js`
- Create: `src/components/Contact.test.js`

**Interfaces:**
- Consumes: contact form email, subject, and message.
- Produces: `mailto:support@compcleared.com` with encoded subject/body.

- [ ] **Step 1: Write a failing contact test.**

```javascript
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Contact from './Contact';

test('opens an email to support instead of showing a false submission success', () => {
  delete window.location;
  window.location = { href: '' };
  render(<MemoryRouter><Contact /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'owner@example.com' } });
  fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Need billing help' } });
  fireEvent.click(screen.getByRole('button', { name: 'Send Message' }));
  expect(window.location.href).toContain('mailto:support@compcleared.com');
  expect(screen.queryByText('Message Received')).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run the contact test.**

Run: `CI=true npm test -- Contact.test.js --watchAll=false`

Expected: FAIL because the page only sets `submitted` state.

- [ ] **Step 3: Implement the mailto handler.**

Store form values in React state. In the submit handler, create the subject/body with `encodeURIComponent` and set `window.location.href` to:

```javascript
`mailto:support@compcleared.com?subject=${subject}&body=${body}`
```

Remove `submitted` state and the “Message Received” UI branch. Keep the visible response-time text, but change it to “Email support@compcleared.com; we typically respond within 1–2 business days.”

- [ ] **Step 4: Run the focused frontend test.**

Run: `CI=true npm test -- Contact.test.js --watchAll=false`

Expected: PASS.

- [ ] **Step 5: Commit Task 3.**

```bash
git add src/components/Contact.js src/components/Contact.test.js
git commit -m "Make support contact flow truthful"
```

## Task 4: Align public signup, pricing, and legal copy with the operating product

**Files:**
- Modify: `src/components/Signup.js`
- Modify: `src/foundation/PricingPage.js`
- Modify: `src/components/TermsOfService.js`
- Modify: `src/components/PrivacyPolicy.js`
- Create: `src/foundation/PricingPage.test.js`

**Interfaces:**
- Consumes: public page renders.
- Produces: copy that accurately directs free users to the readiness check, paid users to Stripe Checkout, and cancellation users to the Billing Portal.

- [ ] **Step 1: Write a failing public-copy regression test.**

```javascript
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PricingPage from './PricingPage';

test('does not promise unsupported automated product features', () => {
  render(<MemoryRouter><PricingPage /></MemoryRouter>);
  expect(screen.queryByText(/Email alerts on Cal\/OSHA regulatory changes/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/5-year retention of all records/i)).not.toBeInTheDocument();
  expect(screen.getByText(/Manage your subscription through Stripe/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the regression test.**

Run: `CI=true npm test -- PricingPage.test.js --watchAll=false`

Expected: FAIL because the current page promises alerts, five-year hosted retention, and unimplemented cancellation behavior.

- [ ] **Step 3: Apply the copy decisions.**

- In `Signup.js`, remove alerts, hosted-retention, “locked-in rate,” and priority-support claims. Add a short sentence above payment: “You’ll be taken to Stripe to complete your selected paid plan. The free readiness check is available without an account.”
- In `PricingPage.js`, replace the penalty/attorney price comparison with: “Start with the free readiness check, then use Pro to organize your plan, training records, and incident log.”
- Replace automated tax language with: “Prices are shown in USD. Any applicable taxes are shown by Stripe at checkout.”
- Replace cancellation/export/deletion FAQs with: “Manage your subscription through Stripe’s secure billing portal. For refunds or data requests, email support@compcleared.com.”
- In Terms and Privacy, replace every `mailto:[email protected]` and displayed placeholder with `support@compcleared.com`; remove renewal-reminder, confirmation-email, 30-day automatic deletion, unproven encryption, GPC, and compliance assertions. Keep a conspicuous “not legal advice” statement.

- [ ] **Step 4: Run frontend tests and production build.**

Run: `CI=true npm test -- --watchAll=false && CI=true npm run build`

Expected: all tests pass and Create React App produces a production build.

- [ ] **Step 5: Commit Task 4.**

```bash
git add src/components/Signup.js src/foundation/PricingPage.js src/foundation/PricingPage.test.js src/components/TermsOfService.js src/components/PrivacyPolicy.js
git commit -m "Align public billing and legal copy"
```

## Task 5: Verify deployed configuration without making a live charge

**Files:**
- Modify: `QUICKSTART.md`
- Modify: `DEPLOYMENT.md`

**Interfaces:**
- Consumes: Railway production variables and Stripe live dashboard.
- Produces: documented operator checklist for safe launch validation.

- [ ] **Step 1: Add a launch checklist that names only variable keys, never values.**

```markdown
### Live billing readiness

- Railway `STRIPE_SECRET_KEY` begins with `sk_live_`.
- Railway `STRIPE_PRICE_MONTHLY` and `STRIPE_PRICE_ANNUAL` match live-mode Stripe Price IDs.
- Railway `STRIPE_WEBHOOK_SECRET` is copied from the active live webhook destination.
- Railway changes are deployed and `/api/health` returns 200.
- Stripe Billing Portal is configured to allow subscription cancellation.
```

- [ ] **Step 2: Add a no-charge verification instruction.**

```markdown
Open `/signup`, select each plan, and stop when Stripe opens Checkout. Confirm it is live mode and shows the intended product, price, and billing interval. Do not enter a card during this no-charge check.
```

- [ ] **Step 3: Add a deliberate post-launch verification instruction.**

```markdown
After the owner authorizes a small real purchase, confirm the live webhook delivery succeeds, the company activates, and the Stripe Billing Portal opens. Refund/cancel through the portal only after recording the result.
```

- [ ] **Step 4: Run the complete verification suite.**

Run: `python -m pytest backend/test_app.py -q && CI=true npm test -- --watchAll=false && CI=true npm run build && curl --fail --silent --show-error https://compclearedapp-production.up.railway.app/api/health`

Expected: Python tests pass, React tests pass, build exits 0, and health responds with JSON containing `"status":"ok"`.

- [ ] **Step 5: Commit Task 5.**

```bash
git add QUICKSTART.md DEPLOYMENT.md
git commit -m "Document live billing verification"
```

## Plan self-review

- Spec coverage: Task 1 covers secure Stripe/company binding and webhook safety; Task 2 covers actual cancellation; Task 3 covers support; Task 4 covers truthful public claims; Task 5 covers safe operational verification.
- Placeholder scan: no unresolved implementation placeholders, secrets, or unspecified endpoints remain.
- Type consistency: `verified_checkout_company_id`, `/api/billing-portal`, and `{success, url}` are used consistently across backend and frontend tasks.
