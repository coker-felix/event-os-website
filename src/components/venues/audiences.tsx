import { AUDIENCES } from '#/content/venue-landing'

export function Audiences() {
  return (
    <section aria-label="Who it's for" className="mt-20">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.16em] text-violet-ink uppercase">
          For venue teams and organizers
        </p>
        <h2 className="mt-2 text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
          Space to plan, room to adapt.
        </h2>
      </div>
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {AUDIENCES.map((a) => (
          <li
            key={a.id}
            className="lift-card rounded-3xl border border-line bg-card p-6 sm:p-7"
          >
            <p className="text-xs font-semibold tracking-wide text-primary uppercase">
              {a.who}
            </p>
            <p className="mt-4 text-xl leading-snug font-semibold">
              “{a.situation}”
            </p>
            <p className="mt-2 text-mist">{a.today}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
