import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { MapPin, Search, Ticket, X } from 'lucide-react'
import { QUICK_FILTERS } from '#/features/events/filters'
import type { QuickFilter } from '#/features/events/filters'
import type { EventCategory } from '#/features/events/types'

export interface DiscoveryValue {
  q?: string
  quick?: QuickFilter
  categoryId?: number
}

const SELECT_CLASS =
  'h-11 rounded-full border border-line bg-card px-4 text-sm font-medium'

/**
 * Search, quick filters, category and city. Filters live in the URL (via
 * `onChange`) so results can be shared; the city is a saved preference.
 */
export function DiscoveryBar({
  value,
  onChange,
  categories,
  cities,
  city,
  onCityChange,
}: {
  value: DiscoveryValue
  onChange: (next: DiscoveryValue) => void
  categories: Array<EventCategory>
  cities: Array<string>
  city: string | null
  onCityChange: (city: string | null) => void
}) {
  const [text, setText] = useState(value.q ?? '')

  // Keep the box in sync when the URL changes (back button, "Clear").
  useEffect(() => setText(value.q ?? ''), [value.q])

  // Debounce typing into the URL.
  useEffect(() => {
    if (text.trim() === (value.q ?? '')) return
    const id = window.setTimeout(
      () => onChange({ ...value, q: text.trim() || undefined }),
      250,
    )
    return () => window.clearTimeout(id)
  }, [text, value, onChange])

  const active =
    !!value.q || !!value.quick || value.categoryId !== undefined

  return (
    <section aria-label="Find events" className="mt-6">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          onChange({ ...value, q: text.trim() || undefined })
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <label className="relative flex-1">
          <span className="sr-only">Search events</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-mist"
            aria-hidden
          />
          <input
            type="search"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Search events, venues or categories"
            className="h-11 w-full rounded-full border border-line bg-card pr-4 pl-12 text-base"
          />
        </label>
        {cities.length > 0 && (
          <label className="relative">
            <span className="sr-only">City</span>
            <MapPin
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-mist"
              aria-hidden
            />
            <select
              value={city ?? ''}
              onChange={(e) => onCityChange(e.target.value || null)}
              className={`${SELECT_CLASS} w-full pl-10 sm:w-auto`}
            >
              <option value="">All locations</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        )}
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {QUICK_FILTERS.map((f) => {
          const on = value.quick === f.id
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={on}
              onClick={() =>
                onChange({ ...value, quick: on ? undefined : f.id })
              }
              className={
                on
                  ? 'h-9 rounded-full bg-ink px-4 text-sm font-semibold text-white'
                  : 'h-9 rounded-full border border-line bg-card px-4 text-sm font-semibold hover:border-foreground'
              }
            >
              {f.label}
            </button>
          )
        })}
        {categories.length > 0 && (
          <label>
            <span className="sr-only">Category</span>
            <select
              value={value.categoryId ?? ''}
              onChange={(e) =>
                onChange({
                  ...value,
                  categoryId: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              className="h-9 rounded-full border border-line bg-card px-4 text-sm font-semibold"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        )}
        {active && (
          <button
            type="button"
            onClick={() => {
              setText('')
              onChange({})
            }}
            className="inline-flex h-9 items-center gap-1 rounded-full px-3 text-sm font-semibold text-violet-ink hover:underline"
          >
            <X className="size-4" aria-hidden />
            Clear filters
          </button>
        )}
        <Link
          to="/tickets/help"
          className="ml-auto inline-flex h-9 items-center gap-1.5 text-sm font-semibold text-violet-ink hover:underline"
        >
          <Ticket className="size-4" aria-hidden />
          Already booked? Find my tickets
        </Link>
      </div>
    </section>
  )
}
