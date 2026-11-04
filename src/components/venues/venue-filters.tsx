import { X } from 'lucide-react'
import { CAPACITY_STEPS } from '#/features/venues/venues'
import type { VenuesSearch } from '#/features/venues/search'

type Filters = Omit<VenuesSearch, 'page'>

const SELECT = 'h-11 rounded-full border border-line bg-card px-4 text-sm font-semibold'

/** City, country, minimum capacity and "Bookable only". Menus show only with a real choice. */
export function VenueFilters({
  cities,
  countries,
  value,
  onChange,
}: {
  cities: Array<string>
  countries: Array<string>
  value: Filters
  onChange: (next: Filters) => void
}) {
  const active = !!(value.city || value.country || value.minCapacity || value.bookable)
  return (
    <div className="flex flex-wrap items-center gap-3">
      {cities.length > 1 && (
        <label>
          <span className="sr-only">City</span>
          <select
            value={value.city ?? ''}
            onChange={(e) => onChange({ ...value, city: e.target.value || undefined })}
            className={SELECT}
          >
            <option value="">All cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      )}
      {countries.length > 1 && (
        <label>
          <span className="sr-only">Country</span>
          <select
            value={value.country ?? ''}
            onChange={(e) => onChange({ ...value, country: e.target.value || undefined })}
            className={SELECT}
          >
            <option value="">All countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      )}
      <label>
        <span className="sr-only">Minimum capacity</span>
        <select
          value={value.minCapacity ?? ''}
          onChange={(e) =>
            onChange({
              ...value,
              minCapacity: e.target.value
                ? (Number(e.target.value) as VenuesSearch['minCapacity'])
                : undefined,
            })
          }
          className={SELECT}
        >
          <option value="">Any capacity</option>
          {CAPACITY_STEPS.map((s) => (
            <option key={s.min} value={s.min}>
              {s.label} guests
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        aria-pressed={!!value.bookable}
        onClick={() => onChange({ ...value, bookable: value.bookable ? undefined : true })}
        className={
          value.bookable
            ? 'h-11 rounded-full bg-ink px-5 text-sm font-semibold text-white'
            : 'h-11 rounded-full border border-line bg-card px-5 text-sm font-semibold hover:border-foreground'
        }
      >
        Bookable only
      </button>
      {active && (
        <button
          type="button"
          onClick={() => onChange({})}
          className="inline-flex h-11 items-center gap-1 px-3 text-sm font-semibold text-violet-ink hover:underline"
        >
          <X className="size-4" aria-hidden />
          Clear filters
        </button>
      )}
    </div>
  )
}
