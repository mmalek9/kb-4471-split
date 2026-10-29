<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import type { Report } from '#lib/kb/causes';
  import { splitTicket } from '#lib/kb/split';

  let { ticket }: { ticket: number } = $props();

  const split = $derived(splitTicket(reports as Report[], ticket, notes.oneDayMove));
</script>

<p><strong>{split.total}</strong> reports merged into #{ticket} · <strong>{split.rows.length}</strong> problems</p>

<table>
  <thead><tr><th>problem</th><th>reports</th><th>tenants</th></tr></thead>
  <tbody>
    {#each split.rows as row (row.cause)}
      <tr><td><code>{row.cause}</code></td><td>{row.n}</td><td>{row.tenants}</td></tr>
    {/each}
  </tbody>
</table>

{#each split.rows as row (row.cause)}
  {#if row.oneDay}
    <p class="note">{row.oneDay} reports read as a one-day move; filed under <code>{row.cause}</code> by tenant.</p>
  {/if}
{/each}
