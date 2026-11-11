import { Link } from '@tanstack/react-router'
import {
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  CalendarDays,
  Check,
  Clock3,
} from 'lucide-react'
import { HERO } from '#/content/venue-landing'
import { CTA } from '#/lib/cta'
import { portalUrl } from '#/features/vendors/portal'

export function VenueHero() {
  return (
    <section
      aria-label="Run your venue with EventRail"
      className="full-bleed relative isolate overflow-hidden animate-in bg-ink text-white duration-700 fade-in slide-in-from-bottom-2"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_40%,rgba(51,137,99,0.4),transparent_38%),radial-gradient(ellipse_at_15%_100%,rgba(18,81,54,0.8),transparent_45%),linear-gradient(112deg,#0c2018_0%,#164632_56%,#10453f_100%)]"
      />
      <div className="mx-auto grid min-h-[30rem] max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:min-h-[min(78vh,48rem)] lg:grid-cols-[1fr_0.95fr] lg:gap-14 lg:px-12">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-emerald-100/75 uppercase">
            {HERO.eyebrow}
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl leading-[1.03] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {HERO.headline}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            {HERO.subline}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href={portalUrl('/register')} className={CTA.onDark}>
              Set up your venue
            </a>
            <Link to="/venues/directory" className={CTA.outlineOnDark}>
              Browse venues <ArrowDownRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
        <VenueSchedulePreview />
      </div>
    </section>
  )
}

function VenueSchedulePreview() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-xl">
      <div
        aria-hidden
        className="absolute -inset-4 rounded-[2rem] bg-emerald-200/10 blur-2xl"
      />
      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-2 shadow-2xl backdrop-blur-sm sm:p-3">
        <div className="overflow-hidden rounded-2xl bg-[#f7f4ec] text-[#183b2d]">
          <div className="flex items-center gap-2 bg-[#112b20] px-4 py-3">
            <span className="size-2.5 rounded-full bg-[#e79b7b]" />
            <span className="size-2.5 rounded-full bg-[#e5c875]" />
            <span className="size-2.5 rounded-full bg-[#87b995]" />
            <span className="ml-auto rounded-full bg-white/10 px-3 py-1 text-[10px] font-medium text-white/70">
              venue.eventrail.com
            </span>
          </div>
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-[#183b2d]/10 pb-4">
              <div>
                <p className="text-xs font-semibold text-[#4e7463]">
                  VENUE WORKSPACE
                </p>
                <h2 className="mt-1 text-lg font-bold sm:text-xl">
                  Bookings &amp; events
                </h2>
              </div>
              <span className="grid size-10 place-items-center rounded-xl bg-[#dfece3] text-[#1b6846]">
                <Building2 className="size-5" aria-hidden />
              </span>
            </div>
            <div className="mt-4 grid grid-cols-7 gap-1.5 text-center text-[10px] sm:gap-2 sm:text-xs">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div
                  key={`${day}-${i}`}
                  className="rounded-lg bg-white px-1 py-2 text-[#183b2d]/55"
                >
                  <span className="block">{day}</span>
                  <span className="mt-1 block font-semibold text-[#183b2d]">
                    {14 + i}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2.5">
              <VenueBooking
                title="Kente & Co. · Private dinner"
                detail="Main hall · Fri, 18:00"
                status="Confirmed"
                tone="confirmed"
              />
              <VenueBooking
                title="Accra Design Week"
                detail="Garden room · Sat, 10:00"
                status="Held date"
                tone="held"
              />
              <VenueBooking
                title="New booking request"
                detail="Studio space · Sun, 14:00"
                status="Review"
                tone="review"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="relative mt-3 ml-auto flex w-fit items-center gap-3 rounded-2xl border border-white/15 bg-[#183b2d]/95 p-3 shadow-xl backdrop-blur sm:mr-4 sm:p-4">
        <span className="grid size-10 place-items-center rounded-xl bg-emerald-100/15 text-emerald-100">
          <CalendarDays className="size-5" aria-hidden />
        </span>
        <span>
          <span className="block text-sm font-semibold">
            Every booking in view
          </span>
          <span className="mt-0.5 block text-xs text-white/65">
            EventRail, external and private
          </span>
        </span>
      </div>
    </div>
  )
}

function VenueBooking({
  title,
  detail,
  status,
  tone,
}: {
  title: string
  detail: string
  status: string
  tone: 'confirmed' | 'held' | 'review'
}) {
  const styles = {
    confirmed: 'bg-[#e7f1e8] text-[#246343]',
    held: 'bg-[#f5edda] text-[#84642b]',
    review: 'bg-[#e8edf3] text-[#47627f]',
  }
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#183b2d]/10 bg-white p-3">
      <span
        className={`grid size-9 shrink-0 place-items-center rounded-lg ${styles[tone]}`}
      >
        <Check className="size-4" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-bold sm:text-sm">
          {title}
        </span>
        <span className="mt-0.5 block truncate text-[10px] text-[#183b2d]/60 sm:text-xs">
          {detail}
        </span>
      </span>
      <span className="hidden items-center gap-1 rounded-full bg-[#f3eee3] px-2.5 py-1 text-[10px] font-semibold text-[#183b2d] sm:inline-flex">
        <Clock3 className="size-3" aria-hidden />
        {status}
      </span>
      <ArrowUpRight className="size-4 shrink-0 text-[#2e6f69]" aria-hidden />
    </div>
  )
}
