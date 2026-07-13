// Types for the cloned Dev tables in the "timothy richmond's Environment"
// Dataverse org (orgb33c59e1.crm11.dynamics.com). Mirrors the schema in
// dataverse-schema-reference.md. These are the safe-to-read-write Dev
// clones (cr3ed_casesdev / cr3ed_documentsdev / cr3ed_eventsdev) - not the
// live production Cases/Documents/Events tables.

export interface CaseDevRecord {
  cr3ed_casesdevid?: string;
  cr3ed_CaseID: string;
  cr3ed_CaseName: string;
  cr3ed_ClientName: string;
  cr3ed_Description?: string;
  cr3ed_Product?: number; // Choice: Product Tag
cr3ed_Source?: number; // Choice: Source Tag
cr3ed_StartDate?: string;
  cr3ed_Status?: number;
  // Added 2026-07-13 for dashboard access scoping (see
  // dashboard/page.tsx) — minimal first pass of the agreed Organization/
  // per-case-allocation model. Not yet written by any code path; Tim
  // populates these by hand in Power Apps per Case for now.
  cr3ed_OrganizationName?: string;
  cr3ed_AllowedUsers?: string; // semicolon-separated list of emails
}

export interface DocumentDevRecord {
  cr3ed_documentsdevid?: string;
  'cr3ed_Case@odata.bind'?: string; // lookup -> Cases Dev
cr3ed_DocumentName: string;
// Confirmed live in Power Apps maker portal: schema name is
// cr3ed_DateIngested, not cr3ed_Date - the dataverse-schema-reference.md
// doc and this interface both had it wrong, which 400'd every Documents
// Dev write until caught via a real submission.
cr3ed_DateIngested?: string; // Date Ingested
cr3ed_DocumentDated?: string;
cr3ed_DocumentType?: number;
cr3ed_ExtractedText?: string;
cr3ed_FileLink?: string;
cr3ed_FileLink2?: string;
cr3ed_Processed?: boolean;
cr3ed_Product?: number;
cr3ed_Sender?: string;
cr3ed_Source?: number;
cr3ed_SourceEmailID?: string;
cr3ed_TextExtraction?: string;
}

export interface EventDevRecord {
  cr3ed_eventsdevid?: string;
  'cr3ed_Case@odata.bind'?: string; // lookup -> Cases Dev
// NOTE: there is no lookup relationship from Events Dev to Documents Dev
// in the live schema (confirmed via the table's Relationships list in
// Power Apps maker portal) - only a plain-text cr3ed_DocName/
// cr3ed_DocumentLink pair. A 'cr3ed_Document@odata.bind' property here
// would 400 with an undeclared-navigation-property error.
// Confirmed live: the primary field is cr3ed_EventName, not
// cr3ed_EventSummary - this interface and dataverse-schema-reference.md
// both had the wrong name, which 400'd every Events Dev write.
cr3ed_EventName: string; // primary field
cr3ed_ClaimSignal?: number; // Choice: see CLAIM_SIGNAL in dataverse-schema.ts
cr3ed_ClaimSignal2RAW?: string; // raw AI label before normalisation
cr3ed_ConfidenceScore?: number;
cr3ed_DocName?: string;
cr3ed_DocumentLink?: string;
cr3ed_EventDate?: string;
cr3ed_EventType?: number; // Choice: see EVENT_TYPE in dataverse-schema.ts
cr3ed_EventType2RAW?: string;
cr3ed_EventHash?: string;
cr3ed_EventKey?: string;
cr3ed_EvidenceQuote?: string;
cr3ed_Priority?: number;
cr3ed_Priority2RAW?: string;
cr3ed_Product?: number;
cr3ed_Relevance?: number;
cr3ed_Relevance2RAW?: string;
'cr3ed_ReviewedBy@odata.bind'?: string; // lookup -> systemuser
cr3ed_ReviewedOn?: string;
cr3ed_ReviewNotes?: string;
cr3ed_ReviewStatus?: number;
cr3ed_Source?: number;
cr3ed_SourceText?: string;
}
