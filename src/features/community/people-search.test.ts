import { describe, expect, it } from 'vitest'
import { validatePeopleSearch } from './people-search'

describe('validatePeopleSearch', () => {
  it('keeps only supported availability values', () => {
    expect(validatePeopleSearch({ availability: 'available' })).toEqual({ availability: 'available' })
    expect(validatePeopleSearch({ availability: 'unavailable' })).toEqual({ availability: 'unavailable' })
    expect(validatePeopleSearch({ availability: 'unspecified' })).toEqual({ availability: 'unspecified' })
    expect(validatePeopleSearch({ availability: 'busy' })).toEqual({})
  })

  it('accepts two-letter country codes and normalizes case', () => {
    expect(validatePeopleSearch({ country: 'gh' })).toEqual({ country: 'GH' })
    expect(validatePeopleSearch({ country: 'GHA' })).toEqual({})
    expect(validatePeopleSearch({ country: 'g' })).toEqual({})
  })

  it('keeps positive integer pages, including page one', () => {
    expect(validatePeopleSearch({ page: '1' })).toEqual({ page: 1 })
    expect(validatePeopleSearch({ page: 4 })).toEqual({ page: 4 })
    expect(validatePeopleSearch({ page: 0, ignored: 'value' })).toEqual({})
    expect(validatePeopleSearch({ page: -1 })).toEqual({})
    expect(validatePeopleSearch({ page: 2.5 })).toEqual({})
  })

  it('trims text and drops unknown keys', () => {
    expect(validatePeopleSearch({ q: '  sound  ', skill: 'audio', other: 'x' })).toEqual({ q: 'sound', skill: 'audio' })
  })
})
