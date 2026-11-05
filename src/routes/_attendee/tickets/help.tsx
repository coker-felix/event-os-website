import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, TicketCheck } from 'lucide-react'
import { eventPageQuery } from '#/features/tickets/queries'
import { CTA } from '#/lib/cta'
import { ApiError, apiPost } from '#/lib/api'

export const Route = createFileRoute('/_attendee/tickets/help')({
  head: () => ({
    meta: [
      { title: 'Ticket Self Help | Event OS' },
      {
        name: 'description',
        content:
          'Find tickets using the email address or phone number from checkout.',
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
  const [method, setMethod] = useState<ContactMethod>('email')
  const [contact, setContact] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'contact' | 'code' | 'results'>('contact')
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

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
    <main className="mx-auto max-w-3xl">
      <div className="mx-auto max-w-xl rounded-3xl border border-line bg-card p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <TicketCheck className="size-8 text-primary" aria-hidden />
          <div>
            <h1 className="text-2xl font-bold">Find your tickets</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              We’ll send a one-time code to confirm it’s you.
            </p>
          </div>
        </div>

        {step === 'contact' && (
          <form onSubmit={requestCode} noValidate className="mt-6 space-y-4">
            <fieldset>
              <legend className={LABEL}>Where should we send your code?</legend>
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
                  We couldn’t find tickets for that contact. Check the email or
                  phone number used at checkout, or{' '}
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
    </main>
  )
}
