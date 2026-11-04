import { describe, expect, it } from 'vitest'
import { usePreferences } from './preferences'

describe('following', () => {
  it('toggles an organizer on and off', () => {
    usePreferences.setState({ following: [] })
    usePreferences.getState().toggleFollow('org-1')
    expect(usePreferences.getState().following).toEqual(['org-1'])
    usePreferences.getState().toggleFollow('org-1')
    expect(usePreferences.getState().following).toEqual([])
  })
})
