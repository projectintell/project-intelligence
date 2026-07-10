import { NextRequest, NextResponse } from 'next/server';
import { scoreClaim, bandForScore } from '@/lib/claude';
import { notifyConsultantOfLead } from '@/lib/consultant-notify';

// Runs a submission's Claim Score extraction + scoring pipeline end to end,
// and — this is where Q7's consultant lead routing actually fires — emails
// the consultant lead notification if the subcontractor ticked the
// consultant opt-in checkbox at checkout.
//
// TODO: this route is currently a skeleton for the parts that don't exist
// yet elsewhere in the build:
//   1. Fetch the submission record from Dataverse (Product=ClaimScore) to
//      get companyName / contactEmail / tierName / consultantOptIn, and
//      its uploaded documents from Vercel Blob.
//   2. Run extractEvents() (lib/claude.ts) per document.
//   3. Write the extracted events back to Dataverse.
//   4. THEN the code below: run scoreClaim(), and — if consultantOptIn —
//      call notifyConsultantOfLead(). This part is fully wired and ready;
//      it just needs steps 1-3 feeding it real data instead of the request
//      body shape assumed here.
export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    submissionId,
    companyName,
    contactName,
    contactEmail,
    tierName,
    consultantOptIn,
    userQuestion,
    events, // ExtractedEvent[] — see lib/claude.ts. TODO: comes from step 2/3 above once built.
  } = body;

  const result = await scoreClaim({ userQuestion, events });
  const scoreBand = bandForScore(result.score);

  // TODO: persist result (score, scoreBand, summary, keySupportingEvents)
  // to the submission's Dataverse record so /claim-score/results/[id] can
  // read it back.

  if (consultantOptIn) {
    await notifyConsultantOfLead({
      submissionId,
      companyName,
      contactName,
      contactEmail,
      tierName,
      score: result.score,
      scoreBand,
      scoreSummary: result.summary,
    });
  }

  return NextResponse.json({ ...result, scoreBand });
}
