export interface Stat {
  value: number | null | undefined
  label: string
}

const fmt = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

/**
 * A row of real platform numbers. A stat with no value (failed call) or a
 * value of 0 is dropped; with nothing left the whole band disappears.
 */
export function StatBand({
  heading,
  stats,
  tone = 'light',
}: {
  heading: string
  stats: Array<Stat>
  tone?: 'light' | 'dark'
}) {
  const shown = stats.filter(
    (s): s is { value: number; label: string } =>
      typeof s.value === 'number' && s.value > 0,
  )
  if (shown.length === 0) return null
  const dark = tone === 'dark'
  return (
    <section
      aria-label={heading}
      className={
        dark
          ? 'rounded-2xl border border-foreground/10 bg-secondary p-6'
          : 'rounded-2xl border border-line bg-card p-6'
      }
    >
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">
        {heading}
      </h2>
      <dl className="mt-4 flex flex-wrap gap-x-10 gap-y-4">
        {shown.map((s) => (
          <div key={s.label}>
            <dd className="font-display text-4xl leading-none font-extrabold tabular-nums">
              {fmt.format(s.value)}
            </dd>
            <dt className="mt-1 text-sm text-mist">{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  )
}
