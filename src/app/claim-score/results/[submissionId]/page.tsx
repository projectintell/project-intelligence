import { readSubmissionResult } from '@/lib/blob';

// Results page — by the time a subcontractor lands here (redirected from
// the upload page only after /claim-score/api/process has already
// completed synchronously), result.json should already exist in Blob.
// See build-decisions.md "Document processing pipeline" for why scoring
// is synchronous rather than a background job for now.
export default async function ClaimScoreResultsPage({
  params,
}: {
  params: { submissionId: string };
}) {
  const result = await readSubmissionResult(params.submissionId);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-bold">Your Claim Score</h1>
      <p className="mt-2 text-sm text-slate-500">Submission {params.submissionId}</p>

      {!result ? (
        <div className="mt-8 rounded-lg border border-slate-200 p-8 text-slate-500">
          We couldn&apos;t find a result for this submission yet. If you just
          submitted, refresh this page in a moment — otherwise, please get
          in touch.
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <div className="rounded-lg border border-slate-200 p-8 text-center">
            <p className="text-sm uppercase tracking-wide text-slate-500">Claim Score</p>
            <p className="mt-2 text-4xl font-bold">
              {result.scoreBand} <span className="text-slate-400">({result.score}/100)</span>
            </p>
          </div>

          <div>
            <h2 className="font-medium">Summary</h2>
            <p className="mt-2 text-sm text-slate-700">{result.summary}</p>
          </div>

          {result.keySupportingEvents.length > 0 && (
            <div>
              <h2 className="font-medium">Key supporting evidence</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                {result.keySupportingEvents.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
