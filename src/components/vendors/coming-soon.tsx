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
      className="mt-6 rounded-2xl border-2 border-dashed border-mist p-5"
    >
      <h2 className="text-xl font-bold">Coming soon</h2>
      <p className="mt-1 text-sm text-mist">Not available yet.</p>
      <ul className="mt-3 grid gap-4 md:grid-cols-3">
        {items.map((c) => (
          <li key={c.id}>
            <h3 className="font-bold">{c.title}</h3>
            <p className="mt-1 text-sm text-mist">{c.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
