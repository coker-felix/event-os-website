import { describe, expect, it } from 'vitest'
import { normaliseBlueprint, normaliseBlueprintList, normaliseProfile, normaliseProfileList, normaliseStatus } from './normalise'

describe('community normalisers', () => {
  it('defaults arrays and a missing total, and removes contact fields', () => {
    expect(normaliseBlueprintList({ blueprints: [{ id: 'b', email: 'x', phone: 'y' }] })).toEqual({ blueprints: [{ id: 'b', kind: '', title: '', summary: '', tags: [], authorLabel: '' }], total: 0, hasMore: false })
    expect(normaliseProfileList({ profiles: [{ userId: 'u', email: 'x', phone: 'y' }] })).toEqual({ profiles: [{ userId: 'u', displayName: '', skillIds: [], badges: [] }], total: 0, hasMore: false })
    expect(normaliseBlueprint({ id: 'b', snapshot: {} }, true).snapshot.tasks).toEqual([])
    expect(normaliseProfile({ userId: 'u', email: 'x', phone: 'y' })).not.toHaveProperty('email')
  })

  it('defaults missing status flags to false', () => {
    expect(normaliseStatus({ blueprints: true })).toEqual({ blueprints: true, qa: false, crewCall: false, network: false })
  })
})
