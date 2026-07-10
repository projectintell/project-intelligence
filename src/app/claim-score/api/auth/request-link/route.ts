import { NextRequest, NextResponse } from 'next/server';
import { sendMagicLinkEmail } from '@/lib/magic-link';

// TODO before launch: rate-limit this endpoint (e.g. a Vercel Firewall
// rate rule) so it can't be used to spam arbitrary email addresses with
// sign-in links.
export async function POST(req: NextRequest) {
  const { email, submissionId } = await req.json();

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  await sendMagicLinkEmail(email, submissionId);

  // Always return ok, even if the email send fails validation upstream —
  // avoids leaking whether a given address has a submission on file.
  return NextResponse.json({ ok: true });
}
