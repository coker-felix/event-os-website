import type { Country } from '#/features/checkout/countries'

/** Billing country, needed for tax when the order holds a virtual ticket. */
export function BillingSection({
  countries,
  value,
  onChange,
  error,
}: {
  countries: Array<Country>
  value: string
  onChange: (code: string) => void
  error?: string
}) {
  return (
    <section
      aria-label="Billing country"
      className="rounded-2xl border border-line bg-card p-5"
    >
      <h2 className="text-lg font-bold">Billing country</h2>
      <p className="mt-1 text-sm text-mist">
        We need this to work out tax on online tickets.
      </p>
      <label className="mt-4 block text-sm font-semibold">
        Country
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          autoComplete="country"
          className="mt-1 h-12 w-full rounded-xl border border-line bg-card px-4 text-base"
        >
          <option value="">Choose a country</option>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      {error && (
        <p role="alert" className="mt-1 text-sm text-destructive">
          {error}
        </p>
      )}
    </section>
  )
}
