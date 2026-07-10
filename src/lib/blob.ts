import { put, list } from '@vercel/blob';
import type { ClaimScoreResult } from './claude';

// Vercel Blob storage for Claim Score. Path convention mirrors the
// SharePoint Incoming/Processed pattern from the scoping doc:
//   claim-score/{submissionId}/{box}/{filename}   — uploaded documents
//   claim-score/{submissionId}/meta.json           — checkout/contact info (written by the webhook)
//   claim-score/{submissionId}/result.json         — final score (written by the process route)
//
// Blob (not new Dataverse columns) is deliberately used for this
// operational/throwaway metadata — see build-decisions.md "Document
// processing pipeline" entry for why: it keeps the Dev Dataverse tables
// scoped to their actual purpose (the extraction/scoring audit trail)
// without a schema change before the flow's even been tested end to end.

export async function uploadSubmissionFile(
  submissionId: string,
  box: string,
  file: File,
) {
  return put(`claim-score/${submissionId}/${box}/${file.name}`, file, {
    access: 'public',
    addRandomSuffix: true,
  });
}

/** Lists every uploaded file across both boxes for a submission. */
export async function listSubmissionFiles(submissionId: string) {
  const { blobs } = await list({ prefix: `claim-score/${submissionId}/` });
  return blobs.filter(
    (b) => !b.pathname.endsWith('/meta.json') && !b.pathname.endsWith('/result.json'),
  );
}

export interface SubmissionMeta {
  tierId: string;
  tierName: string;
  companyName: string;
  contactName?: string;
  contactEmail: string;
  consultantOptIn: boolean;
  marketingConsent: boolean;
  createdAt: string;
}

export async function writeSubmissionMeta(submissionId: string, meta: SubmissionMeta) {
  await put(`claim-score/${submissionId}/meta.json`, JSON.stringify(meta), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function readSubmissionMeta(submissionId: string): Promise<SubmissionMeta | null> {
  const { blobs } = await list({ prefix: `claim-score/${submissionId}/meta.json` });
  const blob = blobs.find((b) => b.pathname === `claim-score/${submissionId}/meta.json`);
  if (!blob) return null;
  const res = await fetch(blob.url, { cache: 'no-store' });
  return res.json();
}

export type SubmissionResult = ClaimScoreResult & { scoreBand: string };

export async function writeSubmissionResult(submissionId: string, result: SubmissionResult) {
  await put(`claim-score/${submissionId}/result.json`, JSON.stringify(result), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function readSubmissionResult(submissionId: string): Promise<SubmissionResult | null> {
  const { blobs } = await list({ prefix: `claim-score/${submissionId}/result.json` });
  const blob = blobs.find((b) => b.pathname === `claim-score/${submissionId}/result.json`);
  if (!blob) return null;
  const res = await fetch(blob.url, { cache: 'no-store' });
  return res.json();
}
