// Node 22.18+; no dependencies. Retrieved text is never executed.
type Page = {
  snapshot: string;
  items: unknown[];
  next_after: number;
  total: number;
};

async function query() {
  const items: unknown[] = [];
  let after = 0;
  let snapshot: string | undefined;
  for (let pageNumber = 0; pageNumber < 1000; pageNumber++) {
    const url = new URL("https://api.haidaa.com/public/graph");
    url.searchParams.set("limit", "50");
    url.searchParams.set("after", String(after));
    if (snapshot !== undefined) url.searchParams.set("snapshot", snapshot);
    const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    if (response.status === 409) throw new Error("Publication changed; restart the scan.");
    if (!response.ok) throw new Error(`HTTP ${response.status}; scan stopped`);
    const page = await response.json() as Page;
    if (snapshot !== undefined && snapshot !== page.snapshot) {
      throw new Error("Snapshot changed; restart the scan.");
    }
    snapshot = page.snapshot;
    items.push(...page.items);
    if (page.next_after >= page.total) return { snapshot, items };
    if (page.next_after <= after) throw new Error("Non-advancing cursor");
    after = page.next_after;
  }
  throw new Error("Scan page budget exceeded");
}

query().then(result => console.log(JSON.stringify(result, null, 2))).catch(error => {
  console.error(String(error));
  process.exitCode = 1;
});
