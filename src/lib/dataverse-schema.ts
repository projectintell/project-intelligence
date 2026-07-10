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

// Choice: Priority / Relevance (High/Medium/Low — same numbering convention)
export const PRIORITY = { High: 326840000, Medium: 326840001, Low: 326840002 } as const;
export const RELEVANCE = { High: 326840000, Medium: 326840001, Low: 326840002 } as const;

// Choice: ReviewStatus (Events Dev, local choice)
export const REVIEW_STATUS = { Pending: 326840000, Accepted: 326840001, Rejected: 326840002 } as const;

// Choice: Status (Cases Dev, local choice)
export const STATUS = { Open: 326840000, Closed: 326840001, OnHold: 326840002 } as const;

// Choice: Document Type (Documents Dev, local choice)
export const DOCUMENT_TYPE = { Email: 326840000, PDF: 326840001, WordDocument: 326840002, Other: 326840003 } as const;

// Choice: Product Tag (global choice, synced) — which Project Intelligence
// module a Case/Document/Event row belongs to.
export const PRODUCT_TAG = {
  ClaimsIntelligence: 100000000,
  ClaimScore: 100000001,
  DueDiligence: 100000002,
  ManagementIntelligence: 100000003,
  ContractIntelligence: 100000004,
} as const;

// Choice: Source Tag (global choice, synced) — who the Case/Document/Event
// row came from.
export const SOURCE_TAG = {
  ClaimsConsultant: 100000000,
  Subcontractor: 100000001,
  Contractor: 100000002,
  PrivateEquity: 100000003,
  Lawyer: 100000004,
} as const;

/** Maps a text-extraction-detected file kind to the Document Type choice value. */
export function documentTypeForKind(kind: 'email' | 'pdf' | 'docx' | 'other'): number {
  switch (kind) {
    case 'email':
      return DOCUMENT_TYPE.Email;
    case 'pdf':
      return DOCUMENT_TYPE.PDF;
    case 'docx':
      return DOCUMENT_TYPE.WordDocument;
    default:
      return DOCUMENT_TYPE.Other;
  }
}
