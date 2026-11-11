import { describe, expect, it } from 'vitest'
import { validateBlueprintsSearch } from './search'

describe('validateBlueprintsSearch', () => {
  it('keeps supported sorts and positive page numbers', () => {
    expect(validateBlueprintsSearch({ sort: 'forks', page: '2' })).toEqual({ sort: 'forks', page: 2 })
    expect(validateBlueprintsSearch({ sort: 'recent', page: 1 })).toEqual({ sort: 'recent' })
  })

  it('drops invalid sort and page values', () => {
    expect(validateBlueprintsSearch({ sort: 'popular', page: 0 })).toEqual({})
  })

  it('keeps author only when it is a UUID and drops unknown keys', () => {
    const author = '550e8400-e29b-41d4-a716-446655440000'
    expect(validateBlueprintsSearch({ author, q: '  gala  ', tag: 'sound', extra: 'ignored' })).toEqual({
      author,
      q: 'gala',
      tag: 'sound',
    })
    expect(validateBlueprintsSearch({ author: 'not-a-uuid' })).toEqual({})
  })
})
