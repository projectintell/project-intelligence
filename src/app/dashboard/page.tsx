import Link from 'next/link';
import { dataverse } from '@/lib/dataverse';
import { DATAVERSE_TABLES, labelForProductTag, labelForStatus } from '@/lib/dataverse-schema';

// Claims Intelligence Case list — reads from the Dev clone tables
// (cr3ed_casesdev), the same ones Claim Score's pipeline writes to, not
// yet the live production Cases table (see handoff-notes.md). Shows every
// Case with no client-side scoping — single internal user for now, add
// per-client filtering once more than one client signs in.
//
// IMPORTANT: Dataverse's Web API always returns GET results keyed by the
// fully-lowercase logical name (e.g. cr3ed_casename), never the
// mixed-case schema name used for writes (cr3ed_CaseName) — see
// dataverse.ts's lowercaseKeys() comment, which only covers writes. The
// CaseListItem type below reflects that; don't reuse CaseDevRecord
// (types/dataverse.ts) here, it's the write-shape and its keys won't match.
export const dynamic = 'force-dynamic';

interface CaseListItem {
  cr3ed_casesdevid: string;
  cr3ed_casename: string;
  cr3ed_clientname: string;
  cr3ed_product?: number;
  cr3ed_status?: number;
  cr3ed_startdate?: string;
}

export default async function DashboardPage() {
  const result = (await dataverse.list(
    DATAVERSE_TABLES.casesDev,
    '$select=cr3ed_casesdevid,cr3ed_casename,cr3ed_clientname,cr3ed_product,cr3ed_status,cr3ed_startdate&$orderby=createdon desc',
  )) as { value: CaseListItem[] };

  const cases = result.value;

  return (
    <div>
      <h1 className="text-2xl font-bold">Cases</h1>
      {cases.length === 0 ? (
        <p className="mt-2 text-slate-500">No cases yet.</p>
      ) : (
        <table className="mt-6 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2 pr-4 font-medium">Case</th>
              <th className="py-2 pr-4 font-medium">Client</th>
              <th className="py-2 pr-4 font-medium">Product</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-4 font-medium">Start date</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c.cr3ed_casesdevid} className="border-b border-slate-100">
                <td className="py-3 pr-4">
                  <Link
                    href={`/dashboard/cases/${c.cr3ed_casesdevid}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {c.cr3ed_casename}
                  </Link>
                </td>
                <td className="py-3 pr-4">{c.cr3ed_clientname}</td>
                <td className="py-3 pr-4">{labelForProductTag(c.cr3ed_product)}</td>
                <td className="py-3 pr-4">{labelForStatus(c.cr3ed_status)}</td>
                <td className="py-3 pr-4">{c.cr3ed_startdate ?? 'Not set'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
