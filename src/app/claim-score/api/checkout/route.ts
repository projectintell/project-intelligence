import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { CLAIM_SCORE_TIERS } from '@/lib/pricing';

// Creates a Stripe Checkout session for the selected Claim Score tier.
// TODO: capture the consultant-opt-in + marketing-consent checkboxes here
// (two separate checkboxes per the scoping doc's GDPR/PECR note) and apply
// the 15% coupon when consultant opt-in is ticked.
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const tierId = form.get('tier');
  const tier = CLAIM_SCORE_TIERS.find((t) => t.id === tierId);

  if (!tier) {
    return NextResponse.json({ error: 'Unknown tier' }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          unit_amount: tier.price * 100,
          product_data: { name: `Claim Score — ${tier.name}` },
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/claim-score/upload?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/claim-score`,
  });

  return NextResponse.redirect(session.url!, 303);
}
