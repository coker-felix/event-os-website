import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'

const PANELS = [
  {
    to: '/vendors',
    kicker: 'For vendors',
    title: 'Reach more events and more people',
    cta: 'Explore vendor tools',
  },
  {
    to: '/venues',
    kicker: 'For venues',
    title: 'Get your venue seen and manage every booking in one place',
    cta: 'Explore venue tools',
  },
] as const

export function PartnerStrip() {
  return (
    <section aria-label="For vendors and venues" className="mt-16">
      <ul className="grid gap-4 md:grid-cols-2">
        {PANELS.map((p) => (
          <li key={p.to}>
            <Link
              to={p.to}
              className="group flex h-full flex-col justify-between gap-8 rounded-2xl bg-ink p-6 text-white transition-colors hover:bg-violet sm:p-8"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                  {p.kicker}
                </p>
                <h2 className="mt-2 max-w-sm text-2xl leading-tight font-bold">
                  {p.title}
                </h2>
              </div>
              <span className="inline-flex items-center gap-1.5 font-semibold">
                {p.cta}
                <ArrowUpRight
                  className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
