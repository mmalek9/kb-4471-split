// What #4471 really holds, counted the desk's way: each report is filed under its tenant's cause
// (causes.ts). Reports read as a one-day move (desk-notes.json) are footnoted under that cause.
import { groupByCause, readAs, uniqueById, type Report } from '#lib/kb/causes';
import { tenantOf } from '#lib/kb/locales';

export function splitTicket(reports: Report[], ticket: number, oneDay: readonly string[]) {
  const merged = uniqueById(reports).filter((r) => r.mergedInto === ticket);
  const rows = groupByCause(merged, tenantOf).map((g) => ({
    cause: g.cause,
    n: g.reports.length,
    tenants: g.tenants,
    oneDay: readAs(g, oneDay),
  }));
  return { total: merged.length, rows };
}
