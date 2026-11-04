import { Link } from '@tanstack/react-router'

const COLUMNS = [
  {
    heading: 'Explore',
    links: [
      { label: 'All events', to: '/events' },
      { label: 'Blog', to: '/blog' },
    ],
  },
  {
    heading: 'Vendors',
    links: [
      { label: 'For vendors', to: '/vendors' },
      { label: 'Vendor callouts', to: '/vendors/callouts' },
    ],
  },
  {
    heading: 'Venues',
    links: [{ label: 'For venues', to: '/venues' }],
  },
  {
    heading: 'Help',
    links: [
      { label: 'Ticket self help', to: '/tickets/help' },
      { label: 'Contact us', to: '/contact' },
    ],
  },
] as const

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <Link to="/" className="font-display text-xl font-extrabold">
            Event OS
          </Link>
          <p className="mt-3 max-w-xs text-sm text-white/70">
            Find events and get tickets. Vendors and venues reach more people
            and manage bookings in one place.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.heading} aria-label={col.heading}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              {col.heading}
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-white/80 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-white/50">
          <span>© {new Date().getFullYear()} Event OS. All rights reserved.</span>
          <span>Events, vendors and venues, in one place.</span>
        </div>
      </div>
    </footer>
  )
}
