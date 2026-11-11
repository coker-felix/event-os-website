import { HOW_TO_START } from '#/content/vendor-landing'

interface Step {
  title: string
  body: string
}

export function HowToStart({ steps = HOW_TO_START }: { steps?: Array<Step> }) {
  return (
    <section aria-label="How to start" className="mt-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold tracking-[0.16em] text-violet-ink uppercase">
          A clear path forward
        </p>
        <h2 className="mt-3 text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
          From setup to your next booking.
        </h2>
      </div>
      <ol className="mt-8 grid gap-4 md:grid-cols-3">
        {steps.map((s, i) => (
          <li
            key={s.title}
            className="lift-card rounded-3xl border border-line bg-card p-6 sm:p-7"
          >
            <span className="grid size-11 place-items-center rounded-full bg-ink text-sm font-bold text-white">
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
