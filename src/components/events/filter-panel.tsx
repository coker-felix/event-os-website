import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import {
  FORMAT_LABELS,
  PRICE_BANDS,
  WHEN_LABELS,
} from '#/features/events/list-search'
import type {
  EventFormat,
  EventsSearch,
  FacetCounts,
  PriceBandId,
  WhenOption,
} from '#/features/events/list-search'
import type { EventCategory } from '#/features/events/types'

const COLLAPSED_CATEGORIES = 6

function toggle<T>(list: Array<T> | undefined, value: T): Array<T> | undefined {
  const current = list ?? []
  const next = current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value]
  return next.length ? next : undefined
}

/** Search box that updates the URL shortly after typing stops. */
export function SearchBox({
  value,
  onCommit,
  className = '',
}: {
  value: string
  onCommit: (q: string | undefined) => void
  className?: string
}) {
  const [text, setText] = useState(value)
  useEffect(() => setText(value), [value])
  useEffect(() => {
    if (text.trim() === value) return
    const id = window.setTimeout(() => onCommit(text.trim() || undefined), 250)
    return () => window.clearTimeout(id)
  }, [text, value, onCommit])
  return (
    <label className={`relative block ${className}`}>
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
        className="h-12 w-full rounded-sm border border-line bg-card pr-4 pl-12 text-base"
      />
    </label>
  )
}

function Group({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <fieldset className="border-t border-line pt-4">
      <legend className="text-sm font-bold">{title}</legend>
      <div className="mt-2 space-y-1">{children}</div>
    </fieldset>
  )
}

function Option({
  type = 'checkbox',
  name,
  checked,
  onChange,
  label,
  count,
}: {
  type?: 'checkbox' | 'radio'
  name?: string
  checked: boolean
  onChange: () => void
  label: string
  count?: number
}) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        className="size-5 accent-violet"
      />
      <span className="flex-1">{label}</span>
      {count !== undefined && <span className="text-mist">{count}</span>}
    </label>
  )
}

/** All filters. Used in the desktop sidebar and inside the mobile sheet. */
export function FilterPanel({
  search,
  onChange,
  counts,
  categories,
  cities,
}: {
  search: EventsSearch
  onChange: (next: EventsSearch) => void
  counts: FacetCounts
  categories: Array<EventCategory>
  cities: Array<string>
}) {
  const [showAllCats, setShowAllCats] = useState(false)
  const set = (patch: Partial<EventsSearch>) =>
    onChange({ ...search, ...patch, page: undefined })

  const visibleCities = cities.filter(
    (c) => (counts.cities.get(c) ?? 0) > 0 || search.cities?.includes(c),
  )
  const visibleCats = categories.filter(
    (c) =>
      (counts.categories.get(c.id) ?? 0) > 0 || search.cats?.includes(c.id),
  )
  const shownCats = showAllCats
    ? visibleCats
    : visibleCats.slice(0, COLLAPSED_CATEGORIES)

  const whenOptions = Object.keys(WHEN_LABELS) as Array<
    Exclude<WhenOption, 'range'>
  >

  return (
    <div className="space-y-4">
      {visibleCities.length > 0 && (
        <Group title="City">
          {visibleCities.map((c) => (
            <Option
              key={c}
              checked={!!search.cities?.includes(c)}
              onChange={() => set({ cities: toggle(search.cities, c) })}
              label={c}
              count={counts.cities.get(c) ?? 0}
            />
          ))}
        </Group>
      )}

      <Group title="When">
        <Option
          type="radio"
          name="when"
          checked={!search.when}
          onChange={() => set({ when: undefined, from: undefined, to: undefined })}
          label="Any time"
        />
        {whenOptions.map((w) => (
          <Option
            key={w}
            type="radio"
            name="when"
            checked={search.when === w}
            onChange={() => set({ when: w, from: undefined, to: undefined })}
            label={WHEN_LABELS[w]}
            count={counts.when[w]}
          />
        ))}
        <Option
          type="radio"
          name="when"
          checked={search.when === 'range'}
          onChange={() => set({ when: 'range' })}
          label="Pick dates"
        />
        {search.when === 'range' && (
          <div className="flex gap-2 pb-2 pl-8">
            <label className="flex-1 text-xs text-mist">
              From
              <input
                type="date"
                value={search.from ?? ''}
                onChange={(e) => set({ from: e.target.value || undefined })}
                className="mt-1 h-11 w-full rounded-lg border border-line bg-card px-2 text-sm text-foreground"
              />
            </label>
            <label className="flex-1 text-xs text-mist">
              To
              <input
                type="date"
                value={search.to ?? ''}
                onChange={(e) => set({ to: e.target.value || undefined })}
                className="mt-1 h-11 w-full rounded-lg border border-line bg-card px-2 text-sm text-foreground"
              />
            </label>
          </div>
        )}
      </Group>

      <Group title="Price">
        {PRICE_BANDS.map((b) => (
          <Option
            key={b.id}
            checked={!!search.prices?.includes(b.id)}
            onChange={() =>
              set({ prices: toggle<PriceBandId>(search.prices, b.id) })
            }
            label={b.label}
            count={counts.prices.get(b.id) ?? 0}
          />
        ))}
      </Group>

      {visibleCats.length > 0 && (
        <Group title="Category">
          {shownCats.map((c) => (
            <Option
              key={c.id}
              checked={!!search.cats?.includes(c.id)}
              onChange={() => set({ cats: toggle(search.cats, c.id) })}
              label={c.name}
              count={counts.categories.get(c.id) ?? 0}
            />
          ))}
          {visibleCats.length > COLLAPSED_CATEGORIES && (
            <button
              type="button"
              onClick={() => setShowAllCats((v) => !v)}
              className="min-h-11 text-sm font-semibold text-violet-ink hover:underline"
            >
              {showAllCats ? 'Show fewer' : `Show all ${visibleCats.length}`}
            </button>
          )}
        </Group>
      )}

      <Group title="Format">
        {(Object.keys(FORMAT_LABELS) as Array<EventFormat>).map((f) => (
          <Option
            key={f}
            checked={!!search.formats?.includes(f)}
            onChange={() => set({ formats: toggle(search.formats, f) })}
            label={FORMAT_LABELS[f]}
            count={counts.formats.get(f) ?? 0}
          />
        ))}
      </Group>
    </div>
  )
}
