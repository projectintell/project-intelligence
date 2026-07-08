// Cut-down Signal Intelligence dashboard view, scoped to a single
// submission. TODO: fetch the submission's Events/Documents rows from
// Dataverse (Product/Source tag = ClaimScore) via lib/dataverse.ts.
export default function ClaimScoreResultsPage({
  params,
}: {
  params: { submissionId: string };
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-bold">Your Claim Score</h1>
      <p className="mt-2 text-sm text-slate-500">
        Submission {params.submissionId}
      </p>
      <div className="mt-8 rounded-lg border border-slate-200 p-8 text-slate-500">
        Results will render here once the extraction pipeline is wired up.
      </div>
    </div>
  );
}
