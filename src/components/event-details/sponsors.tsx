import { safeHttpUrl } from '#/lib/url'
import type { EventSponsor } from '#/features/tickets/types'

const TIER_ORDER = [
  'presenting',
  'platinum',
  'gold',
  'silver',
  'bronze',
  'media',
  '',
] as const
const TIER_LABEL: Record<string, string> = {
  presenting: 'Presenting sponsor',
  platinum: 'Platinum sponsors',
  gold: 'Gold sponsors',
  silver: 'Silver sponsors',
  bronze: 'Bronze sponsors',
  media: 'Media partners',
  '': 'Sponsors',
}

function Logo({ s }: { s: EventSponsor }) {
  const body = s.logoUrl ? (
    <img src={s.logoUrl} alt={s.name} loading="lazy" className="h-10 w-auto max-w-32 object-contain" />
  ) : (
    <span className="text-sm font-semibold">{s.name}</span>
  )
  const href = safeHttpUrl(s.websiteUrl)
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {body}
    </a>
  ) : (
    body
  )
}

/** Sponsor logos, grouped by tier from presenting down to media. */
export function Sponsors({ sponsors }: { sponsors: Array<EventSponsor> }) {
  if (sponsors.length === 0) return null
  return (
    <section aria-label="Sponsors" className="mt-8">
      <h2 className="text-xl font-bold">Sponsors</h2>
      <div className="mt-3 space-y-4">
        {TIER_ORDER.map((tier) => {
          const group = sponsors
            .filter((s) => (s.tier ?? '') === tier)
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          if (group.length === 0) return null
          return (
            <div key={tier}>
              <h3 className="text-xs font-semibold tracking-[0.14em] text-mist uppercase">
                {TIER_LABEL[tier]}
              </h3>
              <ul className="mt-2 flex flex-wrap items-center gap-6">
                {group.map((s) => (
                  <li key={s.id}>
                    <Logo s={s} />
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}
