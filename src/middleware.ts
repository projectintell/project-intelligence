import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Gates the two authenticated areas of the app. Both Claims Intelligence
// (Microsoft/Azure AD login, see lib/auth.ts) and Claim Score (custom
// magic-link, see lib/magic-link.ts) end up as a NextAuth-shaped JWT
// session cookie signed with the same NEXTAUTH_SECRET, so getToken() here
// reads both uniformly regardless of which flow issued it.

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

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
// than relying on the wildcard alone to cover both cases.
export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/claim-score/upload',
    '/claim-score/upload/:path*',
    '/claim-score/results',
    '/claim-score/results/:path*',
    '/claim-score/api/upload',
    '/claim-score/api/upload/:path*',
    '/claim-score/api/process',
    '/claim-score/api/process/:path*',
  ],
};
