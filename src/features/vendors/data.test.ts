import { describe, expect, it } from 'vitest'
import { isVendorId } from './ids'
import { mockCallouts, mockVendorProfile, mockVendors } from './mocks'
import {
  normaliseCallout,
  normaliseCalloutList,
  normaliseVendorEntry,
  normaliseVendorList,
  normaliseVendorProfile,
} from './normalise'

describe('normaliseCallout', () => {
  it('turns protojson int64 strings into numbers and defaults the service kinds', () => {
    expect(
      normaliseCallout({
        id: 'c1',
        eventId: 'e1',
        category: 'catering',
        closesAt: '1800000000',
        opensAt: '1799000000',
      }),
    ).toEqual({
      id: 'c1',
      eventId: 'e1',
      category: 'catering',
      serviceKinds: [],
      opensAt: 1_799_000_000,
      closesAt: 1_800_000_000,
    })
  })

  it('keeps service kinds and drops zero or blank times', () => {
    const c = normaliseCallout({
      id: 'c1',
      eventId: 'e1',
      category: 'sound',
      serviceKinds: ['pa', 'dj'],
      closesAt: '0',
    })
    expect(c.serviceKinds).toEqual(['pa', 'dj'])
    expect(c.closesAt).toBeUndefined()
    expect(c.opensAt).toBeUndefined()
  })
})

describe('list normalisers', () => {
  it('treat the real empty response {} as an empty list, not an error', () => {
    expect(normaliseCalloutList({}, 12)).toEqual({ callouts: [], hasMore: false })
    expect(normaliseVendorList({}, 12)).toEqual({ vendors: [], hasMore: false })
  })

  it('say there is more when the total is larger than what was returned', () => {
    const rows = Array.from({ length: 12 }, (_, i) => ({ id: `c${i}`, eventId: 'e', category: 'x' }))
    expect(normaliseCalloutList({ callouts: rows, total: '30' }, 12).hasMore).toBe(true)
    expect(normaliseCalloutList({ callouts: rows, total: 12 }, 12).hasMore).toBe(false)
  })

  it('guess from the page size when there is no total', () => {
    const rows = Array.from({ length: 12 }, (_, i) => ({ id: `v${i}`, businessName: 'V' }))
    expect(normaliseVendorList({ vendors: rows }, 12).hasMore).toBe(true)
    expect(normaliseVendorList({ vendors: rows.slice(0, 3) }, 12).hasMore).toBe(false)
  })
})

describe('normaliseVendorEntry', () => {
  it('keeps a known tier and maps anything else to normal', () => {
    expect(normaliseVendorEntry({ id: 'v', businessName: 'A', tier: 'verified' }).tier).toBe('verified')
    expect(normaliseVendorEntry({ id: 'v', businessName: 'A', tier: 'partnered' }).tier).toBe('partnered')
    expect(normaliseVendorEntry({ id: 'v', businessName: 'A', tier: 'gold' }).tier).toBe('normal')
    expect(normaliseVendorEntry({ id: 'v', businessName: 'A' }).tier).toBe('normal')
  })

  it('keeps the proposed extra fields only when they are non-empty text', () => {
    const v = normaliseVendorEntry({
      id: 'v',
      businessName: 'A',
      category: 'catering',
      city: '',
      summary: 'We cook.',
    })
    expect(v.category).toBe('catering')
    expect(v.summary).toBe('We cook.')
    expect(v.city).toBeUndefined()
  })
})

describe('normaliseVendorProfile', () => {
  it('reads the real store page shape, with string prices as numbers', () => {
    const p = normaliseVendorProfile({
      id: '32db6ca3-dabf-469f-adca-02dce5641c18',
      businessName: 'Codex QA Vendor',
      category: 'event-equipment',
      city: 'Accra',
      country: 'GH',
      tier: 'normal',
      services: [
        { kind: 'check_in_assistance', name: 'Wristbands', priceMinor: '100', currency: 'GHS' },
        { kind: 'ticket_printing', name: 'Ticket', priceMinor: '1000', currency: 'GHS' },
      ],
    })
    expect(p.services).toEqual([
      { kind: 'check_in_assistance', name: 'Wristbands', priceMinor: 100, currency: 'GHS' },
      { kind: 'ticket_printing', name: 'Ticket', priceMinor: 1000, currency: 'GHS' },
    ])
    expect(p.city).toBe('Accra')
  })

  it('tolerates no services, and reports a rating only when there are ratings', () => {
    const none = normaliseVendorProfile({ id: 'v', businessName: 'A', rating: 0, ratingCount: 0 })
    expect(none.services).toEqual([])
    expect(none.rating).toBeUndefined()
    const rated = normaliseVendorProfile({ id: 'v', businessName: 'A', rating: 4.5, ratingCount: '8' })
    expect(rated.rating).toBe(4.5)
    expect(rated.ratingCount).toBe(8)
  })
})

describe('dev mocks', () => {
  it('mockCallouts returns six callouts that cycle through the given event ids', () => {
    const out = mockCallouts(['e1', 'e2'], 1_800_000_000)
    expect(out).toHaveLength(6)
    expect(out.map((c) => c.eventId)).toEqual(['e1', 'e2', 'e1', 'e2', 'e1', 'e2'])
    expect(out.every((c) => (c.closesAt ?? 0) > 1_800_000_000)).toBe(true)
  })

  it('mockCallouts marks every callout as invented', () => {
    expect(mockCallouts(['e1'], 1_800_000_000).every((c) => c.invented === true)).toBe(true)
  })

  it('mockCallouts uses placeholder event ids when there are no events', () => {
    expect(mockCallouts([], 1_800_000_000)[0].eventId).toBe('mock-event-1')
  })

  it('mockVendors returns six vendors whose ids are valid vendor ids and stable', () => {
    const vendors = mockVendors()
    expect(vendors).toHaveLength(6)
    expect(vendors.every((v) => isVendorId(v.id))).toBe(true)
    expect(mockVendors().map((v) => v.id)).toEqual(vendors.map((v) => v.id))
  })

  it('mockVendorProfile finds a mock vendor by id and returns null for any other', () => {
    const [first] = mockVendors()
    const profile = mockVendorProfile(first.id)
    expect(profile?.businessName).toBe(first.businessName)
    expect(profile?.services.length).toBeGreaterThan(0)
    expect(mockVendorProfile('32db6ca3-dabf-469f-adca-02dce5641c18')).toBeNull()
  })
})
