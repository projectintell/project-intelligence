import { getSessionUser } from '@/lib/auth';
import { readSubmissionMeta, type SubmissionMeta } from '@/lib/blob';

// Security fix (2026-07-18). Two problems this closes at once:
//
// 1. IDOR: middleware.ts only checks that a caller has *some* valid
//    subcontractor session — not that it's the *right* one for the specific
//    submissionId being requested. Without this check, any customer who has
//    ever bought one Claim Score could view/upload/reprocess any other
//    customer's confidential submission just by changing the submissionId in
//    the URL or request body. This ties access to the email the submission
//    was actually paid under (Stripe's customer_details.email, written to
//    Blob meta.json by the webhook), matched against the signed-in session's
//    email (proven by clicking a magic link sent to that inbox).
//
// 2. Injection/path safety: submissionId is the Stripe Checkout Session ID,
//    and was previously used unvalidated in a raw Dataverse OData `$filter`
//    string (process/route.ts) and as a Vercel Blob storage path segment
//    (blob.ts). Validating its format up front, before it touches either
//    system, closes off both an OData-injection-style attack and any
//    weirdness from a crafted path-like string.
const SUBMISSION_ID_PATTERN = /^cs_(test|live)_[A-Za-z0-9]+$/;

export function isValidSubmissionId(submissionId: string | null | undefined): submissionId is string {
  return !!submissionId && SUBMISSION_ID_PATTERN.test(submissionId);
}

export type SubmissionAccessResult =
  | { ok: true; meta: SubmissionMeta }
  | { ok: false; status: 401 | 404; error: string };

/**
 * Confirms the currently signed-in subcontractor session is allowed to
 * access the given submissionId. Use in every Claim Score API route and
 * page that takes a submissionId from the URL or request body.
 */
export async function checkSubmissionAccess(
  submissionId: string | null | undefined,
): Promise<SubmissionAccessResult> {
  // Same "not found" message for a malformed ID and a mismatched owner
  // (below) — deliberately not distinguishing "doesn't exist" from "exists
  // but isn't yours" to a caller who isn't authorized either way.
  if (!isValidSubmissionId(submissionId)) {
    return { ok: false, status: 404, error: 'Submission not found' };
  }

  const session = await getSessionUser();
  const sessionEmail = session?.user?.email?.toLowerCase();
  if (!sessionEmail) {
    return { ok: false, status: 401, error: 'Unauthorized — please sign in.' };
  }

  const meta = await readSubmissionMeta(submissionId);
  if (!meta) {
    return { ok: false, status: 404, error: 'Submission not found' };
  }

  if (meta.contactEmail.toLowerCase() !== sessionEmail) {
    return { ok: false, status: 404, error: 'Submission not found' };
  }

  return { ok: true, meta };
}
