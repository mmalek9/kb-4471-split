<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import type { Report } from '#lib/kb/causes';
  import { splitTicket, type Problem } from '#lib/kb/split';

  let { ticket }: { ticket: number } = $props();

  const ORDER: Problem[] = ['parser', 'hint', 'one-day', 'unclear'];
  const split = $derived(splitTicket(reports as Report[], ticket, notes.oneDayMove));
  const rows = $derived(
    ORDER.map((p) => {
      const rs = split.rows.get(p) ?? [];
      return { problem: p, n: rs.length, tenants: new Set(rs.map((r) => r.tenant)).size };
    }),
  );
</script>

<p><strong>{split.total}</strong> reports merged into #{ticket} · <strong>{rows.filter((r) => r.problem !== 'unclear' && r.n).length}</strong> problems</p>

<table>
  <thead><tr><th>problem</th><th>reports</th><th>tenants</th></tr></thead>
  <tbody>
    {#each rows as row (row.problem)}
      <tr><td><code>{row.problem}</code></td><td>{row.n}</td><td>{row.tenants}</td></tr>
    {/each}
  </tbody>
</table>
