import { describe, expect, it } from 'vitest'
import { validateCalloutsSearch } from './search'

describe('validateCalloutsSearch', () => {
  it('trims text, drops blanks and junk pages', () => {
    expect(validateCalloutsSearch({ category: ' catering ', city: '', page: 'abc' })).toEqual({
      category: 'catering',
    })
  })

  it('keeps a page above 1 and drops 1, zero and negatives', () => {
    expect(validateCalloutsSearch({ page: 3 })).toEqual({ page: 3 })
    expect(validateCalloutsSearch({ page: '3' })).toEqual({ page: 3 })
    expect(validateCalloutsSearch({ page: 1 })).toEqual({})
    expect(validateCalloutsSearch({ page: 0 })).toEqual({})
    expect(validateCalloutsSearch({ page: -3 })).toEqual({})
    expect(validateCalloutsSearch({ page: 2.5 })).toEqual({})
  })

  it('reads a numeric category the way the router parses ?category=7', () => {
    expect(validateCalloutsSearch({ category: 7 })).toEqual({ category: '7' })
  })

  it('ignores values that are neither text nor a number', () => {
    expect(validateCalloutsSearch({ category: ['a'], city: { x: 1 }, page: null })).toEqual({})
  })

  it('round-trips a clean search', () => {
    const clean = { category: 'sound', city: 'Accra', page: 2 }
    expect(validateCalloutsSearch(clean)).toEqual(clean)
  })
})
