import { HOW_TO_START } from '#/content/vendor-landing'

export function HowToStart() {
  return (
    <section aria-label="How to start" className="mt-16">
      <h2 className="text-2xl font-bold">How to start</h2>
      <ol className="mt-4 grid gap-4 md:grid-cols-3">
        {HOW_TO_START.map((s, i) => (
          <li key={s.title} className="rounded-2xl border border-line bg-card p-5">
            <span className="grid size-8 place-items-center rounded-full bg-violet text-sm font-bold text-white">
              {i + 1}
            </span>
            <h3 className="mt-3 text-lg font-bold">{s.title}</h3>
            <p className="mt-1 text-sm text-mist">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
