import Anthropic from '@anthropic-ai/sdk';

// Two-stage extraction/scoring pipeline shared by Claims Intelligence
// (consultant-facing) and Claim Score (subcontractor-facing), per the
// "single unified AI pass" decision in the Claim Score scoping doc.
//
// Stage 1 (extractEvents) runs per uploaded document for both products —
// ported from the original Power Automate/OpenAI flow (see
// power-automate-extraction-prompt.md), adapted for Claude. Output schema
// and the four enum fields are unchanged so results still map cleanly onto
// the existing Events / Events Dev Dataverse columns.
//
// Stage 2 (scoreClaim) is Claim Score-only: aggregates a submission's
// extracted events against the subcontractor's free-text question into one
// headline Claim Score. Claims Intelligence has no equivalent second stage
// — consultants browse the raw extracted events directly in the dashboard.

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const MODEL = 'claude-sonnet-4-5';

// Claude sometimes wraps JSON output in markdown code fences (```json ... ```)
// despite being told to return JSON only - strip them before parsing so a
// fenced response doesn't throw "Unexpected token '`'" on JSON.parse.
function parseJsonResponse<T>(text: string): T {
    const fenceMatch = text.trim().match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
    return JSON.parse(fenceMatch ? fenceMatch[1] : text.trim()) as T;
}

// --- Stage 1: per-document event extraction -------------------------------

export const CLAIM_SIGNAL_VALUES = [
  'Delay_Notice',
  'Instruction',
  'Variation',
  'Programme_Impact',
  'Meeting_Discussion',
  'General_Correspondence',
  'Other',
] as const;

export const EVENT_TYPE_VALUES = [
  'Delay',
  'Instruction',
  'Variation',
  'Communication',
  'Other',
] as const;

export const PRIORITY_VALUES = ['High', 'Medium', 'Low'] as const;
export const RELEVANCE_VALUES = ['High', 'Medium', 'Low'] as const;
export const CONFIDENCE_SCORE_VALUES = [90, 60, 30] as const;

export interface ExtractedEvent {
  eventSummary: string;
  claimSignal: (typeof CLAIM_SIGNAL_VALUES)[number];
  confidenceScore: (typeof CONFIDENCE_SCORE_VALUES)[number];
  eventDate: string; // ISO YYYY-MM-DD, or '' if not explicit
  eventType: (typeof EVENT_TYPE_VALUES)[number];
  evidenceQuote: string;
  priority: (typeof PRIORITY_VALUES)[number];
  relevance: (typeof RELEVANCE_VALUES)[number];
}

export interface DocumentInput {
  documentName: string;
  documentType?: string;
  sender?: string;
  documentDated?: string;
  extractedText: string;
}

const EXTRACTION_SYSTEM_PROMPT = `You are an assistant helping construction claims consultants analyse project correspondence.

TASK
Extract discrete EVENTS for a claims chronology from a construction document.

DEFINITION OF AN EVENT
An event is any statement that has contractual, programme, cost, or operational significance and would reasonably be recorded in a project timeline.

You MUST extract events where the document includes:
- Delay notices or statements of delay
- Any statement that progress is being delayed or impacted
- References to Relevant Events or contractual entitlement
- Instructions or directions
- Variations or scope changes
- Weather, site, or ground conditions affecting progress
- Programme disruption or productivity issues
- Formal notices or contractual correspondence

CRITICAL RULE
If a document states that progress is being delayed or impacted, this MUST be treated as an event even if not explicitly labelled. Do not ignore clear delay language. Do not invent information — only extract what is explicitly supported by the text.

If no relevant event exists, return {"events": []}.

OUTPUT FORMAT (STRICT)
Output valid JSON only. Root object must contain one key, "events", an array. Each event object must contain EXACTLY these fields:
- "eventSummary": max 25 words
- "claimSignal": MUST be EXACTLY one of [${CLAIM_SIGNAL_VALUES.join(', ')}]
- "confidenceScore": MUST be EXACTLY one of [${CONFIDENCE_SCORE_VALUES.join(', ')}]
- "eventDate": ISO format YYYY-MM-DD only. If not explicitly clear, return ""
- "eventType": MUST be EXACTLY one of [${EVENT_TYPE_VALUES.join(', ')}]
- "evidenceQuote": max 30 words, exact excerpt from the document
- "priority": MUST be EXACTLY one of [${PRIORITY_VALUES.join(', ')}]
- "relevance": MUST be EXACTLY one of [${RELEVANCE_VALUES.join(', ')}]

ENUM CONSTRAINTS (apply only to claimSignal, eventType, priority, relevance)
Values must match exactly as written above. Do not add extra words, change casing, use synonyms, or invent new values. If unsure, choose the closest valid value from the list.

No commentary, no extra fields, no duplication. Always return events where delay or impact language exists.`;

export async function extractEvents(doc: DocumentInput): Promise<ExtractedEvent[]> {
  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2048,
    temperature: 0,
    system: EXTRACTION_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: [
          `Document Name: ${doc.documentName}`,
          doc.documentType ? `Document Type: ${doc.documentType}` : null,
          doc.sender ? `Sender: ${doc.sender}` : null,
          doc.documentDated ? `Document Dated: ${doc.documentDated}` : null,
          `Text Extraction: ${doc.extractedText}`,
        ]
          .filter(Boolean)
          .join('\n'),
      },
    ],
  });

  const text = message.content.find((b) => b.type === 'text')?.text ?? '{"events":[]}';
  const parsed = parseJsonResponse<{ events: ExtractedEvent[] }>(text);
  return parsed.events;
}

// --- Stage 2: Claim Score aggregation (Claim Score only) -------------------

export const CLAIM_SCORE_BANDS = [
  { min: 80, max: 100, label: 'Strong' },
  { min: 55, max: 79, label: 'Moderate' },
  { min: 30, max: 54, label: 'Weak' },
  { min: 0, max: 29, label: 'Very Weak' },
] as const;

export function bandForScore(score: number): string {
  return CLAIM_SCORE_BANDS.find((b) => score >= b.min && score <= b.max)?.label ?? 'Unknown';
}

export interface ClaimScoreResult {
  score: number; // 0-100, band is derived in code via bandForScore(), never asked of the model
  summary: string; // 2-4 sentence plain-English explanation for the subcontractor
  keySupportingEvents: string[]; // short refs back into the submission's extracted events, strongest evidence first
}

const SCORING_SYSTEM_PROMPT = `You are an assistant helping a subcontractor understand their contractual/claims position, based on events already extracted from their uploaded subcontract T&Cs and correspondence.

You will be given the subcontractor's question and a list of extracted events (each with a summary, claim signal, event type, priority, relevance, confidence, an evidence quote, and its source document).

TASK
Answer the subcontractor's question by rating, on a 0-100 scale, how strongly the extracted evidence supports their position. This is a holistic judgement, not a formula — weigh event relevance, priority, and confidence together, and give more weight to events that are directly on-point for the question asked.

OUTPUT FORMAT (STRICT)
Output valid JSON only, with exactly these fields:
- "score": an integer 0-100
- "summary": 2-4 plain-English sentences (no jargon) explaining the rating directly to the subcontractor, referencing specific evidence
- "keySupportingEvents": an array of up to 5 short strings, each pointing to one specific event that most influenced the score (paraphrase the event, do not just repeat the evidence quote verbatim)

Do not invent evidence. If the extracted events don't clearly address the question, say so plainly in the summary and score accordingly low. No commentary outside the JSON.`;

export interface ScoreClaimInput {
  userQuestion: string;
  events: Array<
    ExtractedEvent & { documentName: string }
  >;
}

export async function scoreClaim(input: ScoreClaimInput): Promise<ClaimScoreResult> {
  const eventsBlock = input.events
    .map(
      (e, i) =>
        `${i + 1}. [${e.documentName}] ${e.eventSummary} — claimSignal: ${e.claimSignal}, eventType: ${e.eventType}, priority: ${e.priority}, relevance: ${e.relevance}, confidence: ${e.confidenceScore}, date: ${e.eventDate || 'unknown'}\n   Evidence: "${e.evidenceQuote}"`
    )
    .join('\n');

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1024,
    temperature: 0,
    system: SCORING_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Question: ${input.userQuestion}\n\nExtracted events:\n${eventsBlock || '(none extracted)'}`,
      },
    ],
  });

  const text = message.content.find((b) => b.type === 'text')?.text ?? '{}';
  const parsed = parseJsonResponse<Omit<ClaimScoreResult, 'score'> & { score: number }>(text);
  return parsed;
}
