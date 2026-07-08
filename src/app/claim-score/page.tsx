import { CLAIM_SCORE_TIERS } from '@/lib/pricing';

// Claim Score landing page: tier selection -> Stripe Checkout.
// Per Claim Score scoping doc, this is the paid-ads landing page too,
// so keep this route lightweight and fast.
export default function ClaimScorePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold">
        Get an AI-assisted score on your claims exposure
      </h1>
      <p className="mt-4 text-slate-600">
        Upload your subcontract terms and correspondence. We&apos;ll tell you
        how strongly your documents support a claim — and where the gaps are.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {CLAIM_SCORE_TIERS.map((tier) => (
          <form key={tier.id} action="/claim-score/api/checkout" method="POST">
            <input type="hidden" name="tier" value={tier.id} />
            <button
              type="submit"
              className="w-full rounded-lg border border-slate-200 p-6 text-left hover:border-slate-400"
            >
              <p className="font-medium">{tier.name}</p>
              <p className="mt-2 text-3xl font-bold">£{tier.price}</p>
              <p className="text-sm text-slate-500">
                up to {tier.pages} pages (~{tier.approxDocs} documents)
              </p>
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
