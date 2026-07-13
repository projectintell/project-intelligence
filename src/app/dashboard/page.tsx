import Link from 'next/link';
import { dataverse } from '@/lib/dataverse';
import { DATAVERSE_TABLES, labelForProductTag, labelForStatus } from '@/lib/dataverse-schema';
import { getSessionUser } from '@/lib/auth';

// Claims Intelligence Case list — reads from the Dev clone tables
// (cr3ed_casesdev), the same ones Claim Score's pipeline writes to, not
// yet the live production Cases table (see handoff-notes.md).
//
// Access scoping (added 2026-07-13): minimal first pass of the agreed
// Organization/per-case-allocation model (see build-decisions.md and the
// "Claims Intelligence — user account & billing architecture" note). A
// Case is visible to the signed-in user if their email appears in the
// Case's cr3ed_allowedusers field — a semicolon-separated list, populated
// by hand in Power Apps when a Case is created (no admin/invite UI yet;
// that's the next layer on top of this, not a redo of it). Cases with
// cr3ed_allowedusers left blank are treated as visible to every signed-in
// user, so the 11 existing test Cases created before this field existed
// don't silently vanish. Once every live Case has an owner populated,
// that "blank = visible to all" fallback should be removed to close the
// gap. Same rule applied in cases/[caseId]/page.tsx for the detail view.
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
  const session = await getSessionUser();
  const userEmail = (session?.user?.email ?? '').toLowerCase().replace(/'/g, "''");

  // No accessFilter value means "no email on the session" — fail closed
  // (only show unscoped/blank Cases) rather than fail open.
  const accessFilter = userEmail
    ? `(contains(tolower(cr3ed_allowedusers),'${userEmail}') or cr3ed_allowedusers eq null)`
    : 'cr3ed_allowedusers eq null';

  const result = (await dataverse.list(
    DATAVERSE_TABLES.casesDev,
    `$select=cr3ed_casesdevid,cr3ed_casename,cr3ed_clientname,cr3ed_product,cr3ed_status,cr3ed_startdate&$filter=${accessFilter}&$orderby=createdon desc`,
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
