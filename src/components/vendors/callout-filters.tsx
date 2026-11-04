import { X } from 'lucide-react'
import { serviceKindLabel } from '#/features/vendors/callouts'
import { CTA } from '#/lib/cta'

/** Category chips (scrolling sideways on a phone) and a city menu. */
export function CalloutFilters({
  categories,
  cities,
  category,
  city,
  onChange,
}: {
  categories: Array<string>
  cities: Array<string>
  category: string | undefined
  city: string | undefined
  onChange: (next: { category?: string; city?: string }) => void
}) {
  const chip = (label: string, value: string | undefined) => {
    const on = category === value
    return (
      <li key={label} className="shrink-0">
        <button
          type="button"
          aria-pressed={on}
          onClick={() => onChange({ category: value, city })}
          className={
            on
              ? `${CTA.chipOn}`
              : `${CTA.chipOff}`
          }
        >
          {label}
        </button>
      </li>
    )
  }
  const active = !!category || !!city
  return (
    <div className="space-y-3">
      {categories.length > 0 && (
        <ul
          aria-label="Categories"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1"
        >
          {chip('All', undefined)}
          {categories.map((c) => chip(serviceKindLabel(c), c))}
        </ul>
      )}
      <div className="flex flex-wrap items-center gap-3">
        {cities.length > 0 && (
          <label>
            <span className="sr-only">City</span>
            <select
              value={city ?? ''}
              onChange={(e) =>
                onChange({ category, city: e.target.value || undefined })
              }
              className={`${CTA.chipOff}`}
            >
              <option value="">All places</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        )}
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
    </div>
  )
}
