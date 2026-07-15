# CompCleared Quick Start

## Current pricing

- Free: SB 553 readiness check + public resources
- Pro Monthly: $19/month
- Pro Annual: $149/year

Do not use the old $49/$99/$199 tier docs. The product is now one paid plan with monthly or annual billing.

## What you need

1. Stripe account
   - Live or test API keys
   - One $19/month recurring Price ID
   - One $149/year recurring Price ID
   - Webhook signing secret

2. Railway backend
   - Backend service live
   - Postgres/DATABASE_URL configured
   - Stripe env vars configured

3. Vercel frontend
   - Frontend deployed from GitHub
   - API URL pointed at Railway
   - Stripe publishable key configured

## Stripe setup

In Stripe Dashboard, create these two prices in the same mode you are using for deployment:

- CompCleared Pro Monthly
  - $19.00 USD
  - Recurring monthly

- CompCleared Pro Annual
  - $149.00 USD
  - Recurring yearly

Copy both Price IDs. They start with `price_...`.

Webhook endpoint:

```text
https://YOUR-RAILWAY-BACKEND-URL/api/webhook
```

Webhook events:

- `checkout.session.completed`
- `customer.subscription.deleted`

Copy the webhook signing secret. It starts with `whsec_...`.

## Railway backend env vars

Set these in Railway, not in this repo:

```text
DATABASE_URL=postgresql://...
SECRET_KEY=<32+ char random string>
FRONTEND_URL=https://compcleared.com
STRIPE_SECRET_KEY=sk_test_or_sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_MONTHLY=price_...   # $19/month
STRIPE_PRICE_ANNUAL=price_...    # $149/year
```

Generate `SECRET_KEY` locally:

```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

## Vercel frontend env vars

Set these in Vercel:

```text
REACT_APP_API_URL=https://YOUR-RAILWAY-BACKEND-URL
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_or_pk_live...
```

## Test checkout

If using Stripe test mode, use:

- Card: `4242 4242 4242 4242`
- Expiry: any future date
- CVC: any 3 digits
- ZIP: any 5 digits

Then verify:

1. `/api/health` returns OK on the Railway backend.
2. `/signup` creates a Stripe Checkout session.
3. Successful checkout redirects back to CompCleared.
4. Account creation works.
5. Dashboard loads.

## Going live

When ready for real payments:

1. Switch Stripe Dashboard to Live mode.
2. Create the same $19/month and $149/year live prices.
3. Replace Railway `STRIPE_SECRET_KEY` with `sk_live_...`.
4. Replace Railway `STRIPE_PRICE_MONTHLY` and `STRIPE_PRICE_ANNUAL` with the live `price_...` IDs.
5. Replace Railway `STRIPE_WEBHOOK_SECRET` with the live webhook secret.
6. Replace Vercel `REACT_APP_STRIPE_PUBLISHABLE_KEY` with `pk_live_...`.
7. Redeploy Railway and Vercel if they do not auto-redeploy after env changes.

Never paste `sk_live_`, `whsec_`, or database URLs into chat.

### Live billing readiness

- Railway `STRIPE_SECRET_KEY` begins with `sk_live_`.
- Railway `STRIPE_PRICE_MONTHLY` and `STRIPE_PRICE_ANNUAL` match live-mode Stripe Price IDs.
- Railway `STRIPE_WEBHOOK_SECRET` is copied from the active live webhook destination.
- Railway changes are deployed and `/api/health` returns 200.
- Stripe Billing Portal is configured to allow subscription cancellation.
- Do not make a live charge without explicit owner authorization.

Open `/signup`, select each plan, and stop when Stripe opens Checkout. Confirm it is live mode and shows the intended product, price, and billing interval. Do not enter a card during this no-charge check.

After the owner authorizes a small real purchase, confirm the live webhook delivery succeeds, the company activates, and the Stripe Billing Portal opens. Refund/cancel through the portal only after recording the result.
