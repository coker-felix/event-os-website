import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { MapPin, Search, Ticket, X } from 'lucide-react'
import { QUICK_FILTERS } from '#/features/events/filters'
import type { QuickFilter } from '#/features/events/filters'
import type { EventCategory } from '#/features/events/types'
import { CTA } from '#/lib/cta'

export interface DiscoveryValue {
  q?: string
  quick?: QuickFilter
  categoryId?: number
}

const SELECT_CLASS = CTA.select

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

  const active = !!value.q || !!value.quick || value.categoryId !== undefined

  return (
    <section
      aria-label="Find events"
      className="relative z-20 mx-auto -mt-14 w-[calc(100vw-2rem)] max-w-7xl rounded-3xl border border-line bg-card p-4 shadow-[0_20px_55px_-35px_rgba(14,51,38,0.5)] sm:-mt-16 sm:p-6"
    >
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          onChange({ ...value, q: text.trim() || undefined })
        }}
        className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto]"
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
            placeholder="Search events or venues"
            className="h-12 w-full rounded-full border border-line bg-background pr-4 pl-12 text-base"
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
              className={`${SELECT_CLASS} h-12 w-full rounded-full pl-10 md:w-auto`}
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
        <button
          type="submit"
          className={`${CTA.primary} h-12 rounded-full px-7`}
        >
          Search
        </button>
      </form>

      <div className="mt-4 flex flex-col gap-4 border-t border-line pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
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
              className={on ? `${CTA.chipOn}` : `${CTA.chipOff}`}
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
              className={`${CTA.select} rounded-full`}
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
            className={CTA.ghost}
          >
            <X className="size-4" aria-hidden />
            Clear filters
          </button>
        )}
        <Link
          to="/tickets/help"
          className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline sm:ml-auto"
        >
          <Ticket className="size-4" aria-hidden />
          Already booked? Find my tickets
        </Link>
      </div>
    </section>
  )
}
