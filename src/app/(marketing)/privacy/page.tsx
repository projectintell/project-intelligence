// Privacy Policy — good-faith draft covering how Chronicle (Claim Score +
// Claims Intelligence) collects and processes personal data, written to
// general UK GDPR/PECR principles. NOT reviewed by a solicitor — see the
// notice below and build-decisions.md (Q8). Needs sign-off before real
// subcontractor/consultant traffic relies on it.
export default function PrivacyPolicyPage() {
  return (
    <section className="prose-slate py-16">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: 10 July 2026</p>

      <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        This is a good-faith draft, not a solicitor-reviewed final version.
        Please have it checked by a qualified adviser before relying on it
        for real customer data.
      </div>

      <div className="mt-10 space-y-8 text-sm leading-6 text-slate-700">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">1. Who we are</h2>
          <p className="mt-2">
            Chronicle (chronicleintel.com) is operated by{' '}
            <strong>Second City Assets Ltd</strong>, a company registered in
            England and Wales. Chronicle includes two products: <strong>Claim
            Score</strong>, a paid self-serve tool for subcontractors, and{' '}
            <strong>Claims Intelligence</strong>, a dashboard for claims
            consultants. This policy covers both.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">2. What we collect</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Account details</strong> — name, email address, and
              (for Claim Score) company name, collected at checkout or sign-in.
            </li>
            <li>
              <strong>Documents you upload</strong> — subcontract terms and
              correspondence you submit for review, including any personal
              or commercially sensitive information they contain.
            </li>
            <li>
              <strong>Payment information</strong> — handled entirely by
              Stripe, our payment processor. We never see or store your card
              details ourselves.
            </li>
            <li>
              <strong>Usage data</strong> — basic technical logs (e.g. sign-in
              times, IP address) for security and fraud prevention.
            </li>
            <li>
              <strong>Marketing consent</strong> — if you tick the marketing
              checkbox at checkout, we record that choice and your email
              address for that purpose only.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">3. How we use it</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>To provide the Claim Score or Claims Intelligence service you've paid for or signed up to, including running your uploaded documents through our AI extraction/scoring pipeline.</li>
            <li>To create and secure your account, and to communicate with you about your submission or results.</li>
            <li>If you opt in at checkout, to pass your contact details and Claim Score result to a claims consultant so they can follow up with you.</li>
            <li>If you separately opt in to marketing, to email you about other Chronicle products and services. You can withdraw this consent at any time (see section 7).</li>
            <li>To meet our legal and accounting obligations (e.g. VAT records).</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">4. Who we share it with</h2>
          <p className="mt-2">
            We use a small number of service providers (&quot;processors&quot;)
            to run Chronicle. They only process your data to provide their
            service to us, under contract:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Stripe</strong> — payment processing.</li>
            <li><strong>Anthropic</strong> — AI processing of uploaded documents (Claude API), to extract and score claim-relevant events.</li>
            <li><strong>Microsoft</strong> — secure storage of extracted data (Dataverse) and, for Claims Intelligence users, sign-in via Microsoft.</li>
            <li><strong>Vercel</strong> — website hosting and file storage for uploaded documents.</li>
            <li><strong>Resend</strong> — transactional email (sign-in links, notifications).</li>
          </ul>
          <p className="mt-2">
            If you opt in to consultant contact at checkout, we also share
            your contact details and result summary with the claims
            consultant handling your enquiry. We do not sell your data to
            anyone, and we don't share it with third parties for their own
            marketing purposes.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">5. Where your data is processed</h2>
          <p className="mt-2">
            Some of the providers above are based outside the UK/EEA
            (including the US). Where that's the case, we rely on
            appropriate safeguards — such as Standard Contractual Clauses —
            to protect your data, as required by UK GDPR.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">6. How long we keep it</h2>
          <p className="mt-2">
            We keep account and submission data for as long as your account
            is active, plus a reasonable period afterwards for legal,
            accounting, or dispute-resolution purposes. Marketing consent is
            kept until you withdraw it. We're still finalising exact
            retention periods for each data type — this section will be
            updated once that's settled.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">7. Your rights</h2>
          <p className="mt-2">Under UK GDPR, you have the right to:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Access the personal data we hold about you.</li>
            <li>Have inaccurate data corrected.</li>
            <li>Have your data deleted, in certain circumstances.</li>
            <li>Restrict or object to certain processing.</li>
            <li>Receive your data in a portable format.</li>
            <li>Withdraw marketing consent at any time, with no effect on the service itself.</li>
            <li>Complain to the UK Information Commissioner&apos;s Office (ICO) if you think we&apos;ve mishandled your data.</li>
          </ul>
          <p className="mt-2">
            To exercise any of these rights, contact us using the details
            below.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">8. Contact us</h2>
          <p className="mt-2">
            For any question about this policy or your data, contact{' '}
            <a href="mailto:trichmond@warmflamedevelopments.com" className="underline">
              trichmond@warmflamedevelopments.com
            </a>{' '}
            (a dedicated privacy@chronicleintel.com address will replace this
            once the domain&apos;s email is set up).
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">9. Changes to this policy</h2>
          <p className="mt-2">
            We may update this policy from time to time. We&apos;ll update the
            &quot;last updated&quot; date above when we do; significant
            changes will be flagged more prominently.
          </p>
        </div>
      </div>
    </section>
  );
}
