import { SCENARIOS } from '#/content/vendor-landing'

export function Scenarios() {
  return (
    <section aria-label="Who it's for" className="mt-16">
      <h2 className="text-2xl font-bold">Who it's for</h2>
      <ul className="mt-4 grid gap-4 md:grid-cols-3">
        {SCENARIOS.map((s) => (
          <li key={s.id} className="flex flex-col rounded-2xl border border-line bg-card p-5">
            <h3 className="text-lg font-bold">{s.who}</h3>
            <p className="mt-2 text-lg font-semibold text-violet">“{s.situation}”</p>
            <p className="mt-2 text-mist">{s.today}</p>
            {s.soon && (
              <p className="mt-auto pt-4">
                <span className="inline-block rounded-full border border-dashed border-mist px-3 py-1 text-xs font-semibold">
                  Coming soon: {s.soon}
                </span>
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
