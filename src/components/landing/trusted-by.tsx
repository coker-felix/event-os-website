import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { MOCKS_ENABLED } from '#/lib/mocks'
import { TRUSTED_BRANDS } from '#/content/trusted-brands'
import { MOCK_TRUSTED } from '#/features/mocks/trusted'
import { visibleBrands } from '#/features/trusted/visible'
import type { TrustedBrand } from '#/features/trusted/visible'

const KIND_LABEL = { organizer: 'Organizer', brand: 'Brand', sponsor: 'Sponsor' } as const

function Tile({ brand }: { brand: TrustedBrand }) {
  const inner = (
    <>
      {brand.logo ? (
        <img
          src={brand.logo}
          alt={brand.name}
          loading="lazy"
          className="max-h-10 max-w-[70%] object-contain grayscale transition hover:grayscale-0"
        />
      ) : (
        <span className="px-3 text-center font-display text-lg leading-tight font-extrabold text-ink">
          {brand.name}
        </span>
      )}
      {brand.kind && (
        <span className="mt-2 text-[11px] font-medium text-neutral-500">{KIND_LABEL[brand.kind]}</span>
      )}
    </>
  )
  const cls = 'flex h-28 flex-col items-center justify-center bg-white'
  return brand.href ? (
    <a
      href={brand.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${cls} hover:bg-neutral-50`}
    >
      {inner}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  )
}

/**
 * Partners EventRail has worked with. The list is static
 * (`src/content/trusted-brands.ts`); with no entries the section is hidden.
 * In dev, invented placeholders stand in so the design can be seen.
 */
export function TrustedBy() {
  const rail = useRef<HTMLUListElement>(null)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const touchResume = useRef<number | undefined>(undefined)
  const real = visibleBrands(TRUSTED_BRANDS)
  // The dev placeholders are our own code (inlined data: URLs), so they skip the
  // URL check that guards the real list.
  const brands = real.length > 0 ? real : MOCKS_ENABLED ? MOCK_TRUSTED : []

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(
    () => () => {
      if (touchResume.current !== undefined) {
        window.clearTimeout(touchResume.current)
      }
    },
    [],
  )

  useEffect(() => {
    if (paused || reducedMotion || brands.length < 2) return
    const interval = window.setInterval(() => {
      const element = rail.current
      if (!element || document.hidden) return
      const maxScroll = element.scrollWidth - element.clientWidth
      if (maxScroll <= 0) return
      const firstCard = element.querySelector('li')
      const step = firstCard
        ? firstCard.getBoundingClientRect().width + 12
        : 280
      if (element.scrollLeft + step >= maxScroll - 8) {
        element.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        element.scrollBy({ left: step, behavior: 'smooth' })
      }
    }, 4200)
    return () => window.clearInterval(interval)
  }, [brands.length, paused, reducedMotion])

  function resumeTouch() {
    if (touchResume.current !== undefined) window.clearTimeout(touchResume.current)
    touchResume.current = window.setTimeout(() => setPaused(false), 2200)
  }

  function scrollPartners(direction: -1 | 1) {
    rail.current?.scrollBy({
      left: direction * 280,
      behavior: reducedMotion ? 'auto' : 'smooth',
    })
  }

  if (brands.length === 0) return null
  return (
    <section
      aria-labelledby="trusted-h"
      className="mt-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false)
        }
      }}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={resumeTouch}
      onTouchCancel={resumeTouch}
    >
      <h2 id="trusted-h" className="max-w-2xl text-2xl leading-tight font-extrabold sm:text-3xl">
        Trusted by the brands behind Africa's biggest experiences
      </h2>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-mist">
          Organizers, brands and sponsors we've worked with.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Scroll partners left"
            onClick={() => scrollPartners(-1)}
            className="grid size-10 place-items-center rounded-full border border-line bg-card text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ArrowLeft className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Scroll partners right"
            onClick={() => scrollPartners(1)}
            className="grid size-10 place-items-center rounded-full border border-line bg-card text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
      <ul
        ref={rail}
        aria-label="Organizers, brands and sponsors"
        aria-roledescription="carousel"
        className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2"
      >
        {brands.map((b) => (
          <li
            key={b.name}
            className="w-44 shrink-0 snap-start overflow-hidden rounded-xl border border-line bg-white sm:w-52"
          >
            <Tile brand={b} />
          </li>
        ))}
      </ul>
    </section>
  )
}
