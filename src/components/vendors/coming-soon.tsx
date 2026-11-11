import { COMING_SOON } from '#/content/vendor-landing'

interface Item {
  id: string
  title: string
  body: string
}

/** Not live yet, and visibly so: a dashed box that says "Coming soon". */
export function ComingSoon({ items = COMING_SOON }: { items?: Array<Item> }) {
  return (
    <section
      aria-label="Coming soon"
      className="mt-16 rounded-3xl border border-dashed border-line bg-card p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-5">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-violet-ink uppercase">
            On the roadmap
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Coming soon</h2>
        </div>
        <p className="text-sm text-mist">Not available yet.</p>
      </div>
      <ul className="mt-5 grid gap-4 md:grid-cols-3">
        {items.map((c) => (
          <li key={c.id} className="rounded-2xl bg-background p-4">
            <h3 className="font-bold">{c.title}</h3>
            <p className="mt-1 text-sm text-mist">{c.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
