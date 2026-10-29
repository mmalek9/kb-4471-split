// What #4471 really holds. causes.ts splits by tenant and channel (parser / hint); this adds the two
// groups it cannot see: reports of a one-day move (desk-notes.json) and reports with no diagnosable cause.
import { causeOf, uniqueById, type Report } from '#lib/kb/causes';
import { tenantOf } from '#lib/kb/locales';

// Read by hand: they describe no date flip and no day shift (a feature request, a workaround, a vague complaint).
export const UNCLEAR: readonly string[] = ['R-41290', 'R-41417', 'R-41514', 'R-41615'];

export type Problem = 'parser' | 'hint' | 'one-day' | 'unclear';

export function problemOf(r: Report, oneDay: readonly string[]): Problem {
  if (oneDay.includes(r.id)) return 'one-day';
  if (UNCLEAR.includes(r.id)) return 'unclear';
  return causeOf(r, tenantOf(r)) ?? 'unclear';
}

export function splitTicket(reports: Report[], ticket: number, oneDay: readonly string[]) {
  const merged = uniqueById(reports).filter((r) => r.mergedInto === ticket);
  const rows = new Map<Problem, Report[]>();
  for (const r of merged) {
    const p = problemOf(r, oneDay);
    rows.set(p, [...(rows.get(p) ?? []), r]);
  }
  return { total: merged.length, rows };
}
