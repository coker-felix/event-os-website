import { useId, useRef, useState } from 'react'
import {
  ArrowDownRight,
  Banknote,
  Check,
  CircleDollarSign,
  CreditCard,
  Megaphone,
  ScanLine,
  ShieldCheck,
  TicketCheck,
  UsersRound,
  WalletCards,
  Warehouse,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { CLOSING, HERO, PERSONAS } from '#/content/organizer-landing'
import { portalUrl } from '#/features/vendors/portal'
import { CTA } from '#/lib/cta'
import { nextTab } from '#/lib/tabs'

/** Full-width hero for the organizers page. */
export function OrganizerHero() {
  return (
    <section
      aria-label="Run your entire event"
      className="full-bleed relative isolate overflow-hidden animate-in bg-ink text-white duration-700 fade-in slide-in-from-bottom-2"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_40%,rgba(51,137,99,0.4),transparent_38%),radial-gradient(ellipse_at_15%_100%,rgba(18,81,54,0.8),transparent_45%),linear-gradient(112deg,#0c2018_0%,#164632_56%,#10453f_100%)]"
      />
      <div className="mx-auto grid min-h-[30rem] max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:min-h-[min(78vh,48rem)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-12">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-emerald-100/75 uppercase">
            {HERO.eyebrow}
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl leading-[1.03] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Publish, fill, and command your events from a single screen
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            Publish your event, coordinate trusted vendors and venues, manage
            ticket sales, and keep an eye on the door from one workspace.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href={portalUrl('/register')} className={CTA.onDark}>
              Launch your event
            </a>
            <a href="#workflow" className={CTA.outlineOnDark}>
              See the workflow
              <ArrowDownRight className="size-4" aria-hidden />
            </a>
          </div>
        </div>
        <div className="relative">
          <div
            aria-hidden
            className="absolute -inset-4 rounded-[2rem] bg-emerald-200/10 blur-2xl"
          />
          <DashboardIllustration />
        </div>
      </div>
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
        <article className="lift-card rounded-3xl border border-line bg-card p-6 sm:p-7">
          <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
            <UsersRound className="size-5" aria-hidden />
          </span>
          <p className="mt-5 text-xs font-semibold tracking-wide text-primary uppercase">
            Sponsors
          </p>
          <h3 className="mt-2 text-xl font-bold">
            Work with sponsors across events.
          </h3>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-mist">
            Keep a reusable sponsor list, add partners to an event page, and set
            how each sponsor is featured.
          </p>
          <div className="mt-5 rounded-2xl border border-line bg-background p-4">
            <p className="text-xs font-semibold text-mist">EVENT PARTNERS</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Main partner', 'Supporting partner', 'Community partner'].map(
                (label) => (
                  <span
                    key={label}
                    className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-foreground"
                  >
                    {label}
                  </span>
                ),
              )}
            </div>
          </div>
        </article>
        <article className="lift-card rounded-3xl border border-line bg-ink p-6 text-white sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-white/10 text-white">
              <WalletCards className="size-5" aria-hidden />
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white">
              Coming soon
            </span>
          </div>
          <p className="mt-5 text-xs font-semibold tracking-wide text-primary uppercase">
            Resellers
          </p>
          <h3 className="mt-2 text-xl font-bold">
            Keep reseller sales in view.
          </h3>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/75">
            Planned dashboard tools will help you manage reseller partners,
            attribute ticket sales, and track commissions.
          </p>
          <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div>
              <p className="text-sm font-semibold">Sales attribution</p>
              <p className="mt-1 text-xs text-white/70">
                Partner reporting tools
              </p>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80">
              Planned
            </span>
          </div>
        </article>
      </div>
    </section>
  )
}

const JOURNEY_STAGES = [
  {
    number: '01',
    icon: TicketCheck,
    title: 'Configure & publish',
    body: 'Build your event page, set ticket types and prices, and choose when sales open.',
    points: ['Event page and details', 'Ticket tiers and sales windows'],
  },
  {
    number: '02',
    icon: Warehouse,
    title: 'Coordinate vendors & venues',
    body: 'Request a venue and manage vendor bookings and callouts from your event workspace.',
    points: ['Venue booking requests', 'Vendor bookings and callouts'],
  },
  {
    number: '03',
    icon: Megaphone,
    title: 'Promote & sell',
    body: 'Share your event page, reach local attendees, and follow ticket sales as they come in.',
    points: [
      'Event discovery and sharing',
      'Sales and guest list in one place',
    ],
  },
  {
    number: '04',
    icon: ScanLine,
    title: 'Check in & settle',
    body: 'Scan ticket QR codes at the door. Sales are released to you after the event.',
    points: ['Phone-based QR check-in', 'Post-event payouts'],
  },
] as const

export function OrganizerJourney() {
  return (
    <section
      id="workflow"
      aria-labelledby="organizer-journey-title"
      className="mt-16 scroll-mt-8"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold tracking-[0.16em] text-violet-ink uppercase">
          The End-to-End Platform Journey
        </p>
        <h2
          id="organizer-journey-title"
          className="mt-3 text-3xl leading-tight font-bold tracking-tight sm:text-4xl"
        >
          Four stages. Fewer logistical blind spots.
        </h2>
        <p className="mt-3 text-base leading-relaxed text-mist">
          Run the key parts of your event lifecycle in one workspace, from your
          first ticket to the last check-in.
        </p>
      </div>
      <ol className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {JOURNEY_STAGES.map(({ number, icon: Icon, title, body, points }) => (
          <li
            key={number}
            className="lift-card rounded-3xl border border-line bg-card p-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold tracking-[0.12em] text-primary">
                {number}
              </span>
              <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                <Icon className="size-5" aria-hidden />
              </span>
            </div>
            <h3 className="mt-5 text-lg font-bold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mist">{body}</p>
            <ul className="mt-5 space-y-2 border-t border-line pt-4">
              {points.map((point) => (
                <li
                  key={point}
                  className="flex gap-2 text-xs leading-relaxed text-mist"
                >
                  <Check
                    className="mt-0.5 size-3.5 shrink-0 text-primary"
                    aria-hidden
                  />
                  {point}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  )
}

const RELIABILITY_FEATURES = [
  {
    icon: TicketCheck,
    title: 'Ticket and guest management',
    body: 'Set up ticket types, track sales, and keep your guest list close to event details.',
    wide: true,
    featured: false,
  },
  {
    icon: UsersRound,
    title: 'Vendor collaboration',
    body: 'Manage bookings, callouts, and event day details with your vendor partners.',
    featured: true,
    wide: false,
  },
  {
    icon: ScanLine,
    title: 'Door check-in',
    body: 'Scan ticket QR codes with a phone, even when the connection drops.',
    featured: false,
    wide: false,
  },
  {
    icon: Megaphone,
    title: 'Event promotion',
    body: 'Share your event page and request featured placement and attendee alerts.',
    featured: false,
    wide: false,
  },
  {
    icon: CircleDollarSign,
    title: 'Clear payout timing',
    body: 'Ticket sales are held and released to your account after the event.',
    featured: false,
    wide: false,
  },
] as const

export function OrganizerReliability() {
  return (
    <section
      id="features"
      aria-labelledby="organizer-reliability-title"
      className="mt-16 scroll-mt-8"
    >
      <div className="grid gap-4 border-b border-line pb-6 md:grid-cols-[1fr_auto] md:items-end">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.16em] text-violet-ink uppercase">
            Engineered for Reliability
          </p>
          <h2
            id="organizer-reliability-title"
            className="mt-2 text-3xl leading-tight font-bold tracking-tight sm:text-4xl"
          >
            Tools to keep event day moving.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-mist">
          Practical tools for ticketing, partner coordination, promotion, and
          check-in.
        </p>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {RELIABILITY_FEATURES.map(
          ({ icon: Icon, title, body, featured, wide }) => (
            <article
              key={title}
              className={`lift-card rounded-3xl border border-line p-6 ${featured ? 'bg-ink text-white' : 'bg-card'} ${wide || featured ? 'xl:col-span-3' : 'xl:col-span-2'}`}
            >
              <span
                className={`grid size-10 place-items-center rounded-xl ${featured ? 'bg-white/10 text-white' : 'bg-secondary text-primary'}`}
              >
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p
                className={`mt-2 text-sm leading-relaxed ${featured ? 'text-white/75' : 'text-mist'}`}
              >
                {body}
              </p>
            </article>
          ),
        )}
      </div>
    </section>
  )
}

export function OrganizerSecurity() {
  return (
    <section
      aria-labelledby="organizer-security-title"
      className="mt-16 rounded-3xl border border-line bg-card p-5 shadow-sm sm:p-8 lg:p-10"
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-10">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-violet-ink uppercase">
            Financial Security &amp; Compliance
          </p>
          <h2
            id="organizer-security-title"
            className="mt-3 max-w-xl text-3xl leading-tight font-bold tracking-tight sm:text-4xl"
          >
            Built around secure checkout and clear payout timing.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-mist">
            Attendees pay through Paystack’s secure checkout. Ticket proceeds
            are held and released to you after the event, with sales and guest
            details available in your organizer workspace.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <article className="rounded-2xl border border-line bg-background p-4">
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                Payments
              </p>
              <h3 className="mt-2 font-bold">Paystack checkout</h3>
              <p className="mt-1 text-sm leading-relaxed text-mist">
                Cards and mobile money are handled on Paystack’s payment page.
              </p>
            </article>
            <article className="rounded-2xl border border-line bg-background p-4">
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                Payouts
              </p>
              <h3 className="mt-2 font-bold">After your event</h3>
              <p className="mt-1 text-sm leading-relaxed text-mist">
                Ticket proceeds are released after the event.
              </p>
            </article>
          </div>
        </div>
        <aside className="rounded-3xl bg-ink p-6 text-white sm:p-7">
          <p className="text-xs font-semibold tracking-[0.15em] text-emerald-100/75 uppercase">
            Payment flow
          </p>
          <h3 className="mt-3 text-xl font-bold">
            One clear route from checkout to payout.
          </h3>
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4">
              <span className="grid size-9 place-items-center rounded-xl bg-white/10">
                <CreditCard className="size-4" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold">Attendee payment</p>
                <p className="mt-0.5 text-xs text-white/70">
                  Secure Paystack checkout
                </p>
              </div>
            </div>
            <div className="flex justify-center text-emerald-100">
              <span aria-hidden>↓</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4">
              <span className="grid size-9 place-items-center rounded-xl bg-white/10">
                <Banknote className="size-4" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold">Organizer payout</p>
                <p className="mt-0.5 text-xs text-white/70">
                  Released after the event
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

const PARTNER_SERVICES = [
  {
    title: 'Physical ticket printing',
    body: 'Printed tickets for box office and event entry.',
  },
  {
    title: 'Ticket wristbands',
    body: 'Wristbands for admission and access control.',
  },
  {
    title: 'On-site scanning',
    body: 'Check-in support at the gate on event day.',
  },
  {
    title: 'Banners and flyers',
    body: 'Printed materials to promote and signpost your event.',
  },
  {
    title: 'Headphones and event kit',
    body: 'Equipment for the details around your event.',
  },
] as const

export function OrganizerPartnerServices() {
  return (
    <section
      aria-labelledby="organizer-partner-services-title"
      className="mt-16"
    >
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
            <p className="mt-1 text-sm leading-relaxed text-mist">
              {service.body}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-mist">
        Look for the Partnered badge in the vendor directory. Services vary by
        location.
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
    <section
      id="start"
      aria-label={CLOSING.cta}
      className="mt-16 rounded-3xl bg-ink p-6 text-white sm:p-10"
    >
      <h2 className="max-w-xl text-3xl leading-tight font-extrabold">
        {CLOSING.heading}
      </h2>
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
      <div
        role="tablist"
        aria-label="What kind of event do you run?"
        className="flex flex-wrap gap-2"
      >
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
              <Check
                className="mt-0.5 size-4 shrink-0 text-violet-ink"
                aria-hidden
              />
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/** Decorative dashboard card for the organizer hero. */
function DashboardIllustration() {
  return (
    <figure
      aria-hidden
      className="rounded-3xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-4">
        <p className="text-xs font-semibold tracking-[0.12em] text-white/75 uppercase">
          Dashboard Pulse
        </p>
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-300/15 px-3 py-1.5 text-xs font-semibold text-emerald-100">
          <span className="size-2 rounded-full bg-emerald-300" />
          Live Gate Open
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-[#0b3025]/75 p-4 sm:p-5">
          <p className="text-xs text-white/60">Gross Box Office</p>
          <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            $48,920
          </p>
          <p className="mt-2 text-xs font-medium text-emerald-300">
            +24% vs last event
          </p>
        </div>
        <div className="rounded-2xl bg-[#0b3025]/75 p-4 sm:p-5">
          <p className="text-xs text-white/60">Sold / Capacity</p>
          <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            1,140{' '}
            <span className="text-base font-medium text-white/45">/ 1,200</span>
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
            <span className="block h-full w-[95%] rounded-full bg-emerald-300" />
          </div>
          <p className="mt-2 text-xs text-white/60">95% booked</p>
        </div>
      </div>

      <div className="mt-3 rounded-2xl bg-[#0b3025]/75 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-medium text-white/70">
            Active Vendor Squad
          </p>
          <p className="text-xs font-semibold text-white">4 Confirmed</p>
        </div>
        <div className="mt-3 flex -space-x-2">
          {[
            ['DJ', 'bg-[#286a50]'],
            ['FD', 'bg-[#397c5d]'],
            ['AV', 'bg-[#4c8e6b]'],
            ['SC', 'bg-[#67a985]'],
          ].map(([initials, color]) => (
            <span
              key={initials}
              className={`grid size-9 place-items-center rounded-full border-2 border-[#164632] text-[10px] font-bold text-white ${color}`}
            >
              {initials}
            </span>
          ))}
        </div>
      </div>
    </figure>
  )
}
