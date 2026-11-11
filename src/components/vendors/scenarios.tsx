import { SCENARIOS } from '#/content/vendor-landing'

export function Scenarios() {
  return (
    <section aria-label="Who it's for" className="mt-20">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.16em] text-violet-ink uppercase">
          Built for working vendors
        </p>
        <h2 className="mt-2 text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
          Good work starts with clear expectations.
        </h2>
      </div>
      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {SCENARIOS.map((s) => (
          <li
            key={s.id}
            className="lift-card flex flex-col rounded-3xl border border-line bg-card p-6 sm:p-7"
          >
            <p className="text-xs font-semibold tracking-wide text-primary uppercase">
              {s.who}
            </p>
            <p className="mt-4 text-xl leading-snug font-semibold">
              “{s.situation}”
            </p>
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
