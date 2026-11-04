import { BarChart3, Building2, CalendarCheck, FileText } from 'lucide-react'
import { BENEFITS } from '#/content/venue-landing'
import type { Benefit } from '#/content/venue-landing'

const ICONS: Record<Benefit['id'], React.ComponentType<{ className?: string }>> = {
  profile: Building2,
  calendar: CalendarCheck,
  contract: FileText,
  insights: BarChart3,
}

export function VenueBenefits() {
  return (
    <section aria-label="What you get today" className="mt-16">
      <h2 className="text-2xl font-bold">What you get today</h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {BENEFITS.map((b) => {
          const Icon = ICONS[b.id]
          return (
            <li key={b.id} className="flex gap-4 rounded-2xl border border-line bg-card p-5">
              <Icon className="size-7 shrink-0 text-violet" aria-hidden />
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
