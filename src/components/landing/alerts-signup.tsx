import { useState } from 'react'
import { parseContact, subscribeToAlerts } from '#/features/alerts/subscribe'
import { CTA } from '#/lib/cta'

type Status = 'idle' | 'submitting' | 'done' | 'error'

export function AlertsSignup({ city }: { city: string | null }) {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const contact = parseContact(value)
    if (!contact) {
      setStatus('error')
      setMessage('Enter a valid email address or phone number.')
      return
    }
    setStatus('submitting')
    try {
      await subscribeToAlerts({ contact, city })
      setStatus('done')
    } catch {
      setStatus('error')
      setMessage("We couldn't sign you up. Check your connection and try again.")
    }
  }

  return (
    <section
      id="alerts"
      aria-label="New event alerts"
      className="mt-16 rounded-3xl bg-violet p-6 text-white sm:p-10"
    >
      <div className="grid gap-6 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="text-3xl leading-tight font-extrabold">
            Hear about new events first
          </h2>
          <p className="mt-2 max-w-md text-white/80">
            {city
              ? `Get a message when new events are added in ${city}.`
              : 'Get a message when new events are added.'}
          </p>
        </div>

        {status === 'done' ? (
          <p role="status" className="text-lg font-semibold">
            You're on the list. We'll message you when something new is on.
          </p>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="flex-1">
                <span className="sr-only">Email or phone number</span>
                <input
                  type="text"
                  inputMode="email"
                  autoComplete="email"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  aria-invalid={status === 'error'}
                  aria-describedby="alerts-msg"
                  placeholder="Email or phone number"
                  className="h-12 w-full rounded-sm bg-white px-5 text-base text-ink placeholder:text-mist"
                />
              </label>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className={`${CTA.ink} disabled:opacity-60`}
              >
                {status === 'submitting' ? 'Signing you up…' : 'Notify me'}
              </button>
            </div>
            <p
              id="alerts-msg"
              role={status === 'error' ? 'alert' : undefined}
              className="mt-2 min-h-5 text-sm text-white"
            >
              {status === 'error' ? message : ''}
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
