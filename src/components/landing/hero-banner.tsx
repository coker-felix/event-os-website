import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, TicketCheck } from 'lucide-react'
import { DEFAULT_BANNER } from '#/features/banners/queries'
import { CTA } from '#/lib/cta'
import type { Banner } from '#/features/banners/types'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=85'

/** Homepage hero with the featured event image and live discovery controls below it. */
export function HeroBanner() {
  const active = DEFAULT_BANNER
  return (
    <section
      id="events"
      aria-label="What's on"
      className="relative left-1/2 z-10 -mt-10 mb-0 w-screen -translate-x-1/2"
    >
      <div className="relative isolate overflow-hidden bg-[#123f32] text-white shadow-[0_24px_60px_-36px_rgba(14,51,38,0.55)]">
        <div className="grid md:min-h-[34rem] md:grid-cols-[1.08fr_0.92fr]">
          <div className="flex flex-col items-start justify-center px-6 pt-9 pb-8 sm:px-10 sm:pt-12 sm:pb-10 lg:px-12 lg:py-14">
            <div
              className="max-w-2xl"
            >
              <p className="text-xs font-bold tracking-[0.2em] text-emerald-100/75 uppercase">
                What's on
              </p>
              <h1 className="mt-4 text-4xl leading-[1.03] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                {active.title}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
                {active.subtitle ||
                  'Browse upcoming events and get your tickets in a few taps.'}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <BannerLink
                  banner={active}
                  className={`${CTA.onDark} min-h-12 rounded-full px-6`}
                >
                  {active.ctaLabel || 'Browse all events'}
                  <ArrowRight className="size-4" aria-hidden />
                </BannerLink>
                <a
                  href="#how-it-works"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  How it works
                </a>
              </div>
            </div>
          </div>

          <div className="relative min-h-64 overflow-hidden sm:min-h-80 md:min-h-full">
            <HeroImage banner={active} />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-[#0b2d22]/75 via-[#0b2d22]/10 to-transparent md:bg-gradient-to-r md:from-[#123f32]/55 md:via-transparent md:to-transparent"
            />
            <div className="absolute right-4 bottom-20 left-4 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/15 p-3 shadow-lg backdrop-blur-xl sm:right-6 sm:left-auto sm:max-w-xs sm:px-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#f7f3eb] text-[#123f32]">
                <TicketCheck className="size-5" aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-semibold">
                  Ticket ready for the door
                </span>
                <span className="mt-0.5 block text-xs text-white/75">
                  Tied to your contact details
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HeroImage({ banner }: { banner: Banner }) {
  const [failed, setFailed] = useState(false)
  const image = failed ? FALLBACK_IMAGE : banner.imageUrl || FALLBACK_IMAGE

  return (
    <div aria-hidden className="absolute inset-0 bg-[#123f32]">
      <img
        key={image}
        src={image}
        alt=""
        onError={() => {
          if (!failed) setFailed(true)
        }}
        className="size-full object-cover"
      />
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
