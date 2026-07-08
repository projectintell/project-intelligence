// Claim Score tiers — per build-decisions.md (confirmed 2026-07-07).
// First-pass pricing, not yet validated against real AI processing cost
// or ad conversion data (see scoping doc "Open items").
export const CLAIM_SCORE_TIERS = [
  { id: 'snapshot', name: 'Snapshot', pages: 150, approxDocs: 10, price: 79, withConsultant: 67 },
  { id: 'standard', name: 'Standard', pages: 750, approxDocs: 50, price: 199, withConsultant: 169 },
  { id: 'full-review', name: 'Full Review', pages: 1500, approxDocs: 100, price: 349, withConsultant: 297 },
] as const;

export const CLAIMS_INTELLIGENCE_PRICE_PER_USER = 199; // £/month, placeholder
