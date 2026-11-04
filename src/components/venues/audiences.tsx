import { AUDIENCES } from '#/content/venue-landing'

export function Audiences() {
  return (
    <section aria-label="Who it's for" className="mt-16">
      <h2 className="text-2xl font-bold">Who it's for</h2>
      <ul className="mt-4 grid gap-4 md:grid-cols-2">
        {AUDIENCES.map((a) => (
          <li key={a.id} className="rounded-2xl border border-line bg-card p-5">
            <h3 className="text-lg font-bold">{a.who}</h3>
            <p className="mt-2 text-lg font-semibold text-violet">“{a.situation}”</p>
            <p className="mt-2 text-mist">{a.today}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
