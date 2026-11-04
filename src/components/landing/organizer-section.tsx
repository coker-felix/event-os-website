import { useId, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { Reveal } from '#/components/motion/reveal'
import { CLOSING, HERO, PERSONAS, PILLARS } from '#/content/organizer-landing'
import { portalUrl } from '#/features/vendors/portal'
import { CTA } from '#/lib/cta'
import { nextTab } from '#/lib/tabs'

/** The pitch to organizers, on the attendee landing page. */
export function OrganizerSection() {
  return (
    <section id="organizers" aria-labelledby="organizers-h" className="mt-20">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-mist uppercase">
            {HERO.eyebrow}
          </p>
          <h2
            id="organizers-h"
            className="mt-3 text-3xl leading-tight font-extrabold sm:text-4xl"
          >
            {HERO.headline}
          </h2>
          <p className="mt-3 max-w-md text-lg text-mist">{HERO.subline}</p>
          <a href={portalUrl('/register')} className={`mt-6 ${CTA.primary}`}>
            {HERO.cta}
          </a>
        </div>
        <DashboardIllustration />
      </div>

      <Reveal>
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {PILLARS.map((p) => (
            <li key={p.id} className="rounded-2xl border border-line bg-card p-6">
              <h3 className="text-lg font-bold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">{p.body}</p>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal>
        <PersonaTabs />
      </Reveal>

      <Reveal>
        <div className="mt-6 rounded-2xl bg-ink p-6 text-white sm:p-10">
          <h3 className="max-w-xl text-2xl leading-tight font-extrabold sm:text-3xl">
            {CLOSING.heading}
          </h3>
          <p className="mt-2 max-w-md text-white/80">{CLOSING.body}</p>
          <a href={portalUrl('/register')} className={`mt-6 ${CTA.onDark}`}>
            {CLOSING.cta}
          </a>
        </div>
      </Reveal>
    </section>
  )
}

function PersonaTabs() {
  const [index, setIndex] = useState(0)
  const base = useId()
  const refs = useRef<Array<HTMLButtonElement | null>>([])
  const active = PERSONAS[index]

  function onKeyDown(e: React.KeyboardEvent, i: number) {
    const next = nextTab(i, e.key, PERSONAS.length)
    if (next === null) return
    e.preventDefault()
    setIndex(next)
    refs.current[next]?.focus()
  }

  return (
    <div className="mt-6 rounded-2xl border border-line bg-card p-6">
      <div role="tablist" aria-label="What kind of event do you run?" className="flex flex-wrap gap-2">
        {PERSONAS.map((p, i) => (
          <button
            key={p.id}
            ref={(el) => {
              refs.current[i] = el
            }}
            role="tab"
            type="button"
            id={`${base}-tab-${p.id}`}
            aria-selected={i === index}
            aria-controls={`${base}-panel`}
            tabIndex={i === index ? 0 : -1}
            onClick={() => setIndex(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={i === index ? CTA.chipOn : CTA.chipOff}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`${base}-panel`}
        aria-labelledby={`${base}-tab-${active.id}`}
        className="mt-6"
      >
        <h3 className="text-xl font-bold">{active.headline}</h3>
        <ul className="mt-4 space-y-3">
          {active.points.map((pt) => (
            <li key={pt} className="flex gap-3 text-sm">
              <Check className="mt-0.5 size-4 shrink-0 text-violet-ink" aria-hidden />
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/** A drawn picture of the idea: the public page on one side, the dashboard on the other. */
function DashboardIllustration() {
  const bar = (w: string) => <span className={`block h-2 rounded-sm bg-line ${w}`} />
  const chip = (t: string) => (
    <span className="rounded-sm bg-secondary px-2 py-0.5 text-[11px] font-medium text-foreground">
      {t}
    </span>
  )
  return (
    <figure aria-hidden className="grid grid-cols-2 gap-3">
      <div className="rounded-xl border border-line bg-card p-4 shadow-sm">
        <p className="text-[11px] font-medium text-mist">Your event page</p>
        <span className="mt-3 block h-14 rounded-lg bg-secondary" />
        <div className="mt-3 space-y-2">
          {bar('w-3/4')}
          {bar('w-1/2')}
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between rounded-md border border-line px-2 py-1.5">
            {bar('w-10')}
            <span className="size-4 rounded-sm bg-line" />
          </div>
          <div className="flex items-center justify-between rounded-md border border-line px-2 py-1.5">
            {bar('w-12')}
            <span className="size-4 rounded-sm bg-line" />
          </div>
        </div>
        <span className="mt-4 block h-7 rounded-sm bg-primary" />
      </div>
      <div className="rounded-xl border border-line bg-card p-4 shadow-sm">
        <p className="text-[11px] font-medium text-mist">Your dashboard</p>
        <div className="mt-3 space-y-3">
          {[
            ['Tickets', <span key="t" className="block h-2 w-16 rounded-sm bg-primary" />],
            ['Guests', <span key="g" className="block h-2 w-10 rounded-sm bg-primary/60" />],
            ['Vendors', chip('Booked')],
            ['Venue', chip('Reserved')],
            ['Budget', <span key="b" className="block h-2 w-12 rounded-sm bg-primary/40" />],
          ].map(([label, mark]) => (
            <div key={label as string} className="flex items-center justify-between gap-2 text-[11px]">
              <span className="font-medium">{label}</span>
              {mark}
            </div>
          ))}
        </div>
      </div>
      <figcaption className="sr-only">Illustration</figcaption>
    </figure>
  )
}
