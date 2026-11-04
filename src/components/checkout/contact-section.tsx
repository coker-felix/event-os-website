import type { DeliveryChannel } from '#/features/checkout/types'

export interface ContactValue {
  phone: string
  email: string
  delivery: DeliveryChannel
}

export interface ContactErrors {
  contact?: string
  phone?: string
  email?: string
}

const INPUT =
  'mt-1 h-12 w-full rounded-xl border border-line bg-card px-4 text-base'

export function ContactSection({
  value,
  onChange,
  errors,
}: {
  value: ContactValue
  onChange: (next: ContactValue) => void
  errors: ContactErrors
}) {
  return (
    <section
      aria-label="Your details"
      className="rounded-2xl border border-line bg-card p-5"
    >
      <h2 className="text-lg font-bold">Your details</h2>
      <p className="mt-1 text-sm text-mist">
        We send your tickets here. Add a phone number, an email, or both.
      </p>

      {errors.contact && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {errors.contact}
        </p>
      )}

      <label className="mt-4 block text-sm font-semibold">
        Phone number
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={value.phone}
          onChange={(e) => onChange({ ...value, phone: e.target.value })}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
          placeholder="+234 801 234 5678"
          className={INPUT}
        />
      </label>
      {errors.phone && (
        <p id="phone-error" role="alert" className="mt-1 text-sm text-destructive">
          {errors.phone}
        </p>
      )}

      <label className="mt-4 block text-sm font-semibold">
        Email <span className="font-normal text-mist">(optional)</span>
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          value={value.email}
          onChange={(e) => onChange({ ...value, email: e.target.value })}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          placeholder="name@example.com"
          className={INPUT}
        />
      </label>
      {errors.email && (
        <p id="email-error" role="alert" className="mt-1 text-sm text-destructive">
          {errors.email}
        </p>
      )}

      <fieldset className="mt-5">
        <legend className="text-sm font-semibold">Send my tickets by</legend>
        <div className="mt-2 flex gap-3">
          {(['sms', 'email'] as const).map((d) => (
            <label
              key={d}
              className="flex min-h-12 flex-1 cursor-pointer items-center gap-3 rounded-xl border border-line px-4 text-sm font-semibold has-[:checked]:border-violet has-[:checked]:bg-secondary"
            >
              <input
                type="radio"
                name="delivery"
                checked={value.delivery === d}
                onChange={() => onChange({ ...value, delivery: d })}
                className="size-5 accent-violet"
              />
              {d === 'sms' ? 'SMS' : 'Email'}
            </label>
          ))}
        </div>
      </fieldset>
    </section>
  )
}
