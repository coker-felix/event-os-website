import { useRef, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  Check,
  Headphones,
  ShieldCheck,
  TicketCheck,
} from 'lucide-react'
import { eventPageQuery } from '#/features/tickets/queries'
import { CTA } from '#/lib/cta'
import { ApiError, apiPost } from '#/lib/api'

export const Route = createFileRoute('/_attendee/tickets/help')({
  head: () => ({
    meta: [
      { title: 'Ticket Self Help | EventRail' },
      {
        name: 'description',
        content:
          'Learn where to find tickets bought online, through USSD or messaging, then securely look them up if needed.',
      },
    ],
  }),
  component: TicketHelpPage,
})

type ContactMethod = 'email' | 'phone'
type Ticket = {
  id: string
  eventId: string
  orderId: string
  status: string
  ticketTypeName: string
  code: string
}
type TicketList = { tickets: Ticket[] }
const FIELD =
  'mt-1 block h-11 w-full rounded-sm border border-line bg-card px-3 text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
const LABEL = 'text-sm font-medium'
const CHANNEL_GUIDES = [
  {
    id: 'website',
    title: 'Website',
    note: 'Bought on EventRail or an event website',
    steps: [
      'Check the payment confirmation page first; it may link directly to your tickets.',
      'Look in the email or SMS inbox for the contact you entered at checkout.',
      'Search for the event name or “EventRail”, and check spam or promotions folders too.',
    ],
  },
  {
    id: 'ussd',
    title: 'USSD',
    note: 'Bought from a phone menu',
    steps: [
      'Check the final USSD confirmation and SMS messages on the phone you used to pay.',
      'If the message points to a ticket retrieval option, return to the same USSD service and follow it.',
      'Keep the payment reference or order ID from the confirmation nearby.',
    ],
  },
  {
    id: 'messaging',
    title: 'WhatsApp or Telegram',
    note: 'Bought in a messaging conversation',
    steps: [
      'Open the same account or phone number you used during purchase.',
      'Search the conversation for the event name, “ticket” or “order”. Check the purchase confirmation for a ticket or secure link.',
      'If you bought through an organizer’s chat, check that conversation as well.',
    ],
  },
  {
    id: 'partner',
    title: 'Partner or box office',
    note: 'Bought from an organizer, agent or venue',
    steps: [
      'Check the receipt, confirmation message or email from the seller.',
      'Contact that seller with your order ID if the receipt does not include a ticket.',
      'Use the same phone number or email you gave them when purchasing.',
    ],
  },
] as const
type ChannelGuideId = (typeof CHANNEL_GUIDES)[number]['id']

function TicketCard({ ticket }: { ticket: Ticket }) {
  const event = useQuery({
    ...eventPageQuery(ticket.eventId),
    enabled: Boolean(ticket.eventId),
  })
  return (
    <li className="rounded-2xl border border-line p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-semibold">
            {event.data?.event.title || 'Event ticket'}
          </p>
          <p className="mt-1 text-sm">{ticket.ticketTypeName}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Order {ticket.orderId}
          </p>
        </div>
        <span className="rounded-full bg-muted px-3 py-1 text-xs capitalize">
          {ticket.status}
        </span>
      </div>
      <div className="mt-4 border-t border-dashed border-line pt-3">
        <p className="text-xs text-muted-foreground">Ticket code</p>
        <p className="mt-1 break-all font-mono text-lg font-bold tracking-wide">
          {ticket.code}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {ticket.status === 'paid'
            ? 'Show this code to the event team at entry.'
            : ticket.status === 'cancelled'
              ? 'This ticket was cancelled and cannot be used for entry.'
              : 'Complete payment before using this ticket for entry.'}
        </p>
      </div>
    </li>
  )
}

function TicketHelpPage() {
  const [activeChannel, setActiveChannel] = useState<ChannelGuideId>('website')
  const channelTabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const [method, setMethod] = useState<ContactMethod>('email')
  const [contact, setContact] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'contact' | 'code' | 'results'>('contact')
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const selectedGuide =
    CHANNEL_GUIDES.find((guide) => guide.id === activeChannel) ??
    CHANNEL_GUIDES[0]

  function onChannelTabKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let nextIndex: number | undefined
    if (event.key === 'ArrowRight')
      nextIndex = (index + 1) % CHANNEL_GUIDES.length
    if (event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + CHANNEL_GUIDES.length) % CHANNEL_GUIDES.length
    }
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = CHANNEL_GUIDES.length - 1
    if (nextIndex === undefined) return
    event.preventDefault()
    setActiveChannel(CHANNEL_GUIDES[nextIndex].id)
    channelTabRefs.current[nextIndex]?.focus()
  }

  const credentials = () =>
    method === 'email'
      ? { email: contact.trim().toLowerCase() }
      : { phone: contact.trim().replace(/[\s()-]/g, '') }

  async function sendCode() {
    setError('')
    setNotice('')
    const value = contact.trim()
    const valid =
      method === 'email'
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        : /^\+?\d{8,15}$/.test(value.replace(/[\s()-]/g, ''))
    if (!valid) {
      setError(
        method === 'email'
          ? 'Enter a valid email address.'
          : 'Enter a valid phone number, including its country code.',
      )
      return
    }
    setBusy(true)
    try {
      await apiPost('/api/v1/tickets/access', credentials())
      setStep('code')
      setNotice(
        `If tickets are linked to this ${method}, a verification code is on its way.`,
      )
    } catch {
      setError(
        "We couldn't send a code right now. Check your connection and try again.",
      )
    } finally {
      setBusy(false)
    }
  }

  async function requestCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await sendCode()
  }

  async function retrieveTickets(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (!/^\d{6}$/.test(code.trim())) {
      setError('Enter the six-digit code we sent you.')
      return
    }
    setBusy(true)
    try {
      const result = await apiPost<TicketList>(
        '/api/v1/tickets/access/verify',
        { ...credentials(), code: code.trim() },
      )
      setTickets(result.tickets)
      setStep('results')
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 400
          ? 'That code is invalid or has expired. Request a new code and try again.'
          : "We couldn't retrieve your tickets. Check your connection and try again.",
      )
    } finally {
      setBusy(false)
    }
  }

  function startOver() {
    setCode('')
    setTickets([])
    setNotice('')
    setError('')
    setStep('contact')
  }

  return (
    <main className="mx-auto max-w-6xl space-y-10 sm:space-y-14">
      <header className="relative isolate overflow-hidden rounded-[2rem] bg-[#123f32] px-6 py-10 text-white shadow-sm sm:px-10 sm:py-14 lg:px-16 lg:py-16">
        <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_40%,rgba(24,112,94,0.66),transparent_44%),linear-gradient(110deg,#123f32_4%,#174d40_58%,#124b59_100%)]" />
          <div className="absolute -right-10 -top-28 size-[28rem] rounded-full border border-white/10 sm:right-10 sm:top-[-18rem] sm:size-[42rem]">
            <div className="absolute inset-10 rounded-full border border-white/10" />
            <div className="absolute inset-24 rounded-full border border-white/10" />
          </div>
          <TicketCheck className="absolute bottom-8 right-10 size-28 rotate-[-12deg] text-white/10 sm:bottom-10 sm:right-20 sm:size-40" />
        </div>
        <div className="max-w-3xl">
          <p className="text-xs font-bold tracking-[0.2em] text-emerald-100/80 uppercase">
            Attendee self-service
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl leading-[1.06] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Find your tickets. Get back to the good part.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            Enter the email or phone number you used at checkout. We’ll verify
            it and bring your tickets together in one place.
          </p>
        </div>
      </header>

      <section
        className="grid items-start gap-5 lg:grid-cols-[1.45fr_0.9fr]"
        aria-label="Find your tickets"
      >
        <div
          id="ticket-lookup"
          className="rounded-3xl border border-line bg-card p-6 shadow-[0_8px_28px_rgba(29,74,53,0.05)] sm:p-8"
        >
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-secondary text-primary">
              <TicketCheck className="size-5" aria-hidden />
            </span>
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">
                Secure ticket lookup
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Your tickets are tied to your checkout contact.
              </p>
            </div>
          </div>

          {step === 'contact' && (
            <form onSubmit={requestCode} noValidate className="mt-6 space-y-4">
              <fieldset>
                <legend className={LABEL}>
                  Where should we send your code?
                </legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(['email', 'phone'] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={method === item}
                      onClick={() => {
                        setMethod(item)
                        setError('')
                      }}
                      className={method === item ? CTA.chipOn : CTA.chipOff}
                    >
                      {item === 'email' ? 'Email' : 'Phone number'}
                    </button>
                  ))}
                </div>
              </fieldset>
              <label className="block">
                <span className={LABEL}>
                  {method === 'email' ? 'Email address' : 'Phone number'}
                </span>
                <input
                  className={FIELD}
                  type={method === 'email' ? 'email' : 'tel'}
                  autoComplete={method === 'email' ? 'email' : 'tel'}
                  inputMode={method === 'phone' ? 'tel' : 'email'}
                  value={contact}
                  onChange={(event) => setContact(event.target.value)}
                  placeholder={
                    method === 'email' ? 'you@example.com' : '+233 24 000 0000'
                  }
                  aria-invalid={!!error}
                  aria-describedby={error ? 'ticket-help-error' : undefined}
                  required
                />
              </label>
              {error && (
                <p
                  id="ticket-help-error"
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {error}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Use the same contact you entered when you bought your tickets.
              </p>
              <button
                className={`${CTA.primary} w-full disabled:opacity-60`}
                type="submit"
                disabled={busy}
              >
                {busy ? 'Sending code…' : 'Send verification code'}
              </button>
            </form>
          )}

          {step === 'code' && (
            <form
              onSubmit={retrieveTickets}
              noValidate
              className="mt-6 space-y-4"
            >
              <p className="text-sm" role="status" aria-live="polite">
                {notice}
              </p>
              <label className="block">
                <span className={LABEL}>Six-digit verification code</span>
                <input
                  className={FIELD}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={code}
                  onChange={(event) =>
                    setCode(event.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  aria-invalid={!!error}
                  aria-describedby={error ? 'ticket-help-error' : undefined}
                  required
                />
              </label>
              {error && (
                <p
                  id="ticket-help-error"
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {error}
                </p>
              )}
              <button
                className={`${CTA.primary} w-full disabled:opacity-60`}
                type="submit"
                disabled={busy}
              >
                {busy ? 'Finding tickets…' : 'Find my tickets'}
              </button>
              <div className="flex flex-wrap justify-between gap-2">
                <button type="button" className={CTA.ghost} onClick={startOver}>
                  <ArrowLeft className="size-4" aria-hidden /> Change contact
                </button>
                <button
                  type="button"
                  className={CTA.ghost}
                  disabled={busy}
                  onClick={() => void sendCode()}
                >
                  Send another code
                </button>
              </div>
            </form>
          )}

          {step === 'results' && (
            <section className="mt-6" aria-live="polite">
              {tickets.length === 0 ? (
                <div>
                  <h2 className="text-lg font-bold">No tickets found</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We couldn’t find tickets for that contact. Check the email
                    or phone number used at checkout, or{' '}
                    <Link to="/contact" className="underline">
                      contact our support team
                    </Link>
                    .
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-bold">Your tickets</h2>
                  <ul className="mt-4 space-y-3">
                    {tickets.map((ticket) => (
                      <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                  </ul>
                </>
              )}
              <button
                type="button"
                className={`${CTA.outline} mt-5`}
                onClick={startOver}
              >
                Look up another contact
              </button>
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <section
            className="rounded-3xl border border-line bg-card p-6 sm:p-7"
            aria-labelledby="entry-checklist-title"
          >
            <p className="text-xs font-bold tracking-[0.16em] text-muted-foreground uppercase">
              Fast checklist
            </p>
            <h2 id="entry-checklist-title" className="mt-2 text-lg font-bold">
              Before you head to the door
            </h2>
            <ul className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
              {[
                'Save your ticket to your phone or wallet before you arrive.',
                'Turn up your screen brightness so the QR code scans quickly.',
                'Bring a valid ID if the event team needs to confirm the booking name.',
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-success"
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-start gap-3 border-t border-line pt-5 text-sm">
              <ShieldCheck
                className="mt-0.5 size-5 shrink-0 text-primary"
                aria-hidden
              />
              <p className="text-muted-foreground">
                Your contact is verified with a one-time code before any tickets
                are shown.
              </p>
            </div>
          </section>
          <section className="rounded-3xl bg-secondary p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <Headphones className="size-5 text-primary" aria-hidden />
              <p className="text-xs font-bold tracking-[0.16em] text-muted-foreground uppercase">
                Need a hand?
              </p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground">
              If you purchased through an organizer or box office, they can help
              with the order directly.
            </p>
            <Link
              to="/contact"
              className="mt-4 inline-flex min-h-11 items-center font-semibold text-primary underline-offset-4 hover:underline"
            >
              Contact attendee support{' '}
              <span aria-hidden className="ml-1">
                →
              </span>
            </Link>
          </section>
        </aside>
      </section>

      <section aria-labelledby="ticket-channel-guide" className="scroll-mt-8">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-primary uppercase">
              Troubleshooting
            </p>
            <h2
              id="ticket-channel-guide"
              className="mt-2 text-2xl font-bold sm:text-3xl"
            >
              Can’t see your tickets yet?
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
            Choose where you bought them for a few quick places to check.
          </p>
        </div>
        <div
          role="tablist"
          aria-label="Choose where you bought your tickets"
          className="mt-5 flex gap-2 overflow-x-auto pb-2"
        >
          {CHANNEL_GUIDES.map((guide, index) => (
            <button
              key={guide.id}
              ref={(element) => {
                channelTabRefs.current[index] = element
              }}
              id={`ticket-channel-tab-${guide.id}`}
              type="button"
              role="tab"
              aria-selected={activeChannel === guide.id}
              aria-controls="ticket-channel-panel"
              tabIndex={activeChannel === guide.id ? 0 : -1}
              onClick={() => setActiveChannel(guide.id)}
              onKeyDown={(event) => onChannelTabKeyDown(event, index)}
              className={`min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${activeChannel === guide.id ? 'bg-primary text-primary-foreground' : 'border border-line bg-card text-muted-foreground hover:text-foreground'}`}
            >
              {guide.title}
            </button>
          ))}
        </div>
        <div
          id="ticket-channel-panel"
          role="tabpanel"
          aria-labelledby={`ticket-channel-tab-${selectedGuide.id}`}
          tabIndex={0}
          className="rounded-3xl border border-line bg-card p-5 sm:p-7"
        >
          <h3 className="text-lg font-bold">{selectedGuide.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {selectedGuide.note}
          </p>
          <ul className="mt-5 grid gap-4 text-sm leading-relaxed text-foreground md:grid-cols-3">
            {selectedGuide.steps.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-2xl bg-background p-4"
              >
                <Check
                  className="mt-0.5 size-4 shrink-0 text-success"
                  aria-hidden
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-muted-foreground">
            Still can’t find it?{' '}
            <Link
              to="/contact"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Talk to our support team
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  )
}
