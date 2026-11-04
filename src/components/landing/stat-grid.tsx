import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { visibleStats } from '#/features/stats/visible'
import type { StatItem } from '#/features/stats/visible'

const fmt = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

/**
 * Real platform numbers as a grid of tiles. Missing or zero values are
 * dropped; with nothing left the section disappears. Tiles that lead
 * somewhere are links.
 */
export function StatGrid({
  heading,
  stats,
}: {
  heading: string
  stats: Array<StatItem>
}) {
  const shown = visibleStats(stats)
  if (shown.length === 0) return null
  return (
    <section aria-label={heading}>
      <h2 className="text-xs font-semibold tracking-[0.18em] text-mist uppercase">
        {heading}
      </h2>
      <dl
        className="mt-4 grid gap-px overflow-hidden rounded-2xl border border-line bg-line"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(9.5rem, 1fr))' }}
      >
        {shown.map((s) => {
          const body = (
            <>
              <span className="flex items-center justify-between text-xs font-medium text-mist">
                {s.group}
                {s.to && <ArrowUpRight className="size-3.5" aria-hidden />}
              </span>
              <dd className="mt-3 font-display text-4xl leading-none font-extrabold tabular-nums">
                {fmt.format(s.value)}
              </dd>
              <dt className="mt-1.5 text-sm text-mist">{s.label}</dt>
            </>
          )
          return s.to ? (
            <Link
              key={s.label}
              to={s.to}
              className="block bg-card p-5 transition-colors hover:bg-secondary"
            >
              <div>{body}</div>
            </Link>
          ) : (
            <div key={s.label} className="bg-card p-5">
              {body}
            </div>
          )
        })}
      </dl>
    </section>
  )
}
