import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Gates the two authenticated areas of the app. Both Claims Intelligence
// (Microsoft/Azure AD login, see lib/auth.ts) and Claim Score (custom
// magic-link, see lib/magic-link.ts) end up as a NextAuth-shaped JWT
// session cookie signed with the same NEXTAUTH_SECRET, so getToken() here
// reads both uniformly regardless of which flow issued it.

// Kill switch (2026-07-18): Tim asked to stop anyone from being able to run
// Claim Score at all, for now — decided against paying for Vercel's
// password-protection add-on (~$170/mo minimum) to gate the whole site, so
// this is the narrower option instead. While true, every request under
// /claim-score (page or API, checkout included) is intercepted right here,
// before any other logic, and gets a 503 "temporarily unavailable" response.
// Marketing site and the Claims Intelligence dashboard are untouched.
// To restore normal service: set this back to false, commit, push — no
// other changes needed, all the auth/ownership logic below is untouched
// and will resume working exactly as before.
const CLAIM_SCORE_DISABLED = true;

function claimScoreUnavailableResponse(pathname: string): NextResponse {
  const isApiRoute = pathname.startsWith('/claim-score/api/');
  const headers = { 'Cache-Control': 'no-store' };

  if (isApiRoute) {
    return NextResponse.json(
      { error: 'Claim Score is temporarily unavailable. Please check back soon.' },
      { status: 503, headers },
    );
  }

  return new NextResponse(
    `<!doctype html>
<html lang="en">
<head><meta charset="utf-8" /><title>Claim Score — temporarily unavailable</title></head>
<body style="font-family: system-ui, sans-serif; max-width: 32rem; margin: 6rem auto; padding: 0 1.5rem; color: #1e293b;">
  <h1 style="font-size: 1.5rem; font-weight: 700;">Claim Score is temporarily unavailable</h1>
  <p style="color: #64748b;">We've taken Claim Score offline for a short maintenance window. Please check back soon — no action is needed on your part.</p>
</body>
</html>`,
    { status: 503, headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' } },
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (CLAIM_SCORE_DISABLED && pathname.startsWith('/claim-score')) {
    return claimScoreUnavailableResponse(pathname);
  }

  const isDashboardRoute = pathname.startsWith('/dashboard') && pathname !== '/dashboard/signin';
  const isClaimScorePageRoute =
    pathname.startsWith('/claim-score/upload') || pathname.startsWith('/claim-score/results');
  // Security fix (2026-07-18): these API routes were NOT covered by the page
  // matcher below — /claim-score/api/upload and /claim-score/api/process do
  // the actual file-upload and Claude/Dataverse processing work, and had zero
  // session check of their own. Anyone with a submissionId (visible in the
  // browser URL as ?session_id=) could call them directly with no sign-in at
  // all. Gated here explicitly, separately from the page routes, because an
  // unauthenticated fetch() should get a 401 JSON response, not a redirect to
  // an HTML sign-in page (which `fetch` would otherwise follow and treat as a
  // 200 OK, masking the failure from the calling client code).
  const isClaimScoreApiRoute =
    pathname.startsWith('/claim-score/api/upload') || pathname.startsWith('/claim-score/api/process');

  if (!isDashboardRoute && !isClaimScorePageRoute && !isClaimScoreApiRoute) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (isDashboardRoute && token?.userType !== 'consultant') {
    return NextResponse.redirect(new URL('/dashboard/signin', req.url));
  }

  if (isClaimScorePageRoute && token?.userType !== 'subcontractor') {
    const signInUrl = new URL('/claim-score/signin', req.url);
    signInUrl.searchParams.set('callbackUrl', pathname + req.nextUrl.search);
    return NextResponse.redirect(signInUrl);
  }

  if (isClaimScoreApiRoute && token?.userType !== 'subcontractor') {
    return NextResponse.json({ error: 'Unauthorized — please sign in.' }, { status: 401 });
  }

  return NextResponse.next();
}

// Next.js's matcher `:path*` segment does NOT reliably match the bare parent
// route (confirmed live, session 9/10 — e.g. Stripe's success_url lands on
// the bare `/claim-score/upload`, not `/claim-score/upload/something`, and
// the middleware function above never ran at all for that request). Each
// protected route is listed twice — once bare, once with `/:path*` — rather
// than relying on the wildcard alone to cover both cases. The broad
// '/claim-score' + '/claim-score/:path*' pair added for the kill switch
// above is a backstop across the whole tree, but every individual route is
// still listed explicitly too, given that exact matcher quirk has already
// bitten this project once — not worth the risk of one route slipping
// through un-blocked while CLAIM_SCORE_DISABLED is true.
export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/claim-score',
    '/claim-score/:path*',
    '/claim-score/signin',
    '/claim-score/upload',
    '/claim-score/upload/:path*',
    '/claim-score/results',
    '/claim-score/results/:path*',
    '/claim-score/api/checkout',
    '/claim-score/api/webhook',
    '/claim-score/api/upload',
    '/claim-score/api/upload/:path*',
    '/claim-score/api/process',
    '/claim-score/api/process/:path*',
    '/claim-score/api/auth/request-link',
    '/claim-score/api/auth/verify',
  ],
};
