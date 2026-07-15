# CompCleared launch-safety patch

## Goal

Make the existing paid signup flow safe and truthful enough for a small, direct launch. This patch deliberately does not add marketing automation, tax collection, email campaigns, retention jobs, or broad legal-compliance claims.

## Scope

### 1. Bind paid Checkout to the company that completes signup

- Keep creating a pending company before Stripe Checkout, but store its ID only in Stripe Checkout metadata and `client_reference_id`.
- On `GET /api/verify-session`, retrieve the Checkout Session and reject it unless the requested company ID exactly matches both the Stripe reference/metadata and a pending company in the database.
- Require `payment_status == "paid"` and a subscription before activating the company.
- Store a short-lived, server-side session marker containing the verified company ID after successful verification.
- On `POST /api/signup`, ignore a client-supplied company ID. Permit account creation only for the verified server-side company marker, then remove that marker after signup.
- Keep webhook activation idempotent and validate that it only updates the company ID Stripe included in the event.

### 2. Give paid users a real cancellation route

- Add an authenticated backend endpoint that creates a Stripe Billing Portal session for the signed-in company’s Stripe customer ID.
- Add a visible **Manage subscription** action in the authenticated product navigation/dashboard that redirects to that portal.
- The portal is Stripe-hosted; it handles cancellation and billing-method changes. CompCleared continues to mark the subscription canceled on `customer.subscription.deleted`.
- Do not promise an immediate refund or data deletion in code. Refund requests remain a support-email process until a refund workflow exists.

### 3. Ensure customers can contact support

- Replace the fake contact form with a transparent mailto-based support path that pre-fills the subject and message, rather than showing a false “Message Received” state.
- Use the configured support email address consistently in Contact, Terms, and Privacy pages.

### 4. Remove or narrow promises that the application cannot currently perform

- Change pricing/sign-up/legal copy to describe the actual paid workflow: plan generation, training records, incident records, and available PDF exports.
- Remove unsupported promises: regulatory-change emails, five-year hosted retention, one-click data export of all data, confirmation emails, automatic annual-renewal reminders, automatic 30-day deletion, and automatic tax calculation.
- Keep the 14-day refund policy only as a support-request policy if the owner intends to honor it; do not claim an automated refund system.
- Change legal/compliance language from “compliant,” “certified,” “official plan,” and penalty assertions to “helps organize” / “template” / “not legal advice,” pending attorney review.

## Explicit non-goals

- No claims that CompCleared guarantees SB 553 compliance.
- No personal information, Stripe secrets, or payment identifiers added to source control.
- No live payment charge, public post, email campaign, ad purchase, or external outreach.
- No data deletion scheduler, email provider, tax implementation, or attorney-reviewed legal policy created in this patch.

## User flow after the patch

1. A visitor selects monthly or annual, provides company details, and is sent to Stripe Checkout.
2. Stripe returns with its session ID. The backend verifies the paid session and that its company reference matches the pending company before activating it.
3. The visitor creates the first admin account only for that verified company.
4. The dashboard provides a Stripe-hosted **Manage subscription** link.
5. Support requests open an email addressed to the CompCleared support address.

## Validation

- Backend tests prove verification rejects missing, unpaid, mismatched, or stale company references and signup rejects an unverified company ID.
- Backend tests prove the portal endpoint requires an authenticated active subscriber and uses that company’s Stripe customer ID.
- Frontend tests/build prove changed copy and support link render.
- Manual sandbox flow: checkout → verification → account setup → dashboard → billing portal URL.
- Separate live validation remains a deliberate owner-approved small real purchase after the live webhook secret has been deployed.

## Risks and operating requirements

- Stripe Billing Portal must be enabled/configured in the live Stripe Dashboard before users can cancel there.
- The owner must monitor `support@compcleared.com` and honor any stated refund policy.
- Existing Terms and Privacy content still requires qualified legal review before broad paid acquisition; this patch removes the most misleading implementation claims but is not legal advice.
