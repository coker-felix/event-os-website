import { BadgeCheck, CalendarCheck, FileText, Rocket } from 'lucide-react'
import { BENEFITS } from '#/content/vendor-landing'
import type { Benefit } from '#/content/vendor-landing'

const ICONS: Record<
  Benefit['id'],
  React.ComponentType<{ className?: string }>
> = {
  calendar: CalendarCheck,
  contract: FileText,
  verified: BadgeCheck,
  start: Rocket,
}

export function Benefits() {
  return (
    <section aria-label="What you get today" className="mt-20">
      <div className="grid gap-4 border-b border-line pb-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-violet-ink uppercase">
            Available today
          </p>
          <h2 className="mt-2 text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
            The essentials to keep work moving.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-mist">
          Useful tools for finding work, managing dates and delivering with
          confidence.
        </p>
      </div>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2">
        {BENEFITS.map((b) => {
          const Icon = ICONS[b.id]
          return (
            <li
              key={b.id}
              className="lift-card flex gap-4 rounded-3xl border border-line bg-card p-6 sm:p-7"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                <Icon className="size-5" aria-hidden />
              </span>
              <div>
                <h3 className="text-lg font-bold">{b.title}</h3>
                <p className="mt-1 text-mist">{b.body}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
