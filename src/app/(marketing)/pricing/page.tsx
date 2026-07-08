const CLAIM_SCORE_TIERS = [
  { name: 'Snapshot', pages: 150, price: 79, withConsultant: 67 },
  { name: 'Standard', pages: 750, price: 199, withConsultant: 169 },
  { name: 'Full Review', pages: 1500, price: 349, withConsultant: 297 },
];

// Placeholder pricing page. Figures sourced from build-decisions.md /
// Claim Score scoping doc — first-pass assumptions, not yet validated
// against real AI processing cost or ad conversion data.
export default function PricingPage() {
  return (
    <section className="py-16">
      <h1 className="text-3xl font-bold">Pricing</h1>

      <h2 className="mt-10 text-xl font-semibold">Claim Score</h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-3">
        {CLAIM_SCORE_TIERS.map((tier) => (
          <div key={tier.name} className="rounded-lg border border-slate-200 p-6">
            <p className="font-medium">{tier.name}</p>
            <p className="mt-2 text-3xl font-bold">£{tier.price}</p>
            <p className="text-sm text-slate-500">up to {tier.pages} pages</p>
            <p className="mt-2 text-xs text-slate-500">
              £{tier.withConsultant} if you opt in to a consultant follow-up
            </p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-xl font-semibold">Claims Intelligence</h2>
      <div className="mt-4 rounded-lg border border-slate-200 p-6 sm:w-80">
        <p className="font-medium">Per user</p>
        <p className="mt-2 text-3xl font-bold">£199/mo</p>
        <p className="text-sm text-slate-500">
          Flat placeholder rate — to be revisited (see build-decisions.md)
        </p>
      </div>
    </section>
  );
}
