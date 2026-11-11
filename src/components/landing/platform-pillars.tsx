import { Link } from '@tanstack/react-router'

/** The three pillars of the platform; each card leads to its section. */
export const PILLARS = [
  {
    title: 'Community',
    body: 'Discover people, build relationships, share knowledge',
    to: '/community',
    cta: 'Explore the community',
  },
  {
    title: 'Operations',
    body: 'Plan, coordinate, manage, and deliver events',
    to: '/organizers',
    cta: 'See organizer tools',
  },
  {
    title: 'Commerce',
    body: 'Find opportunities, book services, sell tickets, receive payments',
    to: '/vendors',
    cta: 'Find opportunities',
  },
] as const

export function PlatformPillars() {
  return (
    <section aria-labelledby="platform-pillars-title" className="mt-20">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.16em] text-violet-ink uppercase">
          EventRail ecosystem
        </p>
        <h2
          id="platform-pillars-title"
          className="mt-2 text-3xl leading-tight font-bold tracking-tight sm:text-4xl"
        >
          One platform for the work around events.
        </h2>
        <p className="mt-3 text-base leading-relaxed text-mist">
          The connected operating system for the event industry
        </p>
      </div>
      <ul className="mt-6 grid gap-4 sm:grid-cols-3">
        {PILLARS.map((pillar, index) => (
          <li key={pillar.title}>
            <Link
              to={pillar.to}
              className={`group flex h-full min-h-48 flex-col rounded-3xl border p-6 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${index === 1 ? 'border-ink bg-ink text-white hover:border-ink' : 'border-line bg-card hover:border-primary'}`}
            >
              <h3 className="text-xl font-bold">{pillar.title}</h3>
              <p
                className={`mt-2 flex-1 text-sm leading-relaxed ${index === 1 ? 'text-white/70' : 'text-mist'}`}
              >
                {pillar.body}
              </p>
              <span
                className={`mt-4 text-sm font-semibold ${index === 1 ? 'text-emerald-100' : 'text-primary'} group-hover:underline`}
              >
                {pillar.cta} <span aria-hidden="true">→</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
