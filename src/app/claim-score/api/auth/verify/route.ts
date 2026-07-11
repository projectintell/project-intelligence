import { NextRequest, NextResponse } from 'next/server';
import {
  verifyMagicLinkToken,
  mintSubcontractorSessionToken,
  SESSION_COOKIE_NAME,
} from '@/lib/magic-link';

// Only trust a callbackUrl that points back into the two claim-score
// routes it's meant for — magic-link.ts round-trips this value through a
// signed JWT, but the request-link endpoint that originally set it takes
// arbitrary client input, so it's not safe to redirect to unchecked.
function isSafeCallbackUrl(url: string | undefined): url is string {
  return !!url && (url.startsWith('/claim-score/upload') || url.startsWith('/claim-score/results'));
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.redirect(new URL('/claim-score/signin?error=missing-token', req.url));
  }

const payload = await verifyMagicLinkToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL('/claim-score/signin?error=expired', req.url));
  }

const sessionToken = await mintSubcontractorSessionToken(payload.email);
  const destination = isSafeCallbackUrl(payload.callbackUrl)
  ? payload.callbackUrl
    : payload.submissionId
  ? `/claim-score/results/${payload.submissionId}`
    : '/claim-score/upload';

const res = NextResponse.redirect(new URL(destination, req.url));
  res.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
