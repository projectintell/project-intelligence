export default function HomePage() {
  return (
    <section className="py-20">
      <h1 className="text-4xl font-bold tracking-tight">
        AI-assisted construction claims analysis
      </h1>
      <p className="mt-4 max-w-2xl text-slate-600">
        Project Intelligence turns contract correspondence and site records
        into structured, evidenced claim signals — for consultants running
        Claims Intelligence, and for subcontractors checking their own
        exposure with Claim Score.
      </p>
      <div className="mt-8 flex gap-4">
        <a
          href="/claim-score"
          className="rounded-md bg-slate-900 px-5 py-3 text-sm font-medium text-white"
        >
          Try Claim Score
        </a>
        <a
          href="/pricing"
          className="rounded-md border border-slate-300 px-5 py-3 text-sm font-medium"
        >
          View pricing
        </a>
      </div>
    </section>
  );
}
