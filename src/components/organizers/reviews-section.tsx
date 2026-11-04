import { useQuery } from '@tanstack/react-query'
import { reviewSummaryQuery } from '#/features/discovery/queries'
import { Stars } from './stars'
import type { ReviewSubject } from '#/features/discovery/types'

/** What verified attendees said. Hidden when there are no reviews or the API is down. */
export function ReviewsSection({
  subject,
  heading = 'What attendees say',
}: {
  subject: ReviewSubject
  heading?: string
}) {
  const summary = useQuery(reviewSummaryQuery(subject)).data
  if (!summary) return null
  return (
    <section aria-label={heading} className="mt-12">
      <h2 className="text-2xl font-bold">{heading}</h2>
      <p className="mt-2 flex items-center gap-3">
        <span className="font-display text-4xl leading-none font-extrabold">
          {summary.average.toFixed(1)}
        </span>
        <Stars value={summary.average} size="size-5" />
        <span className="text-sm text-mist">
          {summary.count} {summary.count === 1 ? 'review' : 'reviews'} from people who went
        </span>
      </p>
      {summary.recent.length > 0 && (
        <ul className="mt-4 grid gap-3 md:grid-cols-3">
          {summary.recent.map((r) => (
            <li key={r.id} className="rounded-2xl border border-line bg-card p-4">
              <Stars value={r.rating} />
              {r.text && <p className="mt-2 text-sm leading-relaxed">{r.text}</p>}
              <p className="mt-3 text-xs text-mist">Verified attendee</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
