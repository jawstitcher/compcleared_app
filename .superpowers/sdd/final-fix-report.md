# Final launch-safety review fixes

## Security and payment state

- Added `credentials: 'include'` to the returning Checkout verification request and a React regression test for it.
- Replaced the cookie-only verified-company marker with `checkout_authorizations`, a database-backed authorization keyed by Stripe Checkout session ID. The table is initialized with `CREATE TABLE IF NOT EXISTS` and a repeat-safe `ALTER TABLE ... ADD COLUMN IF NOT EXISTS consumed_at` migration.
- Checkout authorizations expire after 30 minutes and are consumed through `UPDATE ... SET consumed_at = NOW() ... RETURNING` in the same transaction as first-user creation. A consumed Checkout session cannot be reauthorized by a later browser callback.
- Browser verification accepts either a pending company or a webhook-activated company with the same Stripe subscription. It rejects canceled and mismatched companies.
- Subscription-deletion events are retained in `canceled_stripe_subscriptions`, including cancellation-before-checkout ordering. Both browser verification and the Checkout webhook consult it; the webhook also activates only pending companies. A delayed or retried Checkout webhook therefore cannot reactivate a canceled company.
- Browser verification, Checkout completion, and subscription deletion each take the same transaction-scoped PostgreSQL advisory lock keyed by Stripe subscription ID. This serializes their cancellation check/update sequence and closes the concurrent cancellation-versus-verification race.

## Public copy

- Removed remaining 14-day money-back language and the unrestricted PDF-export promise from the landing and Terms pages.
- Removed the About-page regulatory-alert-email promise and narrowed landing export language to available PDF records.

## Test coverage

- Backend mocked tests cover unpaid, missing, mismatched, and stale authorization cases; schema initialization; successful first signup; one-time consumption; webhook-before-browser verification; and cancellation followed by duplicate Checkout webhooks, including the shared transaction lock.
- React tests cover returning Checkout cookies and the narrowed public-copy language.

## Verification

```text
python3 -m pytest backend/test_app.py -q       # 12 passed
CI=true npm test -- --watchAll=false           # 6 suites, 9 tests passed
CI=true npm run build                          # compiled successfully
```

The React test suite retains existing React Router future-flag warnings; they are warnings only.
