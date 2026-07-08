// Post-checkout upload screen: two boxes (T&Cs, Correspondence) per the
// scoping doc. TODO: wire to /claim-score/api/upload once Stripe checkout
// redirect + submission record creation is built.
export default function ClaimScoreUploadPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-bold">Upload your documents</h1>
      <p className="mt-2 text-sm text-slate-600">
        Payment confirmed. Add your subcontract terms and any correspondence
        you want reviewed.
      </p>

      <div className="mt-8 space-y-6">
        <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          Subcontract T&amp;Cs — drop file or click to upload (TODO)
        </div>
        <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          Correspondence / other documents — drop files or click to upload
          (TODO)
        </div>
      </div>
    </div>
  );
}
