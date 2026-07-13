export default function HomePage() {
  return (
    <section className="py-20">
      <h1 className="text-4xl font-bold tracking-tight">Chronicle</h1>
      <p className="mt-2 text-sm italic text-slate-500">
        chron·i·cle — noun: a factual, chronological written account of
        important or historical events.
      </p>
      <p className="mt-6 max-w-2xl text-slate-600">
        Chronicle turns contract correspondence and site records into
        structured, evidenced claim signals — for consultants running
        Claims Intelligence, and for contractors checking their own
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
