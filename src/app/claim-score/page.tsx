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
          <form
            key={tier.id}
            action="/claim-score/api/checkout"
            method="POST"
            className="flex flex-col rounded-lg border border-slate-200 p-6"
          >
            <input type="hidden" name="tier" value={tier.id} />
            <p className="font-medium">{tier.name}</p>
            <p className="mt-2 text-3xl font-bold">£{tier.price}</p>
            <p className="text-sm text-slate-500">
              up to {tier.pages} pages (~{tier.approxDocs} documents)
            </p>

            <label className="mt-4 flex items-start gap-2 text-xs text-slate-600">
              <input type="checkbox" name="consultantOptIn" className="mt-0.5" />
              <span>
                Get 15% off (£{tier.withConsultant}) and agree to be contacted
                by a claims consultant about your results.
              </span>
            </label>

            {/* Marketing consent — deliberately separate checkbox from
                consultant opt-in above, unticked by default, specific
                about what it covers. Copy decided in build-decisions.md
                (Q8, 2026-07-09). Not a substitute for legal review. */}
            <label className="mt-2 flex items-start gap-2 text-xs text-slate-600">
              <input type="checkbox" name="marketingConsent" className="mt-0.5" />
              <span>
                Yes, keep me updated by email about other Chronicle products
                and services. You can unsubscribe at any time — see our{' '}
                <a href="/privacy" className="underline">
                  Privacy Policy
                </a>
                .
              </span>
            </label>

            <button
              type="submit"
              className="mt-4 w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              Get my Claim Score
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
