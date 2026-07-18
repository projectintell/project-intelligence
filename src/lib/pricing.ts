// Claim Score tiers — per build-decisions.md (confirmed 2026-07-07).
// First-pass pricing, not yet validated against real AI processing cost
// or ad conversion data (see scoping doc "Open items").
//
// stripePriceId / stripePriceIdConsultant reference real Stripe Price
// objects in the test-mode sandbox (Tim set these up directly in Stripe,
// session 1; pulled and wired in session 8 — see handoff-notes.md).
// checkout/route.ts uses these when present and falls back to inline
// price_data otherwise.
//
// Session 8 found Snapshot's consultant price (price_1Tqx8XJoFoQljCXrGbazrRgt)
// wrongly configured as a recurring monthly subscription instead of
// one-time. Session 10: Tim confirmed the fix and passed this same price
// ID back — re-verified live in the Stripe test dashboard before wiring it
// in (per the standing rule not to trust a Price object's config without
// checking): Interval now correctly shows "One-time", £67.00. Safe to use.
export const CLAIM_SCORE_TIERS = [
  {
    id: 'snapshot',
    name: 'Snapshot',
    pages: 150,
    approxDocs: 10,
    price: 79,
    withConsultant: 67,
    stripePriceId: 'price_1Tqx8XJoFoQljCXr7ZbjriLv',
    stripePriceIdConsultant: 'price_1Tqx8XJoFoQljCXrGbazrRgt' as string | null,
  },
  {
    id: 'standard',
    name: 'Standard',
    pages: 750,
    approxDocs: 50,
    price: 199,
    withConsultant: 169,
    stripePriceId: 'price_1Tqx8zJoFoQljCXrBOM1a8py',
    stripePriceIdConsultant: 'price_1TqxA0JoFoQljCXrCH8iCNr4' as string | null,
  },
  {
    id: 'full-review',
    name: 'Full Review',
    pages: 1500,
    approxDocs: 100,
    price: 349,
    withConsultant: 297,
    stripePriceId: 'price_1TqxAnJoFoQljCXrfCZ5LNpM',
    stripePriceIdConsultant: 'price_1TqxBGJoFoQljCXr0PlDdZUi' as string | null,
  },
] as const;

export const CLAIMS_INTELLIGENCE_PRICE_PER_USER = 199; // £/month, placeholder
// Real Stripe Price object for the Claims Intelligence £199/month seat —
// not yet wired into any checkout flow (Claims Intelligence billing
// hasn't been built), kept here so it's not re-discovered from scratch.
export const CLAIMS_INTELLIGENCE_STRIPE_PRICE_ID = 'price_1TqxBzJoFoQljCXr1lwSevDJ';
