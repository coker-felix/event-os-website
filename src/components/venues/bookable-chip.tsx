import { CalendarCheck } from 'lucide-react'

/**
 * "Bookable" means the venue is claimed and managed by its owner. "Listing
 * only" is a directory entry nobody has claimed: it cannot be booked.
 */
export function BookableChip({ claimed }: { claimed: boolean }) {
  return claimed ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-violet px-2.5 py-1 text-xs font-semibold text-white">
      <CalendarCheck className="size-3.5" aria-hidden />
      Bookable
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full border border-dashed border-mist px-2.5 py-1 text-xs font-semibold text-mist">
      Listing only
    </span>
  )
}
