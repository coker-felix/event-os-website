import { describe, expect, it } from 'vitest'
import { ApiError } from '#/lib/api'
import { createAttemptTracker } from './attempt'
import { buyErrorMessage, classifyCheckoutError } from './errors'
import { validateAnswers, validateContact } from './validation'
import type { Question } from '#/features/tickets/types'

describe('classifyCheckoutError', () => {
  it('maps a requote conflict', () => {
    const err = new ApiError(409, 'conflict', { requoteRequired: true })
    expect(classifyCheckoutError(err)).toEqual({ kind: 'requote' })
  })

  it('maps a stale questionnaire and carries the new questions', () => {
    const questionnaire = { versionId: 'v2', questions: [] }
    const err = new ApiError(409, 'conflict', {
      questionnaireStale: true,
      questionnaire,
    })
    expect(classifyCheckoutError(err)).toEqual({
      kind: 'questionnaire_stale',
      questionnaire,
    })
  })

  it('treats any other 409 as an inventory problem and keeps the message', () => {
    const err = new ApiError(409, 'conflict', {
      error: 'insufficient inventory',
      code: 'conflict',
    })
    expect(classifyCheckoutError(err)).toEqual({
      kind: 'inventory',
      message: 'insufficient inventory',
    })
  })

  it('gives a 409 with no body a readable inventory message', () => {
    const issue = classifyCheckoutError(new ApiError(409, 'conflict', null))
    expect(issue.kind).toBe('inventory')
    expect(issue.kind === 'inventory' && issue.message.length).toBeGreaterThan(0)
  })

  it('maps unsupported_jurisdiction on 422', () => {
    const err = new ApiError(422, 'x', {
      error: 'unsupported_jurisdiction',
      reason: 'No tax rule for ZZ',
    })
    expect(classifyCheckoutError(err)).toEqual({
      kind: 'unsupported_location',
      reason: 'No tax rule for ZZ',
    })
  })

  it('treats an expired or missing cart (404) as cart_missing', () => {
    expect(classifyCheckoutError(new ApiError(404, 'nf', null))).toEqual({
      kind: 'cart_missing',
    })
  })

  it('treats a failed fetch and a timeout as a network problem', () => {
    expect(classifyCheckoutError(new TypeError('Failed to fetch'))).toEqual({
      kind: 'network',
    })
    expect(
      classifyCheckoutError(new DOMException('timed out', 'TimeoutError')),
    ).toEqual({ kind: 'network' })
  })

  it('falls back to unknown for anything else', () => {
    expect(classifyCheckoutError(new ApiError(500, 'boom', null))).toEqual({
      kind: 'unknown',
    })
    expect(classifyCheckoutError('weird')).toEqual({ kind: 'unknown' })
  })
})

describe('buyErrorMessage', () => {
  it('says checkout is unavailable when carts are off for the event (404)', () => {
    expect(buyErrorMessage(new ApiError(404, 'nf', { error: 'unknown event' }))).toMatch(
      /isn't available for this event yet/i,
    )
  })

  it('asks to check the connection for a network problem', () => {
    expect(buyErrorMessage(new TypeError('Failed to fetch'))).toMatch(/connection/i)
  })

  it('names a stock problem plainly', () => {
    expect(buyErrorMessage(new ApiError(409, 'c', { error: 'insufficient inventory' }))).toMatch(
      /insufficient inventory/i,
    )
  })

  it('has a useful fallback', () => {
    expect(buyErrorMessage(new ApiError(500, 'x', null))).toMatch(/try again/i)
  })
})

describe('createAttemptTracker', () => {
  it('returns the same key for the same cart state, so a double tap is one order', () => {
    const tracker = createAttemptTracker()
    const first = tracker.keyFor('rev1|+2348012345678')
    expect(tracker.keyFor('rev1|+2348012345678')).toBe(first)
  })

  it('returns a new key once the cart state changes', () => {
    const tracker = createAttemptTracker()
    const first = tracker.keyFor('rev1|a')
    expect(tracker.keyFor('rev2|a')).not.toBe(first)
  })

  it('keeps trackers independent', () => {
    expect(createAttemptTracker().keyFor('x')).not.toBe(
      createAttemptTracker().keyFor('x'),
    )
  })
})

describe('validateContact', () => {
  it('rejects an empty form with one message', () => {
    expect(validateContact({ phone: '', email: '' })).toEqual({
      ok: false,
      errors: { contact: 'Enter a phone number or an email address.' },
    })
  })

  it('accepts a phone number alone and cleans it', () => {
    expect(validateContact({ phone: '+234 801 234 5678' })).toEqual({
      ok: true,
      phone: '+2348012345678',
    })
  })

  it('accepts an email alone', () => {
    expect(validateContact({ email: 'a@b.co' })).toEqual({
      ok: true,
      email: 'a@b.co',
    })
  })

  it('flags an invalid phone or email next to its own field', () => {
    const res = validateContact({ phone: 'abc', email: 'nope' })
    expect(res.ok).toBe(false)
    expect(res.ok === false && Object.keys(res.errors).sort()).toEqual([
      'email',
      'phone',
    ])
  })

  it('does not accept an email typed into the phone field', () => {
    expect(validateContact({ phone: 'a@b.co' }).ok).toBe(false)
  })
})

describe('validateAnswers', () => {
  const questions: Array<Question> = [
    { id: 'diet', type: 'short_text', label: 'Dietary needs', required: true },
    { id: 'size', type: 'single_select', label: 'Shirt size', required: true, options: ['S', 'M'] },
    { id: 'nick', type: 'short_text', label: 'Nickname', required: false },
    { id: 'waiver', type: 'waiver', label: 'Waiver', waiverText: 'I accept the risks' },
  ]

  it('flags every missing required answer and an unaccepted waiver', () => {
    const errors = validateAnswers(questions, {})
    expect(Object.keys(errors).sort()).toEqual(['diet', 'size', 'waiver'])
  })

  it('passes when answered, ignoring an optional blank', () => {
    const errors = validateAnswers(questions, {
      diet: { text: 'None' },
      size: { options: ['M'] },
      waiver: { waiverAccepted: true },
    })
    expect(errors).toEqual({})
  })

  it('treats whitespace as unanswered', () => {
    expect(validateAnswers(questions, { diet: { text: '   ' } }).diet).toBeTruthy()
  })
})
