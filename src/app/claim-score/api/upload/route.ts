import { NextRequest, NextResponse } from 'next/server';
import { uploadSubmissionFile } from '@/lib/blob';

// Receives a document upload for a Claim Score submission and stores it
// in Vercel Blob under the submission's folder. TODO: trigger the
// extraction pipeline (lib/claude.ts) once both boxes (T&Cs +
// correspondence) have at least one file.
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get('file') as File | null;
  const submissionId = form.get('submissionId') as string | null;
  const box = form.get('box') as string | null; // 'terms' | 'correspondence'

  if (!file || !submissionId || !box) {
    return NextResponse.json({ error: 'Missing file, submissionId or box' }, { status: 400 });
  }

  const blob = await uploadSubmissionFile(submissionId, box, file);
  return NextResponse.json({ url: blob.url });
}
