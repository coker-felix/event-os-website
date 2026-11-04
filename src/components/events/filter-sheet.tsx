import { SlidersHorizontal } from 'lucide-react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '#/components/ui/sheet'
import { FilterPanel } from './filter-panel'
import type { EventsSearch, FacetCounts } from '#/features/events/list-search'
import type { EventCategory } from '#/features/events/types'
import { CTA } from '#/lib/cta'

/** Mobile filters: a bottom sheet with a "Show N events" button. */
export function FilterSheet({
  search,
  onChange,
  counts,
  categories,
  cities,
  activeCount,
  resultCount,
}: {
  search: EventsSearch
  onChange: (next: EventsSearch) => void
  counts: FacetCounts
  categories: Array<EventCategory>
  cities: Array<string>
  activeCount: number
  resultCount: number
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className={`${CTA.outline}`}
        >
          <SlidersHorizontal className="size-4" aria-hidden />
          Filters
          {activeCount > 0 && (
            <span className="grid size-6 place-items-center rounded-full bg-violet text-xs font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="max-h-[90dvh] overflow-y-auto rounded-t-3xl"
      >
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription className="sr-only">
            Narrow the list of events.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <FilterPanel
            search={search}
            onChange={onChange}
            counts={counts}
            categories={categories}
            cities={cities}
          />
        </div>
        <SheetFooter className="sticky bottom-0 flex-row gap-3 border-t border-line bg-background">
          <button
            type="button"
            onClick={() =>
              onChange({ view: search.view, sort: search.sort })
            }
            className={`${CTA.ghost}`}
          >
            Clear all
          </button>
          <SheetClose asChild>
            <button
              type="button"
              className={`${CTA.primary} flex-1`}
            >
              Show {resultCount} {resultCount === 1 ? 'event' : 'events'}
            </button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
