import { Link } from '@tanstack/react-router'
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
} from 'lucide-react'
import { HERO } from '#/content/vendor-landing'
import { CTA } from '#/lib/cta'
import { portalUrl } from '#/features/vendors/portal'

export function VendorHero() {
  return (
    <section
      aria-label="Get booked at events"
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
            <Link to="/vendors/callouts" className={CTA.onDark}>
              See open callouts
            </Link>
            <a href={portalUrl('/register')} className={CTA.outlineOnDark}>
              Create your profile{' '}
              <ArrowDownRight className="size-4" aria-hidden />
            </a>
          </div>
        </div>
        <VendorOpportunitiesPreview />
      </div>
    </section>
  )
}

function VendorOpportunitiesPreview() {
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
              vendor.eventrail.com
            </span>
          </div>
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-[#183b2d]/10 pb-4">
              <div>
                <p className="text-xs font-semibold text-[#4e7463]">
                  YOUR WORKSPACE
                </p>
                <h2 className="mt-1 text-lg font-bold sm:text-xl">
                  Open callouts
                </h2>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dfece3] px-3 py-1.5 text-xs font-semibold text-[#1b6846]">
                <span className="size-1.5 rounded-full bg-[#28885c]" />
                Profile active
              </span>
            </div>
            <div className="mt-4 space-y-3">
              <Opportunity
                title="Accra Food & Music Weekend"
                type="Food vendors"
                place="Accra · 18–19 Jul"
                status="Apply now"
              />
              <Opportunity
                title="Parkside Sessions"
                type="Sound & lighting"
                place="Kumasi · 26 Jul"
                status="8 days left"
              />
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-[#e8e4d9] px-4 py-3 text-sm">
              <span className="flex items-center gap-2 font-semibold">
                <CalendarDays className="size-4 text-[#2e6f69]" aria-hidden />
                Your bookings
              </span>
              <span className="font-bold">4 dates</span>
            </div>
          </div>
        </div>
      </div>
      <div className="relative mt-3 ml-auto flex w-fit items-center gap-3 rounded-2xl border border-white/15 bg-[#183b2d]/95 p-3 shadow-xl backdrop-blur sm:mr-4 sm:p-4">
        <span className="grid size-10 place-items-center rounded-xl bg-emerald-100/15 text-emerald-100">
          <Check className="size-5" aria-hidden />
        </span>
        <span>
          <span className="block text-sm font-semibold">
            Dates stay in sync
          </span>
          <span className="mt-0.5 block text-xs text-white/65">
            Accepted bookings update your calendar
          </span>
        </span>
      </div>
    </div>
  )
}

function Opportunity({
  title,
  type,
  place,
  status,
}: {
  title: string
  type: string
  place: string
  status: string
}) {
  return (
    <div className="rounded-xl border border-[#183b2d]/10 bg-white p-3 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{title}</p>
          <p className="mt-1 text-xs text-[#183b2d]/60">{type}</p>
        </div>
        <ArrowUpRight className="size-4 shrink-0 text-[#2e6f69]" aria-hidden />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#183b2d]/65">
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-3.5" aria-hidden />
          {place}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#f3eee3] px-2.5 py-1 font-semibold">
          <Clock3 className="size-3.5" aria-hidden />
          {status}
        </span>
      </div>
    </div>
  )
}
