import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { bannersQuery, DEFAULT_BANNER } from '#/features/banners/queries'
import { eventParts, toDate } from '#/features/events/format'
import type { Banner } from '#/features/banners/types'

const ROTATE_MS = 6000

const KICKER: Record<Banner['type'], string> = {
  event: 'Featured event',
  editorial: "Editor's pick",
  platform: 'Event OS',
}

/**
 * Banner slot. Server render and first paint always show the default
 * banner; banners are fetched in the browser with a short timeout and
 * swapped in if they arrive. The slot height is fixed so nothing jumps.
 */
export function HeroBanner() {
  const { data } = useQuery(bannersQuery)
  const banners = data && data.length > 0 ? data : [DEFAULT_BANNER]
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const active = banners[index % banners.length]
  const count = banners.length

  useEffect(() => {
    setIndex(0)
  }, [count])

  useEffect(() => {
    if (count < 2 || paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % count),
      ROTATE_MS,
    )
    return () => window.clearInterval(id)
  }, [count, paused])

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="full-bleed relative isolate overflow-hidden bg-ink text-white animate-in fade-in slide-in-from-bottom-2 duration-700"
    >
      <BannerBackground banner={active} />
      <div className="relative mx-auto flex min-h-[26rem] max-w-6xl flex-col justify-between gap-8 px-4 py-10 sm:py-14 md:flex-row md:items-end lg:min-h-[min(70vh,36rem)]">
        <div
          key={active.id}
          aria-live={paused ? 'polite' : 'off'}
          className="max-w-xl animate-in fade-in duration-500"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
            {KICKER[active.type]}
          </p>
          <h1 className="mt-3 text-4xl leading-[1.05] font-extrabold sm:text-5xl md:text-6xl">
            {active.title}
          </h1>
          {active.subtitle && (
            <p className="mt-4 max-w-md text-base text-white/80 sm:text-lg">
              {active.subtitle}
            </p>
          )}
          <BannerLink
            banner={active}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-ink hover:bg-white/90"
          >
            {active.ctaLabel}
            <ArrowRight className="size-4" aria-hidden />
          </BannerLink>
        </div>

        <div className="flex items-end justify-between gap-6 md:flex-col md:items-end">
          {active.type === 'event' && <DateStub banner={active} />}
          {count > 1 && (
            <div className="flex gap-2" role="group" aria-label="Choose highlight">
              {banners.map((b, i) => (
                <button
                  key={b.id}
                  type="button"
                  aria-label={`Show highlight ${i + 1} of ${count}: ${b.title}`}
                  aria-current={i === index % count}
                  onClick={() => setIndex(i)}
                  className={
                    i === index % count
                      ? 'h-2.5 w-8 rounded-full bg-white'
                      : 'h-2.5 w-2.5 rounded-full bg-white/40 hover:bg-white/70'
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function BannerBackground({ banner }: { banner: Banner }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [banner.imageUrl])
  const tint = banner.accentColor ?? '#0f766e'
  return (
    <div className="absolute inset-0 -z-10" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(900px 480px at 85% 0%, ${tint}, transparent 65%), radial-gradient(700px 400px at 0% 100%, #ff5a3655, transparent 60%)`,
        }}
      />
      {banner.imageUrl && !failed && (
        <img
          src={banner.imageUrl}
          alt=""
          onError={() => setFailed(true)}
          className="absolute inset-0 size-full object-cover"
        />
      )}
      {/* Keeps text readable over any image. */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/50 to-ink/20" />
    </div>
  )
}

function DateStub({ banner }: { banner: Banner }) {
  const date = toDate(banner.eventStartsAt)
  if (!date) return null
  const p = eventParts(date, banner.eventTimezone)
  return (
    <div className="rounded-2xl bg-flame px-5 py-3 text-center text-white shadow-lg">
      <div className="text-xs font-bold uppercase tracking-widest">
        {p.weekday} · {p.month}
      </div>
      <div className="font-display text-5xl leading-none font-extrabold">
        {p.day}
      </div>
      <div className="mt-1 text-xs font-medium">{p.time}</div>
    </div>
  )
}

function BannerLink({
  banner,
  className,
  children,
}: {
  banner: Banner
  className: string
  children: React.ReactNode
}) {
  if (/^https?:\/\//i.test(banner.href)) {
    return (
      <a
        href={banner.href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    )
  }
  return (
    <Link to={banner.href} className={className}>
      {children}
    </Link>
  )
}
