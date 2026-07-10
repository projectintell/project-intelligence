import { Resend } from 'resend';

// Claim Score's consultant lead routing — v1 is intentionally lightweight
// per the scoping doc: a single email notification, not a full Dataverse
// lead queue. Fires once a subcontractor who ticked the consultant
// opt-in checkbox has a completed Claim Score result (not at checkout —
// the notification is meant to include the result summary, so it has to
// wait until scoring has actually run; see the process route for where
// this is called from).
//
// Decision recorded in build-decisions.md (Q7, 2026-07-09): notifications
// go to trichmond@warmflamedevelopments.com, for the attention of Tim.

const resend = new Resend(process.env.RESEND_API_KEY);

const CONSULTANT_LEAD_EMAIL = 'trichmond@warmflamedevelopments.com';
const CONSULTANT_LEAD_ATTENTION = 'Tim';

export interface ConsultantLeadInput {
  submissionId: string;
  companyName: string;
  contactName?: string;
  contactEmail: string;
  tierName: string;
  score: number;
  scoreBand: string;
  scoreSummary: string;
}

export async function notifyConsultantOfLead(input: ConsultantLeadInput) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: CONSULTANT_LEAD_EMAIL,
    subject: `New Claim Score consultant lead — ${input.companyName}`,
    html: `
      <p>For the attention of: <strong>${CONSULTANT_LEAD_ATTENTION}</strong></p>
      <p>A subcontractor has opted in (15% discount) to be contacted by a claims consultant.</p>
      <ul>
        <li><strong>Company:</strong> ${input.companyName}</li>
        <li><strong>Contact:</strong> ${input.contactName ?? '(not given)'} — ${input.contactEmail}</li>
        <li><strong>Tier:</strong> ${input.tierName}</li>
        <li><strong>Submission ID:</strong> ${input.submissionId}</li>
        <li><strong>Claim Score:</strong> ${input.scoreBand} (${input.score}/100)</li>
      </ul>
      <p>${input.scoreSummary}</p>
    `,
  });
}
