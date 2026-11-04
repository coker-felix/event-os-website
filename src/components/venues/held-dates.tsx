import { upcomingBlocks, formatHeldRange } from '#/features/venues/venues'
import type { VenueAvailability } from '#/features/venues/types'

const WINDOW_DAYS = 90

/**
 * Date ranges a venue already holds over the next 90 days. An unclaimed venue
 * has no calendar, which is said plainly rather than shown as an error.
 */
export function HeldDates({
  availability,
  pending,
  nowSec,
}: {
  availability: VenueAvailability | undefined
  pending: boolean
  nowSec: number
}) {
  const blocks =
    availability?.open ? upcomingBlocks(availability.blocks, nowSec, WINDOW_DAYS) : []
  return (
    <section aria-label="Held dates" className="mt-8">
      <h2 className="text-xl font-bold">Held dates</h2>
      {pending ? (
        <p className="mt-2 text-mist" role="status">
          Checking dates…
        </p>
      ) : !availability?.open ? (
        <p className="mt-2 text-mist">
          This listing hasn't been claimed yet, so availability and booking
          aren't open.
        </p>
      ) : blocks.length === 0 ? (
        <p className="mt-2 text-mist">
          No held dates in the next {WINDOW_DAYS} days. A booking request still
          needs the owner's acceptance.
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm text-mist">
            Dates already held over the next {WINDOW_DAYS} days. A booking
            request still needs the owner's acceptance.
          </p>
          <ul className="mt-3 divide-y divide-line rounded-2xl border border-line bg-card">
            {blocks.map((b) => (
              <li key={b.id} className="px-5 py-3 font-semibold">
                {formatHeldRange(b.fromAt, b.toAt)}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
