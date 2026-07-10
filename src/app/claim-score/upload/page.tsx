import { UploadForm } from './upload-form';

// Post-checkout upload screen: two boxes (T&Cs, Correspondence) per the
// scoping doc, plus the free-text claim question (build-decisions.md,
// Claim Score scoring logic). submissionId is the Stripe Checkout Session
// ID, passed through success_url as ?session_id= (see api/checkout/route.ts).
export default function ClaimScoreUploadPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const submissionId = searchParams.session_id;

  if (!submissionId) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-sm text-red-600">
        Missing session — please start again from the Claim Score page.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-bold">Upload your documents</h1>
      <p className="mt-2 text-sm text-slate-600">
        Payment confirmed. Add your subcontract terms and any correspondence
        you want reviewed, then tell us what you want to know.
      </p>

      <UploadForm submissionId={submissionId} />
    </div>
  );
}
