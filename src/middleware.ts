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
  const isClaimScoreProtectedRoute =
    pathname.startsWith('/claim-score/upload') || pathname.startsWith('/claim-score/results');

  if (!isDashboardRoute && !isClaimScoreProtectedRoute) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (isDashboardRoute && token?.userType !== 'consultant') {
    return NextResponse.redirect(new URL('/dashboard/signin', req.url));
  }

    if (isClaimScoreProtectedRoute && token?.userType !== 'subcontractor') { const signInUrl = new URL('/claim-score/signin', req.url); signInUrl.searchParams.set('callbackUrl', pathname + req.nextUrl.search); return NextResponse.redirect(signInUrl); }

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
  ],
};
