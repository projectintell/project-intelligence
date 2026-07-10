import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { dataverse } from '@/lib/dataverse';
import { DATAVERSE_TABLES, PRODUCT_TAG, SOURCE_TAG, STATUS } from '@/lib/dataverse-schema';
import { writeSubmissionMeta } from '@/lib/blob';
import type { CaseDevRecord } from '@/types/dataverse';

// Stripe webhook: confirms payment before releasing the upload screen /
// creating the submission record. Verify signature with
// STRIPE_WEBHOOK_SECRET before trusting the payload.
//
// The Stripe Checkout Session ID doubles as the Claim Score submission ID
// throughout the app (it's already what success_url redirects with) —
// no separate ID is minted. Two things happen here on payment confirmation:
//   1. A Case record is created in Cases Dev (see build-decisions.md —
//      Dev tables deliberately used for now, not production Cases), so the
//      submission has an audit-trail record before any documents exist.
//   2. Contact/tier/consent details go to Blob as meta.json (lib/blob.ts)
//      rather than new Dataverse columns — those don't exist on Cases Dev
//      and adding them is deferred until this flow is validated end to end.
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
      const session = event.data.object as Stripe.Checkout.Session;
      const submissionId = session.id;
      const companyName =
        session.custom_fields?.find((f) => f.key === 'company_name')?.text?.value ||
        session.customer_details?.name ||
        'Unknown company';
      const contactEmail = session.customer_details?.email ?? '';
      const tierId = session.metadata?.tierId ?? '';
      const tierName = session.metadata?.tierName ?? '';
      const consultantOptIn = session.metadata?.consultantOptIn === 'true';
      const marketingConsent = session.metadata?.marketingConsent === 'true';

      const caseRecord: CaseDevRecord = {
        cr3ed_CaseID: submissionId,
        cr3ed_CaseName: `${companyName} — Claim Score (${tierName})`,
        cr3ed_ClientName: companyName,
        cr3ed_Product: PRODUCT_TAG.ClaimScore,
        cr3ed_Source: SOURCE_TAG.Subcontractor,
        cr3ed_Status: STATUS.Open,
        cr3ed_StartDate: new Date().toISOString().slice(0, 10),
      };

      await Promise.all([
        dataverse.create(DATAVERSE_TABLES.casesDev, caseRecord),
        writeSubmissionMeta(submissionId, {
          tierId,
          tierName,
          companyName,
          contactEmail,
          consultantOptIn,
          marketingConsent,
          createdAt: new Date().toISOString(),
        }),
      ]);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
