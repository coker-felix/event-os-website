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
    <section aria-labelledby="platform-pillars-title" className="mt-16">
      <div className="max-w-2xl">
        <h2
          id="platform-pillars-title"
          className="text-3xl leading-tight font-bold tracking-tight sm:text-4xl"
        >
          Event OS
        </h2>
        <p className="mt-3 text-base leading-relaxed text-mist">
          The connected operating system for the event industry
        </p>
      </div>
      <ul className="mt-8 grid gap-4 sm:grid-cols-3">
        {PILLARS.map((pillar) => (
          <li key={pillar.title}>
            <Link
              to={pillar.to}
              className="group flex h-full min-h-44 flex-col rounded-2xl border border-line bg-card p-6 transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <h3 className="text-xl font-bold">{pillar.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-mist">{pillar.body}</p>
              <span className="mt-4 text-sm font-semibold text-primary group-hover:underline">
                {pillar.cta} <span aria-hidden="true">→</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
