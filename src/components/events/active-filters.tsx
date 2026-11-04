import { X } from 'lucide-react'
import { activeFilterChips } from '#/features/events/list-search'
import type { EventsSearch } from '#/features/events/list-search'

/** Removable chips for every active filter, plus "Clear all". */
export function ActiveFilters({
  search,
  names,
  onChange,
}: {
  search: EventsSearch
  names: Map<number, string>
  onChange: (next: EventsSearch) => void
}) {
  const chips = activeFilterChips(search, names)
  if (chips.length === 0) return null
  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      {chips.map((c) => (
        <li key={c.key}>
          <button
            type="button"
            onClick={() => onChange(c.remove(search))}
            aria-label={`Remove filter: ${c.label}`}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-ink px-3 text-sm font-semibold text-white"
          >
            {c.label}
            <X className="size-4" aria-hidden />
          </button>
        </li>
      ))}
      <li>
        <button
          type="button"
          onClick={() => onChange({ view: search.view, sort: search.sort })}
          className="min-h-9 px-2 text-sm font-semibold text-violet-ink hover:underline"
        >
          Clear all
        </button>
      </li>
    </ul>
  )
}
