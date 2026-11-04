import { LayoutGrid, List } from 'lucide-react'
import type { EventsSearch, EventsSort } from '#/features/events/list-search'

const SORT_LABELS: Record<EventsSort, string> = {
  soonest: 'Soonest',
  newest: 'Newest',
  price: 'Price: low to high',
}

export function ResultsHeader({
  count,
  where,
  search,
  onChange,
}: {
  count: number
  where?: string
  search: EventsSearch
  onChange: (next: EventsSearch) => void
}) {
  const view = search.view ?? 'grid'
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-xl font-bold" aria-live="polite">
        {count} {count === 1 ? 'event' : 'events'}
        {where ? ` in ${where}` : ''}
      </h2>
      <div className="flex items-center gap-2">
        <label className="text-sm">
          <span className="sr-only">Sort by</span>
          <select
            value={search.sort ?? 'soonest'}
            onChange={(e) =>
              onChange({
                ...search,
                sort: e.target.value as EventsSort,
                page: undefined,
              })
            }
            className="h-11 rounded-full border border-line bg-card px-4 font-semibold"
          >
            {(Object.keys(SORT_LABELS) as Array<EventsSort>).map((s) => (
              <option key={s} value={s}>
                {SORT_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
        <div
          role="group"
          aria-label="View"
          className="hidden h-11 overflow-hidden rounded-full border border-line bg-card sm:flex"
        >
          {(['grid', 'list'] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              aria-label={v === 'grid' ? 'Grid view' : 'List view'}
              onClick={() => onChange({ ...search, view: v })}
              className={
                view === v
                  ? 'grid w-12 place-items-center bg-ink text-white'
                  : 'grid w-12 place-items-center'
              }
            >
              {v === 'grid' ? (
                <LayoutGrid className="size-5" aria-hidden />
              ) : (
                <List className="size-5" aria-hidden />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
