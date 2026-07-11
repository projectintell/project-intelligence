import { NextRequest, NextResponse } from 'next/server';
import {
  verifyMagicLinkToken,
  mintSubcontractorSessionToken,
  SESSION_COOKIE_NAME,
} from '@/lib/magic-link';

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
  const destination = payload.submissionId
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
