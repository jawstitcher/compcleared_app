# CompCleared Production Deployment Guide

CompCleared is deployed as:

- Frontend: Vercel
- Backend: Railway
- Payments: Stripe Checkout subscriptions
- Database: Postgres via `DATABASE_URL`

Current pricing:

- Free exposure check + public resource center
- CompCleared Pro Monthly: $19/month
- CompCleared Pro Annual: $149/year

Do not use the old $49/$99/$199 tier setup. Do not use the old $9/$79 test products for production.

## 1. Stripe setup

In Stripe Dashboard, use either Test mode for testing or Live mode for real payments. Create the products in the mode you are actually deploying.

Create two recurring prices:

### CompCleared Pro Monthly

- Name: `CompCleared Pro Monthly`
- Price: `$19.00 USD`
- Billing: recurring monthly
- Copy the Price ID: `price_...`

### CompCleared Pro Annual

- Name: `CompCleared Pro Annual`
- Price: `$149.00 USD`
- Billing: recurring yearly
- Copy the Price ID: `price_...`

## 2. Stripe API keys

Stripe Dashboard → Developers → API keys:

- Publishable key: `pk_test_...` or `pk_live_...`
- Secret key: `sk_test_...` or `sk_live_...`

Never commit or paste the secret key into chat.

## 3. Stripe webhook

Stripe Dashboard → Developers → Webhooks → Add endpoint:

```text
https://YOUR-RAILWAY-BACKEND-URL/api/webhook
```

Events:

- `checkout.session.completed`
- `customer.subscription.deleted`

Copy the signing secret:

```text
whsec_...
```

Never commit or paste the webhook secret into chat.

## 4. Railway backend variables

Set these in Railway → Variables:

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

After setting variables, redeploy Railway.

## 5. Vercel frontend variables

Set these in Vercel → Project Settings → Environment Variables:

```text
REACT_APP_API_URL=https://YOUR-RAILWAY-BACKEND-URL
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_or_pk_live_...
```

After changing variables, redeploy Vercel.

## 6. Verify backend

Check:

```text
https://YOUR-RAILWAY-BACKEND-URL/api/health
```

Expected JSON:

```json
{"status":"ok","service":"CompCleared SB 553"}
```

## 7. Test checkout

In test mode, use Stripe card:

```text
4242 4242 4242 4242
```

Any future expiry, any CVC, any ZIP.

Flow to test:

1. Go to `https://compcleared.com/signup`.
2. Select monthly or annual.
3. Submit company info.
4. Confirm Stripe Checkout opens at the correct price.
5. Complete payment.
6. Confirm redirect back to CompCleared.
7. Create account.
8. Confirm dashboard loads.
9. Confirm company subscription status is active.

## 8. Going live

When ready to accept real money:

1. Switch Stripe Dashboard to Live mode.
2. Create live $19/month and $149/year prices.
3. Set Railway `STRIPE_SECRET_KEY=sk_live_...`.
4. Set Railway live `STRIPE_PRICE_MONTHLY` and `STRIPE_PRICE_ANNUAL`.
5. Set Railway live `STRIPE_WEBHOOK_SECRET`.
6. Set Vercel `REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...`.
7. Redeploy Railway and Vercel.
8. Run a real low-dollar card test if needed, then refund it.

## 9. Common issues

### Stripe checkout fails

Check Railway variables:

- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_MONTHLY`
- `STRIPE_PRICE_ANNUAL`
- `FRONTEND_URL`

Also check Railway logs for Stripe API errors.

### Redirect or cookie issues

Check:

- `FRONTEND_URL=https://compcleared.com`
- backend CORS allows `https://compcleared.com`
- browser is not blocking third-party cookies during test

### Webhook does not update subscription status

Check:

- webhook URL points to Railway backend `/api/webhook`
- selected events include `checkout.session.completed`
- `STRIPE_WEBHOOK_SECRET` matches the same endpoint/mode
- test mode webhook secret is not mixed with live mode keys

## 10. Production safety notes

- Do not hardcode live Stripe keys or Price IDs in code.
- Keep live secrets only in Railway/Vercel dashboards.
- Rotate any secret that was pasted into chat, docs, git, or screenshots.
- Terms and Privacy currently exist, but should be replaced/reviewed before scaling paid traffic.
- One-click cancellation is promised in the copy; make sure the account UI supports it before broad marketing.

