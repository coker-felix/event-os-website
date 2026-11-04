import { Link } from '@tanstack/react-router'

const LINK = 'inline-flex min-h-11 items-center font-semibold text-violet hover:underline'

/** Pointers for people who are here as a vendor, venue or organizer. */
export function NotAnAttendee({ onOrganizer }: { onOrganizer: () => void }) {
  return (
    <section
      aria-label="Not an attendee"
      className="rounded-2xl border border-line bg-card p-5"
    >
      <h2 className="text-lg font-bold">Not an attendee?</h2>
      <ul className="mt-2">
        <li>
          <Link to="/vendors" className={LINK}>
            Vendors: get started
          </Link>
        </li>
        <li>
          <Link to="/venues" className={LINK}>
            Venues: get started
          </Link>
        </li>
        <li>
          <button type="button" onClick={onOrganizer} className={LINK}>
            Organizing events? Tell us about it
          </button>
        </li>
      </ul>
    </section>
  )
}
