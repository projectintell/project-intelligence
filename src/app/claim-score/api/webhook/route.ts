import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

// Stripe webhook: confirms payment before releasing the upload screen /
// creating the submission record. Verify signature with
// STRIPE_WEBHOOK_SECRET before trusting the payload.
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      // TODO: create the submission record (Dataverse, Product=ClaimScore)
      // and redirect the customer to /claim-score/upload.
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
