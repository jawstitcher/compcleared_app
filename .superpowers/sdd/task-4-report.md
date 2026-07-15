# Task 4 Report: Public copy and legal consistency

## Changes

- Removed unsupported alerts, hosted-retention, locked-rate, and priority-support claims from signup and pricing.
- Directed paid users to Stripe Checkout and free users to the readiness check.
- Replaced penalty and attorney cost comparisons, tax copy, and cancellation/data FAQs with the approved Stripe and support guidance.
- Updated Terms and Privacy contact addresses to `support@compcleared.com` and removed unsupported renewal-reminder, confirmation-email, automatic-deletion, encryption, GPC, and compliance claims.
- Kept the conspicuous not-legal-advice statement in the Terms.
- Added a PricingPage regression test covering unsupported automated claims and Stripe subscription guidance.

## Verification

- `CI=true npm test -- PricingPage.test.js --watchAll=false` (red before copy changes, green after)
- `CI=true npm test -- --watchAll=false` — 4 suites passed, 5 tests passed
- `CI=true npm run build` — production build compiled successfully

## Note

The test suite emits existing React Router v7 future-flag warnings; they do not cause failures.

## Review findings resolution

- Removed all public 14-day money-back guarantee and full-refund promises from Signup, Pricing, and Terms. Each page now directs billing or refund questions to `support@compcleared.com` without promising an outcome.
- Removed unimplemented email-announcement promises for material Terms and Privacy Policy updates; each page now states that material updates are posted on that page.
- Added `PublicCopy.test.js` coverage for the revised billing/refund and policy-update copy.

## Review verification

- `CI=true npm test -- PublicCopy.test.js --watchAll=false` — 1 suite passed, 2 tests passed.
- `CI=true npm test -- --watchAll=false` — 5 suites passed, 7 tests passed.
- `CI=true npm run build` — production build compiled successfully.
