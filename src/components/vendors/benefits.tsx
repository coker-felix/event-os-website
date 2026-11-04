import { BadgeCheck, CalendarCheck, FileText, Rocket } from 'lucide-react'
import { BENEFITS } from '#/content/vendor-landing'
import type { Benefit } from '#/content/vendor-landing'

const ICONS: Record<Benefit['id'], React.ComponentType<{ className?: string }>> = {
  calendar: CalendarCheck,
  contract: FileText,
  verified: BadgeCheck,
  start: Rocket,
}

export function Benefits() {
  return (
    <section aria-label="What you get today" className="mt-16">
      <h2 className="text-2xl font-bold">What you get today</h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {BENEFITS.map((b) => {
          const Icon = ICONS[b.id]
          return (
            <li key={b.id} className="flex gap-4 rounded-2xl border border-line bg-card p-5">
              <Icon className="size-7 shrink-0 text-violet-ink" aria-hidden />
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
