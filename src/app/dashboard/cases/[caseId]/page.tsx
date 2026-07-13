import { notFound } from 'next/navigation';
import { dataverse } from '@/lib/dataverse';
import {
  DATAVERSE_TABLES,
  labelForProductTag,
  labelForStatus,
  labelForDocumentType,
} from '@/lib/dataverse-schema';
import { getSessionUser } from '@/lib/auth';

// Case detail ("Signal Intelligence view") — the Case's Documents and
// extracted Events from the Dev clone tables. See dashboard/page.tsx for
// why: reads use the Web API's lowercase logical-name keys, not the
// mixed-case CaseDevRecord/DocumentDevRecord/EventDevRecord write-shape
// types in types/dataverse.ts.
//
// Access scoping (added 2026-07-13): same rule as the Case list — see
// dashboard/page.tsx for the full rationale. This page is reached by
// direct URL (not just the filtered list), so it re-checks
// cr3ed_allowedusers itself rather than trusting the list page's filter;
// a disallowed Case 404s rather than exposing that it exists.
export const dynamic = 'force-dynamic';

interface CaseDetail {
  cr3ed_casesdevid: string;
  cr3ed_casename: string;
  cr3ed_clientname: string;
  cr3ed_description?: string;
  cr3ed_product?: number;
  cr3ed_status?: number;
  cr3ed_startdate?: string;
  cr3ed_allowedusers?: string;
}

interface DocumentListItem {
  cr3ed_documentsdevid: string;
  cr3ed_documentname: string;
  cr3ed_documenttype?: number;
  cr3ed_sender?: string;
  cr3ed_dateingested?: string;
  cr3ed_processed?: boolean;
  cr3ed_filelink2?: string;
}

interface EventListItem {
  cr3ed_eventsdevid: string;
  cr3ed_eventname: string;
  cr3ed_claimsignal2raw?: string;
  cr3ed_eventtype2raw?: string;
  cr3ed_priority2raw?: string;
  cr3ed_relevance2raw?: string;
  cr3ed_confidencescore?: number;
  cr3ed_eventdate?: string;
  cr3ed_evidencequote?: string;
  cr3ed_docname?: string;
}

// "2 RAW" fields store underscored fixed vocabulary (e.g. "Delay_Notice")
// — display-layer transform only, per dataverse-schema-reference.md.
function spaced(value?: string) {
  return value ? value.replace(/_/g, ' ') : 'Not set';
}

export default async function CasePage({ params }: { params: { caseId: string } }) {
  const { caseId } = params;

  const session = await getSessionUser();
  const userEmail = (session?.user?.email ?? '').toLowerCase();

  let caseRecord: CaseDetail;
  try {
    caseRecord = (await dataverse.retrieve(
      DATAVERSE_TABLES.casesDev,
      caseId,
      '$select=cr3ed_casesdevid,cr3ed_casename,cr3ed_clientname,cr3ed_description,cr3ed_product,cr3ed_status,cr3ed_startdate,cr3ed_allowedusers',
    )) as CaseDetail;
  } catch {
    notFound();
  }

  // Blank cr3ed_allowedusers = visible to everyone (pre-scoping Cases);
  // see the access-scoping note above.
  const allowed = caseRecord.cr3ed_allowedusers
    ? caseRecord.cr3ed_allowedusers.toLowerCase().includes(userEmail)
    : true;
  if (!allowed) notFound();

  const [documentsResult, eventsResult] = await Promise.all([
    dataverse.list(
      DATAVERSE_TABLES.documentsDev,
      `$select=cr3ed_documentsdevid,cr3ed_documentname,cr3ed_documenttype,cr3ed_sender,cr3ed_dateingested,cr3ed_processed,cr3ed_filelink2&$filter=_cr3ed_case_value eq '${caseId}'&$orderby=cr3ed_dateingested desc`,
    ) as Promise<{ value: DocumentListItem[] }>,
    dataverse.list(
      DATAVERSE_TABLES.eventsDev,
      `$select=cr3ed_eventsdevid,cr3ed_eventname,cr3ed_claimsignal2raw,cr3ed_eventtype2raw,cr3ed_priority2raw,cr3ed_relevance2raw,cr3ed_confidencescore,cr3ed_eventdate,cr3ed_evidencequote,cr3ed_docname&$filter=_cr3ed_case_value eq '${caseId}'&$orderby=cr3ed_eventdate desc`,
    ) as Promise<{ value: EventListItem[] }>,
  ]);

  const documents = documentsResult.value;
  const events = eventsResult.value;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-bold">{caseRecord.cr3ed_casename}</h1>
          <p className="mt-1 text-slate-500">{caseRecord.cr3ed_clientname}</p>
        </div>
        <div className="text-right text-sm text-slate-500">
          <div>{labelForProductTag(caseRecord.cr3ed_product)}</div>
          <div>{labelForStatus(caseRecord.cr3ed_status)}</div>
          <div>{caseRecord.cr3ed_startdate ?? 'Not set'}</div>
        </div>
      </div>
      {caseRecord.cr3ed_description && (
        <p className="mt-4 text-sm text-slate-600">{caseRecord.cr3ed_description}</p>
      )}

      <h2 className="mt-10 text-lg font-semibold">Documents ({documents.length})</h2>
      {documents.length === 0 ? (
        <p className="mt-2 text-slate-500">No documents yet.</p>
      ) : (
        <table className="mt-4 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2 pr-4 font-medium">Document</th>
              <th className="py-2 pr-4 font-medium">Type</th>
              <th className="py-2 pr-4 font-medium">Sender</th>
              <th className="py-2 pr-4 font-medium">Date ingested</th>
              <th className="py-2 pr-4 font-medium">Processed</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((d) => (
              <tr key={d.cr3ed_documentsdevid} className="border-b border-slate-100">
                <td className="py-3 pr-4">
                  {d.cr3ed_filelink2 ? (
                    <a
                      href={d.cr3ed_filelink2}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {d.cr3ed_documentname}
                    </a>
                  ) : (
                    d.cr3ed_documentname
                  )}
                </td>
                <td className="py-3 pr-4">{labelForDocumentType(d.cr3ed_documenttype)}</td>
                <td className="py-3 pr-4">{d.cr3ed_sender ?? 'Not set'}</td>
                <td className="py-3 pr-4">
                  {d.cr3ed_dateingested ? new Date(d.cr3ed_dateingested).toLocaleDateString('en-GB') : 'Not set'}
                </td>
                <td className="py-3 pr-4">{d.cr3ed_processed ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className="mt-10 text-lg font-semibold">Events ({events.length})</h2>
      {events.length === 0 ? (
        <p className="mt-2 text-slate-500">No events extracted yet.</p>
      ) : (
        <div className="mt-4 space-y-4">
          {events.map((e) => (
            <div key={e.cr3ed_eventsdevid} className="rounded border border-slate-200 p-4">
              <div className="flex items-baseline justify-between">
                <span className="font-medium">{e.cr3ed_eventname}</span>
                <span className="text-sm text-slate-500">
                  {e.cr3ed_eventdate ? new Date(e.cr3ed_eventdate).toLocaleDateString('en-GB') : 'Not set'}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap gap-x-4 text-sm text-slate-500">
                <span>Signal: {spaced(e.cr3ed_claimsignal2raw)}</span>
                <span>Type: {spaced(e.cr3ed_eventtype2raw)}</span>
                <span>Priority: {spaced(e.cr3ed_priority2raw)}</span>
                <span>Relevance: {spaced(e.cr3ed_relevance2raw)}</span>
                {typeof e.cr3ed_confidencescore === 'number' && (
                  <span>Confidence: {e.cr3ed_confidencescore}%</span>
                )}
                {e.cr3ed_docname && <span>From: {e.cr3ed_docname}</span>}
              </div>
              {e.cr3ed_evidencequote && (
                <p className="mt-2 text-sm italic text-slate-600">&ldquo;{e.cr3ed_evidencequote}&rdquo;</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
