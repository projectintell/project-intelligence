import { NextRequest, NextResponse } from 'next/server';
import { uploadSubmissionFile } from '@/lib/blob';
import { checkSubmissionAccess } from '@/lib/claim-score-access';

// Receives a document upload for a Claim Score submission and stores it
// in Vercel Blob under the submission's folder. TODO: trigger the
// extraction pipeline (lib/claude.ts) once both boxes (T&Cs +
// correspondence) have at least one file.
//
// Security fix (2026-07-18): this route previously had no auth check of its
// own (middleware.ts's matcher didn't cover /claim-score/api/*, and even
// with that fixed, middleware only proves *a* subcontractor is signed in —
// not that they own this specific submissionId). checkSubmissionAccess()
// confirms both. `box` is also now checked against the two real values —
// it was previously any client-supplied string, feeding straight into the
// Blob storage path.
const ALLOWED_BOXES = ['terms', 'correspondence'] as const;

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get('file') as File | null;
  const submissionId = form.get('submissionId') as string | null;
  const box = form.get('box') as string | null; // 'terms' | 'correspondence'

  if (!file || !submissionId || !box) {
    return NextResponse.json({ error: 'Missing file, submissionId or box' }, { status: 400 });
  }

  if (!ALLOWED_BOXES.includes(box as (typeof ALLOWED_BOXES)[number])) {
    return NextResponse.json({ error: 'Invalid box' }, { status: 400 });
  }

  const access = await checkSubmissionAccess(submissionId);
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  const blob = await uploadSubmissionFile(submissionId, box, file);
  return NextResponse.json({ url: blob.url });
}
