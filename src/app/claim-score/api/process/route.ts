import { NextRequest, NextResponse } from 'next/server';
import { extractEvents, scoreClaim, bandForScore, type ExtractedEvent } from '@/lib/claude';
import { notifyConsultantOfLead } from '@/lib/consultant-notify';
import { extractDocumentText } from '@/lib/text-extraction';
import {
  listSubmissionFiles,
  writeSubmissionResult,
} from '@/lib/blob';
import { checkSubmissionAccess } from '@/lib/claim-score-access';
// redeploy trigger: force fresh build after transient Vercel infra failure
import { dataverse } from '@/lib/dataverse';
import { DATAVERSE_TABLES, PRODUCT_TAG, SOURCE_TAG, documentTypeForKind } from '@/lib/dataverse-schema';
import type { CaseDevRecord, DocumentDevRecord, EventDevRecord } from '@/types/dataverse';

// Runs a submission's Claim Score extraction + scoring pipeline end to end:
//   1. Look up the submission's Case (created by the webhook on payment)
//      and its uploaded documents (Vercel Blob).
//   2. Extract text from each document and run extractEvents() (lib/claude.ts),
//      writing a Documents Dev + Events Dev row per document/event.
//   3. Run scoreClaim() over every extracted event, write the result to
//      Blob (claim-score/{id}/result.json — see build-decisions.md for why
//      Blob rather than new Dataverse columns), and — if the subcontractor
//      ticked the consultant opt-in box — email the lead notification.
//
// Processed synchronously with limited concurrency inside one request, per
// build-decisions.md's "Long jobs" call: simplest option, using a longer
// maxDuration rather than a background queue. Revisit only if real testing
// shows Full Review-tier submissions (~100 docs) are too slow.
//
// Correction (session 8): this does NOT require a Vercel Pro upgrade, despite
// earlier session notes assuming it did. Confirmed live in Vercel's project
// settings (Functions tab) that Fluid Compute is enabled on this project, and
// per Vercel's current docs, Fluid Compute raises the Hobby plan's function
// duration ceiling from 60s to the same 300s default Pro gets — so this
// route can already run its full 300s on the Hobby plan it's on today.
// Vercel Pro may still be worth it later for other reasons (custom domains,
// team seats, etc.), but it is not a blocker for real document submissions.
export const maxDuration = 300; // seconds — supported on Hobby via Fluid Compute, see comment above

const EXTRACTION_CONCURRENCY = 5;
const MAX_STORED_TEXT_LENGTH = 4_000; // cr3ed_TextExtraction's Dataverse max character count (raised from 100 to 4000 by Tim; can be raised further later)

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const i = cursor++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

interface DocumentOutcome {
  documentName: string;
  events: Array<ExtractedEvent & { documentName: string }>;
  error?: string;
}

export async function POST(req: NextRequest) {
  const { submissionId, userQuestion } = await req.json();
  if (!submissionId || !userQuestion) {
    return NextResponse.json({ error: 'Missing submissionId or userQuestion' }, { status: 400 });
  }

  // Security fix (2026-07-18): validates submissionId's format — closing off
  // the OData-injection risk in the $filter string below, which previously
  // took this value unvalidated straight from the request body — and
  // confirms the signed-in session actually owns this submission (IDOR fix;
  // see lib/claim-score-access.ts for both).
  const access = await checkSubmissionAccess(submissionId);
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }
  const meta = access.meta;

  // Step 1: case record + documents. submissionId is confirmed well-formed
  // by checkSubmissionAccess above, so it's safe to interpolate here.
  const [caseResult, files] = await Promise.all([
    dataverse.list(
      DATAVERSE_TABLES.casesDev,
      `$filter=cr3ed_caseid eq '${submissionId}'`,
    ) as Promise<{ value: CaseDevRecord[] }>,
    listSubmissionFiles(submissionId),
  ]);

  const caseRecord = caseResult.value[0];
  if (!caseRecord?.cr3ed_casesdevid) {
    return NextResponse.json({ error: 'Submission not found — payment may not be confirmed yet' }, { status: 404 });
  }
  if (files.length === 0) {
    return NextResponse.json({ error: 'No documents uploaded' }, { status: 400 });
  }

  const caseBind = `/${DATAVERSE_TABLES.casesDev}(${caseRecord.cr3ed_casesdevid})`;

  // Step 2: extract + write per document, limited concurrency.
  const outcomes = await mapWithConcurrency(files, EXTRACTION_CONCURRENCY, async (file): Promise<DocumentOutcome> => {
    const filename = file.pathname.split('/').pop() ?? file.pathname;
    try {
      const res = await fetch(file.url, { headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` } });
      const buffer = await res.arrayBuffer();
      const extracted = await extractDocumentText(filename, buffer);

      const docRecord: DocumentDevRecord = {
        'cr3ed_Case@odata.bind': caseBind,
        cr3ed_DocumentName: filename,
        cr3ed_DateIngested: new Date().toISOString(),
        cr3ed_DocumentDated: extracted.documentDated,
        cr3ed_DocumentType: documentTypeForKind(extracted.kind),
        // cr3ed_ExtractedText is defunct (same "2 RAW" pattern as the other
                  // legacy Documents Dev fields) and capped at 100 chars anyway -
                  // confirmed by Tim the original Power Automate flow used
                                    // cr3ed_TextExtraction (max 4,000 chars, raised from 100 by Tim) for the full text.
                  cr3ed_TextExtraction: extracted.text.slice(0, MAX_STORED_TEXT_LENGTH),
        cr3ed_FileLink2: file.url,
        cr3ed_Processed: true,
        cr3ed_Product: PRODUCT_TAG.ClaimScore,
        cr3ed_Sender: extracted.sender,
        cr3ed_Source: SOURCE_TAG.Subcontractor,
      };
await dataverse.create(DATAVERSE_TABLES.documentsDev, docRecord);

      const events = await extractEvents({
        documentName: filename,
        documentType: extracted.kind,
        sender: extracted.sender,
        documentDated: extracted.documentDated,
        extractedText: extracted.text,
      });

      await Promise.all(
        events.map((e) => {
          const eventRecord: EventDevRecord = {
            'cr3ed_Case@odata.bind': caseBind,
                                  cr3ed_EventName: e.eventSummary,
            cr3ed_ClaimSignal2RAW: e.claimSignal,
            cr3ed_ConfidenceScore: e.confidenceScore,
            cr3ed_DocName: filename,
            // Dataverse's cr3ed_EventDate is a Date-and-time column — needs
            // a full ISO datetime, not just the YYYY-MM-DD extractEvents() returns.
            cr3ed_EventDate: e.eventDate ? `${e.eventDate}T00:00:00Z` : undefined,
            cr3ed_EventType2RAW: e.eventType,
            cr3ed_EvidenceQuote: e.evidenceQuote,
            cr3ed_Priority2RAW: e.priority,
            cr3ed_Product: PRODUCT_TAG.ClaimScore,
            cr3ed_Relevance2RAW: e.relevance,
            cr3ed_Source: SOURCE_TAG.Subcontractor,
          };
          return dataverse.create(DATAVERSE_TABLES.eventsDev, eventRecord);
        }),
      );

      return { documentName: filename, events: events.map((e) => ({ ...e, documentName: filename })) };
    } catch (err) {
      return { documentName: filename, events: [], error: err instanceof Error ? err.message : 'Unknown error' };
    }
  });

  const failedDocs = outcomes.filter((o) => o.error);
  const allEvents = outcomes.flatMap((o) => o.events);

  if (allEvents.length === 0 && failedDocs.length === outcomes.length) {
    return NextResponse.json(
      { error: 'Every document failed to process', details: failedDocs },
      { status: 422 },
    );
  }

  // Step 3: score + persist + notify.
  const result = await scoreClaim({ userQuestion, events: allEvents });
  const scoreBand = bandForScore(result.score);

  await writeSubmissionResult(submissionId, { ...result, scoreBand });

  if (meta.consultantOptIn) {
    await notifyConsultantOfLead({
      submissionId,
      companyName: meta.companyName,
      contactName: meta.contactName,
      contactEmail: meta.contactEmail,
      tierName: meta.tierName,
      score: result.score,
      scoreBand,
      scoreSummary: result.summary,
    });
  }

  return NextResponse.json({
    ...result,
    scoreBand,
    documentsProcessed: outcomes.length - failedDocs.length,
    documentsFailed: failedDocs,
  });
}
