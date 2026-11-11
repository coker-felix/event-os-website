export interface ComingSoonItem { id: string; title: string; body: string }

export function ComingSoon({ items }: { items: Array<ComingSoonItem> }) {
  return <section aria-label="Coming soon" className="mt-6 rounded-2xl border-2 border-dashed border-line p-5">
    <h2 className="text-xl font-bold">Coming soon</h2>
    <ul className="mt-3 grid gap-4 sm:grid-cols-2">{items.map((item) => <li key={item.id}><h3 className="font-bold">{item.title}</h3><p className="mt-1 text-sm text-muted-foreground">{item.body}</p></li>)}</ul>
  </section>
}
