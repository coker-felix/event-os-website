import { Link } from '@tanstack/react-router'
import { HERO } from '#/content/vendor-landing'
import { portalUrl } from '#/features/vendors/portal'

export function VendorHero() {
  return (
    <section
      aria-label="Get booked at events"
      className="rounded-3xl bg-ink p-6 text-white sm:p-10"
    >
      <p className="text-xs font-semibold tracking-[0.18em] text-white/70 uppercase">
        {HERO.eyebrow}
      </p>
      <h1 className="mt-3 max-w-2xl text-4xl leading-[1.05] font-extrabold sm:text-5xl">
        {HERO.headline}
      </h1>
      <p className="mt-4 max-w-xl text-lg text-white/80">{HERO.subline}</p>
      <div className="mt-7 flex flex-wrap items-center gap-3">
        <Link
          to="/vendors/callouts"
          className="inline-flex h-12 items-center rounded-full bg-white px-6 font-semibold text-ink hover:bg-white/90"
        >
          See open callouts
        </Link>
        <a
          href={portalUrl('/register')}
          className="inline-flex h-12 items-center rounded-full border border-white/40 px-6 font-semibold hover:border-white"
        >
          Create your profile
        </a>
      </div>
    </section>
  )
}
