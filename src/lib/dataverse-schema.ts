// Table + Choice-value constants pulled from dataverse-schema-reference.md
// (pulled via Power Apps maker portal on 2026-07-07). Re-verify against
// the live environment with describe_table before relying on these for
// anything beyond initial scaffolding — Choice values in particular are
// environment-specific and only Claim Signal + Event Type were confirmed
// so far; Priority/Relevance/ReviewStatus/Product/Source/DocumentType/
// Status still need pulling the same way.

export const DATAVERSE_TABLES = {
  casesDev: 'cr3ed_casesdevs', // entity set name (plural) for Web API calls
  documentsDev: 'cr3ed_documentsdevs',
  eventsDev: 'cr3ed_eventsdevs',
} as const;

// Choice: Claim Signal (global choice, synced)
export const CLAIM_SIGNAL = {
  DelayNotice: 326840000,
  Instruction: 326840001,
  Variation: 326840002,
  ProgrammeImpact: 326840003,
  MeetingDiscussion: 326840004,
  GeneralCorrespondence: 326840005,
  Other: 326840006,
} as const;

// Choice: Event Type (global choice, synced)
export const EVENT_TYPE = {
  Delay: 326840000,
  Instruction: 326840001,
  Variation: 326840002,
  Communication: 326840003,
  Other: 326840004,
} as const;

// TODO: Priority (High/Medium/Low, 326840000-326840002 per the schema
// reference note — confirm via Edit choice, there are 3 "Priority" global
// choices in the environment), Relevance, ReviewStatus, Product Tag,
// Source Tag, Document Type, Status — pull values before wiring up any
// UI that needs to display or set these as human-readable labels.
