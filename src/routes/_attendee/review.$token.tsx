import { useState } from 'react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { Star } from 'lucide-react'
import { isReviewToken } from '#/features/discovery/ids'
import {
  MAX_REVIEW_TEXT,
  submitReview,
  validateReview,
} from '#/features/discovery/review-form'
import { CTA } from '#/lib/cta'

export const Route = createFileRoute('/_attendee/review/$token')({
  loader: ({ params }) => {
    if (!isReviewToken(params.token)) throw notFound()
  },
  notFoundComponent: () => (
    <div className="rounded-2xl border border-line bg-card p-6" role="alert">
      <h1 className="text-2xl font-bold">This review link isn't valid</h1>
      <p className="mt-1 text-mist">
        Use the link in the message we sent after the event.
      </p>
      <Link to="/" className={`${CTA.primary} mt-4`}>
        Back to Event OS
      </Link>
    </div>
  ),
  head: () => ({
    meta: [
      { title: 'Leave a review | Event OS' },
      // A private link: keep it out of search results.
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: ReviewPage,
})

function ReviewPage() {
  const { token } = Route.useParams()
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [errors, setErrors] = useState<{ rating?: string; text?: string; form?: string }>({})
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const v = validateReview({ rating, text })
    if (!v.ok) {
      setErrors(v.errors)
      return
    }
    setErrors({})
    setState('sending')
    try {
      await submitReview({ token, rating: v.rating, text: v.text })
      setState('done')
    } catch {
      setState('idle')
      setErrors({ form: "We couldn't send your review. Check your connection and try again." })
    }
  }

  if (state === 'done') {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-line bg-card p-6" role="status">
        <h1 className="text-2xl font-bold">Thanks, your review is in</h1>
        <p className="mt-1 text-mist">It helps other people decide what to go to.</p>
        <Link to="/events" className={`${CTA.primary} mt-4`}>
          Find your next event
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="mx-auto max-w-xl">
      <h1 className="text-3xl font-extrabold">How was it?</h1>
      <p className="mt-2 text-mist">
        Your review is shown with the event as coming from someone who went. Your name is not shown.
      </p>

      <fieldset className="mt-6">
        <legend className="text-sm font-semibold">Your rating</legend>
        <div className="mt-2 flex gap-1" role="radiogroup" aria-label="Rating from 1 to 5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} ${n === 1 ? 'star' : 'stars'}`}
              onClick={() => setRating(n)}
              className="grid size-11 place-items-center rounded-sm hover:bg-secondary"
            >
              <Star
                className={`size-7 text-flame ${n <= rating ? 'fill-current' : ''}`}
                aria-hidden
              />
            </button>
          ))}
        </div>
        {errors.rating && (
          <p role="alert" className="mt-1 text-sm text-destructive">
            {errors.rating}
          </p>
        )}
      </fieldset>

      <label className="mt-6 block text-sm font-semibold">
        What stood out? (optional)
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          aria-invalid={!!errors.text}
          className="mt-1 w-full rounded-sm border border-line bg-card p-3 text-base font-normal"
        />
      </label>
      <p className="mt-1 text-xs text-mist">
        {text.trim().length}/{MAX_REVIEW_TEXT}
      </p>
      {errors.text && (
        <p role="alert" className="mt-1 text-sm text-destructive">
          {errors.text}
        </p>
      )}

      {errors.form && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {errors.form}
        </p>
      )}
      <button
        type="submit"
        disabled={state === 'sending'}
        className={`${CTA.primary} mt-6 disabled:opacity-60`}
      >
        {state === 'sending' ? 'Sending…' : 'Send review'}
      </button>
    </form>
  )
}
