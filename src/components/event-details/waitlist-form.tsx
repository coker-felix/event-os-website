import { useState } from 'react'
import { joinWaitlist } from '#/features/tickets/waitlist'

type Status = 'closed' | 'open' | 'submitting' | 'done' | 'error'

/** "Join waitlist" for a sold-out ticket. The field opens only when tapped. */
export function WaitlistForm({
  eventId,
  ticketTypeId,
  ticketName,
}: {
  eventId: string
  ticketTypeId: string
  ticketName: string
}) {
  const [status, setStatus] = useState<Status>('closed')
  const [contact, setContact] = useState('')
  const [message, setMessage] = useState('')

  if (status === 'done') {
    return (
      <p role="status" className="mt-2 text-sm font-semibold">
        You're on the waitlist for {ticketName}. We'll message you if tickets
        come back.
      </p>
    )
  }
  if (status === 'closed') {
    return (
      <button
        type="button"
        onClick={() => setStatus('open')}
        className="mt-2 min-h-11 text-sm font-semibold text-violet-ink hover:underline"
      >
        Join waitlist
      </button>
    )
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    try {
      const ok = await joinWaitlist(eventId, ticketTypeId, contact)
      if (ok) {
        setStatus('done')
      } else {
        setStatus('error')
        setMessage('Enter a valid phone number or email address.')
      }
    } catch {
      setStatus('error')
      setMessage("We couldn't add you. Check your connection and try again.")
    }
  }

  return (
    <form onSubmit={submit} noValidate className="mt-2">
      <div className="flex gap-2">
        <label className="flex-1">
          <span className="sr-only">Phone number or email for {ticketName} waitlist</span>
          <input
            type="text"
            inputMode="email"
            autoComplete="email"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            aria-invalid={status === 'error'}
            placeholder="Phone number or email"
            className="h-11 w-full rounded-lg border border-line bg-card px-3 text-base"
          />
        </label>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="h-11 rounded-lg bg-ink px-4 text-sm font-semibold text-white disabled:opacity-60"
        >
          {status === 'submitting' ? 'Adding…' : 'Notify me'}
        </button>
      </div>
      {status === 'error' && (
        <p role="alert" className="mt-1 text-sm text-destructive">
          {message}
        </p>
      )}
    </form>
  )
}
