import { useId, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { CLOSING, HERO, PERSONAS, PILLARS } from '#/content/organizer-landing'
import { portalUrl } from '#/features/vendors/portal'
import { CTA } from '#/lib/cta'
import { nextTab } from '#/lib/tabs'

/** Full-width hero for the organizers page. */
export function OrganizerHero() {
  return (
    <section
      aria-label="Run your entire event"
      className="full-bleed animate-in bg-ink text-white duration-700 fade-in slide-in-from-bottom-2"
    >
      <div className="mx-auto grid min-h-[26rem] max-w-6xl items-center gap-10 px-4 py-10 sm:py-14 lg:min-h-[min(70vh,36rem)] lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-white/70 uppercase">
            {HERO.eyebrow}
          </p>
          <h1 className="mt-3 max-w-xl text-4xl leading-[1.05] font-extrabold sm:text-5xl">
            {HERO.headline}
          </h1>
          <p className="mt-4 max-w-md text-lg text-white/80">{HERO.subline}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href={portalUrl('/register')} className={CTA.onDark}>
              {HERO.cta}
            </a>
            <a href="#features" className={CTA.outlineOnDark}>
              See what you get
            </a>
          </div>
        </div>
        <DashboardIllustration />
      </div>
    </section>
  )
}

export function OrganizerPillars() {
  return (
    <section id="features" aria-label="What you get" className="mt-16">
      <h2 className="text-2xl font-bold">Everything in one place</h2>
      <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((p) => (
          <li key={p.id} className="lift-card rounded-2xl border border-line bg-card p-6">
            <h3 className="text-lg font-bold">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mist">{p.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function OrganizerPartnerships() {
  return (
    <section aria-labelledby="organizer-partnerships-title" className="mt-16">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.16em] text-violet-ink uppercase">
          Grow your event network
        </p>
        <h2
          id="organizer-partnerships-title"
          className="mt-2 text-3xl leading-tight font-bold tracking-tight sm:text-4xl"
        >
          Bring sponsors and sales partners into the plan.
        </h2>
        <p className="mt-3 text-base leading-relaxed text-mist">
          Keep the relationships around your event visible alongside the work
          happening in your organizer dashboard.
        </p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="lift-card rounded-2xl border border-line bg-card p-6 sm:p-7">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">
            Sponsors
          </p>
          <h3 className="mt-2 text-xl font-bold">Work with sponsors across events.</h3>
          <p className="mt-2 text-sm leading-relaxed text-mist">
            Keep a reusable sponsor list, add partners to an event page and set
            how each sponsor is featured.
          </p>
        </article>
        <article className="lift-card rounded-2xl border border-line bg-card p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold tracking-wide text-primary uppercase">
              Resellers
            </p>
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-primary">
              Coming soon
            </span>
          </div>
          <h3 className="mt-2 text-xl font-bold">Keep reseller sales in view.</h3>
          <p className="mt-2 text-sm leading-relaxed text-mist">
            Planned dashboard tools will help you manage reseller partners,
            attribute ticket sales and track commissions.
          </p>
        </article>
      </div>
    </section>
  )
}

const PARTNER_SERVICES = [
  { title: 'Physical ticket printing', body: 'Printed tickets for box office and event entry.' },
  { title: 'Ticket wristbands', body: 'Wristbands for admission and access control.' },
  { title: 'On-site scanning', body: 'Check-in support at the gate on event day.' },
  { title: 'Banners and flyers', body: 'Printed materials to promote and signpost your event.' },
  { title: 'Headphones and event kit', body: 'Equipment for the details around your event.' },
] as const

export function OrganizerPartnerServices() {
  return (
    <section aria-labelledby="organizer-partner-services-title" className="mt-16">
      <div className="grid gap-5 border-b border-line pb-6 md:grid-cols-[1fr_auto] md:items-end">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.16em] text-violet-ink uppercase">
            EventRail partner vendors
          </p>
          <h2
            id="organizer-partner-services-title"
            className="mt-2 text-3xl leading-tight font-bold tracking-tight sm:text-4xl"
          >
            Get practical help for event day.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-mist">
            Find vendors who work with EventRail for the services that keep
            tickets, entry and event promotion moving.
          </p>
        </div>
        <Link to="/vendors/directory" className={CTA.outline}>
          Browse vendors
        </Link>
      </div>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PARTNER_SERVICES.map((service) => (
          <li
            key={service.title}
            className="rounded-xl border border-line bg-card p-5"
          >
            <h3 className="font-bold">{service.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-mist">{service.body}</p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-mist">
        Look for the Partnered badge in the vendor directory. Services vary by location.
      </p>
    </section>
  )
}

export function OrganizerPersonas() {
  return (
    <section id="who" aria-label="Who it is for" className="mt-16">
      <h2 className="text-2xl font-bold">Built for the way you run events</h2>
      <PersonaTabs />
    </section>
  )
}

export function OrganizerClosing() {
  return (
    <section aria-label={CLOSING.cta} className="mt-16 rounded-3xl bg-ink p-6 text-white sm:p-10">
      <h2 className="max-w-xl text-3xl leading-tight font-extrabold">{CLOSING.heading}</h2>
      <p className="mt-2 max-w-md text-white/80">{CLOSING.body}</p>
      <a href={portalUrl('/register')} className={`mt-6 ${CTA.onDark}`}>
        {CLOSING.cta}
      </a>
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
    <div className="mt-4 rounded-2xl border border-line bg-card p-6">
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
            ['Promotion', chip('Featured')],
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
