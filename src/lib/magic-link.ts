import { encode, decode } from 'next-auth/jwt';
import { Resend } from 'resend';

// Claim Score's passwordless login for subcontractors.
//
// Deliberately NOT using NextAuth's built-in Email provider: that requires
// a database adapter (Postgres/Redis/etc, with schema migrations) purely
// to store one-time verification tokens. Rather than add a whole new piece
// of infrastructure — and the command-line migration step that usually
// comes with it — this mints a short-lived signed JWT as the one-time
// link, and on verification writes a NextAuth-compatible session JWT
// straight into the session cookie, reusing the same NEXTAUTH_SECRET
// already configured for Claims Intelligence's Microsoft login. Result:
// subcontractors get a real NextAuth session with zero extra infra.
//
// Decision + rationale recorded in build-decisions.md (Q5, 2026-07-09).

const resend = new Resend(process.env.RESEND_API_KEY);

const MAGIC_LINK_TTL_SECONDS = 15 * 60; // 15 minutes
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days — matches NextAuth's default

interface MagicLinkPayload {
  email: string;
  submissionId?: string;
  callbackUrl?: string;
  purpose: 'claim-score-magic-link';
}

export async function createMagicLinkToken(email: string, submissionId?: string, callbackUrl?: string) {
  return encode({
    secret: process.env.NEXTAUTH_SECRET!,
    token: { email, submissionId, callbackUrl, purpose: 'claim-score-magic-link' } satisfies MagicLinkPayload,
    maxAge: MAGIC_LINK_TTL_SECONDS,
  });
}

export async function verifyMagicLinkToken(token: string): Promise<MagicLinkPayload | null> {
  const payload = (await decode({ secret: process.env.NEXTAUTH_SECRET!, token })) as
    | MagicLinkPayload
  | null;
  if (!payload || payload.purpose !== 'claim-score-magic-link') return null;
  return payload;
}

/** Mints the actual signed-in session token (distinct from the one-time link token above). */
export async function mintSubcontractorSessionToken(email: string) {
  return encode({
    secret: process.env.NEXTAUTH_SECRET!,
    token: { email, userType: 'subcontractor' },
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function sendMagicLinkEmail(email: string, submissionId?: string, callbackUrl?: string) {
  const token = await createMagicLinkToken(email, submissionId, callbackUrl);
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/claim-score/api/auth/verify?token=${token}`;

await resend.emails.send({
  from: process.env.EMAIL_FROM!,
  to: email,
  subject: 'Sign in to Claim Score',
  html: `<p>Click below to view your Claim Score results:</p><p><a href="${url}">Sign in to Claim Score</a></p><p>This link expires in 15 minutes. If you didn't request this, you can ignore this email.</p>`,
});
}

/** Name of the cookie NextAuth itself uses — kept in one place so the verify route and any future code agree. */
export const SESSION_COOKIE_NAME =
  process.env.NODE_ENV === 'production'
? '__Secure-next-auth.session-token'
  : 'next-auth.session-token';
