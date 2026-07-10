// Terms & Conditions — good-faith draft, NOT reviewed by a solicitor.
// Companion to privacy/page.tsx (same caveat applies — see build-decisions.md, Q8).
export default function TermsPage() {
  return (
    <section className="prose-slate py-16">
      <h1 className="text-3xl font-bold">Terms &amp; Conditions</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: 10 July 2026</p>

      <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        This is a good-faith draft, not a solicitor-reviewed final version.
        Please have it checked by a qualified adviser before relying on it
        for real customers.
      </div>

      <div className="mt-10 space-y-8 text-sm leading-6 text-slate-700">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">1. Who these terms apply to</h2>
          <p className="mt-2">
            These terms govern your use of Chronicle (chronicleintel.com),
            operated by <strong>Second City Assets Ltd</strong>, including
            the Claim Score and Claims Intelligence products. By paying for
            or using either product, you agree to these terms.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">2. What Chronicle is — and isn&apos;t</h2>
          <p className="mt-2">
            Claim Score uses an AI pipeline to review documents you upload
            and produce a score and summary of your contractual/claims
            exposure. Claims Intelligence gives consulting clients a
            dashboard of AI-extracted events from their case documents.
          </p>
          <p className="mt-2 font-medium text-slate-900">
            Neither product is legal advice, and using Chronicle does not
            create a solicitor-client or professional-adviser relationship.
            AI-generated output can be wrong or incomplete. You should get
            independent professional advice before relying on any Chronicle
            output to make a real claim, contractual decision, or legal
            argument.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">3. Payment, pricing and refunds</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Claim Score is paid upfront via Stripe Checkout, at the tier price shown at the time of purchase (see our <a href="/pricing" className="underline">pricing page</a>).</li>
            <li>Prices may include or exclude VAT depending on your location and status; Stripe will show the applicable amount at checkout.</li>
            <li>Because processing begins as soon as you submit your documents, we can&apos;t offer a refund once AI processing has started on your submission. If you haven&apos;t yet uploaded documents or submitted for scoring, contact us and we&apos;ll refund you.</li>
            <li>If a technical fault on our side means you didn&apos;t receive a usable result, contact us and we&apos;ll investigate and put it right, including a refund if appropriate.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">4. Your documents and data</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>You own the documents you upload. You&apos;re giving us a licence to process them (including via AI) solely to provide you the service.</li>
            <li>You confirm you have the right to upload and share the documents you submit — for example, that doing so doesn&apos;t breach a confidentiality obligation to someone else.</li>
            <li>Don&apos;t upload anything unlawful, or documents you don&apos;t have the right to share.</li>
            <li>See our <a href="/privacy" className="underline">Privacy Policy</a> for how we handle personal data within your documents.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">5. Accounts</h2>
          <p className="mt-2">
            Claim Score accounts are created automatically from your
            checkout details, with passwordless sign-in. Claims Intelligence
            accounts sign in with your organisation&apos;s Microsoft account.
            You&apos;re responsible for keeping access to your sign-in email
            or Microsoft account secure.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">6. Intellectual property</h2>
          <p className="mt-2">
            The Chronicle software, branding, and AI pipeline belong to
            Second City Assets Ltd. Nothing in these terms transfers that
            ownership to you. You keep ownership of your own uploaded
            documents and the results generated for your specific
            submission.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">7. Liability</h2>
          <p className="mt-2">
            We provide Chronicle with reasonable care and skill, but AI
            output can contain errors, and we don&apos;t guarantee it&apos;s
            complete or accurate. To the extent permitted by law, our total
            liability to you for any claim relating to the service is
            limited to the amount you paid us for that submission. We don&apos;t
            exclude liability where the law doesn&apos;t allow us to (for
            example, for death or personal injury caused by our negligence,
            or fraud).
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">8. Suspension and termination</h2>
          <p className="mt-2">
            We may suspend or terminate access if you misuse the service —
            for example, uploading unlawful content or attempting to
            circumvent payment. You can stop using Chronicle at any time;
            see section 3 for our refund position.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">9. Changes to these terms</h2>
          <p className="mt-2">
            We may update these terms from time to time. We&apos;ll update the
            &quot;last updated&quot; date above when we do. Continuing to use
            Chronicle after a change means you accept the updated terms.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">10. Governing law</h2>
          <p className="mt-2">
            These terms are governed by the law of England and Wales, and
            any disputes will be handled by the courts of England and Wales.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">11. Contact us</h2>
          <p className="mt-2">
            Questions about these terms:{' '}
            <a href="mailto:trichmond@warmflamedevelopments.com" className="underline">
              trichmond@warmflamedevelopments.com
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
