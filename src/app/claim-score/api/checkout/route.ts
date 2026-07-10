import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { CLAIM_SCORE_TIERS } from '@/lib/pricing';

// Creates a Stripe Checkout session for the selected Claim Score tier.
// Captures the consultant-opt-in + marketing-consent checkboxes from the
// tier-selection form (see claim-score/page.tsx) as session metadata. The
// 15% consultant discount is applied by simply charging tier.withConsultant
// instead of tier.price (both already defined in lib/pricing.ts) — no
// separate Stripe coupon object needed. Company name is collected via
// Stripe's own custom_fields so the consultant lead notification
// (lib/consultant-notify.ts, Q7) has something to show beyond just an
// email address.
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const tierId = form.get('tier');
  const tier = CLAIM_SCORE_TIERS.find((t) => t.id === tierId);
  const consultantOptIn = form.get('consultantOptIn') === 'on';
  const marketingConsent = form.get('marketingConsent') === 'on';

  if (!tier) {
    return NextResponse.json({ error: 'Unknown tier' }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          unit_amount: (consultantOptIn ? tier.withConsultant : tier.price) * 100,
          product_data: { name: `Claim Score — ${tier.name}` },
        },
        quantity: 1,
      },
    ],
    custom_fields: [
      {
        key: 'company_name',
        label: { type: 'custom', custom: 'Company name' },
        type: 'text',
      },
    ],
    metadata: {
      tierId: tier.id,
      tierName: tier.name,
      consultantOptIn: String(consultantOptIn),
      marketingConsent: String(marketingConsent),
    },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/claim-score/upload?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/claim-score`,
  });

  return NextResponse.redirect(session.url!, 303);
}
