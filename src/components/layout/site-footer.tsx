import { Link } from '@tanstack/react-router'
import { FOOTER_COLUMNS } from '#/config/footer'
import { portalUrl } from '#/features/vendors/portal'
import { getJobs, getTeam } from '#/features/company/data'
import { useConsent } from '#/stores/consent'
import { BrandMark } from './brand-mark'

const LINK = 'text-white/80 hover:text-white'

export function SiteFooter() {
  const openSettings = useConsent((s) => s.openSettings)
  // Team and Careers appear only when there is something to show.
  const has = { team: getTeam().length > 0, careers: getJobs().length > 0 }
  // Community is always linked; /community explains coming soon / unavailable.
  const footerHas = { ...has, community: true }

  return (
    <footer className="mt-20 bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-3 lg:grid-cols-[1.4fr_repeat(7,1fr)]">
        <div className="sm:col-span-3 lg:col-span-1">
          <Link to="/" className="inline-flex items-center gap-2 font-display text-xl font-extrabold">
            <BrandMark light />
            EventRail
          </Link>
          <p className="mt-3 max-w-xs text-sm text-white/70">
            Find events and get tickets. Vendors and venues reach more people
            and manage bookings in one place.
          </p>
        </div>
        {FOOTER_COLUMNS.map((col) => (
          <nav key={col.heading} aria-label={col.heading}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              {col.heading}
            </h2>
            <ul className="mt-3 space-y-1 text-sm">
              {col.links
                .filter((l) => !('when' in l) || footerHas[l.when])
                .map((l) => (
                <li key={l.label}>
                  {'to' in l ? (
                    <Link
                      to={l.to}
                      hash={'hash' in l ? l.hash : undefined}
                      className={`inline-flex min-h-11 items-center ${LINK}`}
                    >
                      {l.label}
                    </Link>
                  ) : 'portal' in l ? (
                    <a
                      href={portalUrl(l.portal)}
                      className={`inline-flex min-h-11 items-center ${LINK}`}
                    >
                      {l.label}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={openSettings}
                      className={`inline-flex min-h-11 items-center ${LINK}`}
                    >
                      {l.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-white/60">
          <span>© {new Date().getFullYear()} EventRail. All rights reserved.</span>
          <a href="#top" className="inline-flex min-h-11 items-center hover:text-white">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  )
}
