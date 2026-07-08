// TODO: fetch the case's Documents + Events (Signal Intelligence view)
// from the cloned Dev tables via lib/dataverse.ts.
export default function CasePage({ params }: { params: { caseId: string } }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Case {params.caseId}</h1>
      <p className="mt-2 text-slate-500">
        Events and documents will render here once wired up.
      </p>
    </div>
  );
}
