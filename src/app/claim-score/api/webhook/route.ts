import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
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
    case 'checkout.session.completed': {
      // TODO: create the submission record (Dataverse, Product=ClaimScore),
      // persisting session.metadata.consultantOptIn / .marketingConsent /
      // .tierName, session.customer_details?.email, and the company_name
      // custom_field below — the process route (api/process, Q7) needs all
      // of this once scoring completes, to fire the consultant lead
      // notification (lib/consultant-notify.ts) for opted-in submissions.
      const session = event.data.object as Stripe.Checkout.Session;
      const companyName = session.custom_fields?.find(
        (f) => f.key === 'company_name',
      )?.text?.value;
      void companyName; // referenced above in the TODO — silences unused-var lint until the Dataverse write is built
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
