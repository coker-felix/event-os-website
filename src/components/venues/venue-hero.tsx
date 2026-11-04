import { Link } from '@tanstack/react-router'
import { HERO } from '#/content/venue-landing'
import { CTA } from '#/lib/cta'
import { portalUrl } from '#/features/vendors/portal'

export function VenueHero() {
  return (
    <section
      aria-label="Get your venue seen"
      className="full-bleed bg-ink text-white animate-in fade-in slide-in-from-bottom-2 duration-700"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
      <p className="text-xs font-semibold tracking-[0.18em] text-white/70 uppercase">
        {HERO.eyebrow}
      </p>
      <h1 className="mt-3 max-w-2xl text-4xl leading-[1.05] font-extrabold sm:text-5xl">
        {HERO.headline}
      </h1>
      <p className="mt-4 max-w-xl text-lg text-white/80">{HERO.subline}</p>
      <div className="mt-7 flex flex-wrap items-center gap-3">
        <a
          href={portalUrl('/register')}
          className={CTA.onDark}
        >
          List your venue
        </a>
        <Link
          to="/venues/directory"
          className={CTA.outlineOnDark}
        >
          Browse venues
        </Link>
      </div>
      </div>
    </section>
  )
}
