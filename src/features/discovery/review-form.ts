import { apiPost } from '#/lib/api'
import { MOCKS_ENABLED } from '#/lib/mocks'

export const MAX_REVIEW_TEXT = 500

export type ReviewValidation =
  | { ok: true; rating: number; text: string }
  | { ok: false; errors: { rating?: string; text?: string } }

export function validateReview(input: { rating: number; text: string }): ReviewValidation {
  const errors: { rating?: string; text?: string } = {}
  const text = input.text.trim()
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    errors.rating = 'Choose a rating from 1 to 5.'
  }
  if (text.length > MAX_REVIEW_TEXT) {
    errors.text = `Keep it to ${MAX_REVIEW_TEXT} characters or fewer.`
  }
  return Object.keys(errors).length > 0
    ? { ok: false, errors }
    : { ok: true, rating: input.rating, text }
}

/**
 * Proposed contract: `POST /api/v1/reviews/{token}` with `{ rating, text }`.
 * The token comes from a private link sent to a verified ticket holder.
 * With mocks enabled it pretends to succeed.
 */
export async function submitReview(input: {
  token: string
  rating: number
  text: string
}): Promise<void> {
  if (MOCKS_ENABLED) {
    await new Promise((r) => setTimeout(r, 600))
    return
  }
  await apiPost(`/api/v1/reviews/${encodeURIComponent(input.token)}`, {
    rating: input.rating,
    text: input.text,
  })
}
