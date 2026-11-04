import { describe, expect, it } from 'vitest'
import { validateReview } from './review-form'

describe('validateReview', () => {
  it('needs a rating from 1 to 5', () => {
    expect(validateReview({ rating: 0, text: '' }).ok).toBe(false)
    expect(validateReview({ rating: 6, text: '' }).ok).toBe(false)
    expect(validateReview({ rating: 3, text: '' }).ok).toBe(true)
  })
  it('says what to do when the rating is missing', () => {
    const r = validateReview({ rating: 0, text: '' })
    expect(r.ok ? '' : r.errors.rating).toBe('Choose a rating from 1 to 5.')
  })
  it('trims the text and refuses more than 500 characters', () => {
    const ok = validateReview({ rating: 5, text: '  loved it  ' })
    expect(ok.ok && ok.text).toBe('loved it')
    const long = validateReview({ rating: 5, text: 'a'.repeat(501) })
    expect(long.ok ? '' : long.errors.text).toBe('Keep it to 500 characters or fewer.')
  })
})
