import { uuidFromSeed } from '#/lib/mocks'
import type { Callout, VendorEntry, VendorProfile } from './types'

/**
 * Invented vendors data for development only (see src/lib/mocks.ts). Imported
 * only inside `if (MOCKS_ENABLED)` so a production build leaves it out.
 */

const DAY = 86_400

const CALLOUT_ROWS: Array<{ category: string; kinds: Array<string>; days: number }> = [
  { category: 'catering', kinds: ['lunch', 'drinks'], days: 1 },
  { category: 'sound', kinds: ['pa', 'dj'], days: 3 },
  { category: 'staging', kinds: ['stage', 'lighting'], days: 5 },
  { category: 'decor', kinds: ['florals'], days: 8 },
  { category: 'catering', kinds: ['canapes'], days: 12 },
  { category: 'sound', kinds: ['pa'], days: 20 },
]

/** Six invented open callouts. Their events cycle through `eventIds`. */
export function mockCallouts(
  eventIds: Array<string>,
  nowSec = Math.floor(Date.now() / 1000),
): Array<Callout> {
  return CALLOUT_ROWS.map((row, i) => ({
    id: `mock-callout-${i + 1}`,
    eventId: eventIds.length ? eventIds[i % eventIds.length] : `mock-event-${i + 1}`,
    category: row.category,
    serviceKinds: row.kinds,
    opensAt: nowSec - DAY,
    closesAt: nowSec + row.days * DAY,
    invented: true,
  }))
}

const VENDOR_ROWS: Array<Omit<VendorEntry, 'id'>> = [
  { businessName: "Auntie Ama's Kitchen", tier: 'normal', category: 'catering', city: 'Accra', summary: 'Home-style catering for 50 to 500 guests.' },
  { businessName: 'Kofi Sound & Light', tier: 'verified', category: 'sound', city: 'Accra', summary: 'PA, DJ booth and lighting for clubs and weddings.' },
  { businessName: 'Stagecraft Studio', tier: 'partnered', category: 'staging', city: 'Lagos', summary: 'Stages, trusses and lighting rigs, built to order.' },
  { businessName: 'Bloom & Co Decor', tier: 'normal', category: 'decor', city: 'Lagos', summary: 'Florals and table styling for events of any size.' },
  { businessName: 'Quick Print Hub', tier: 'normal', category: 'printing', city: 'Accra', summary: 'Tickets, flyers and banners, printed fast.' },
  { businessName: 'Wristband Works', tier: 'verified', category: 'event-equipment', city: 'Accra', summary: 'Wristbands and check-in kit for entry control.' },
]

export function mockVendors(): Array<VendorEntry> {
  return VENDOR_ROWS.map((row, i) => ({ id: uuidFromSeed(`vendor-${i}`), ...row }))
}

export function mockVendorProfile(id: string): VendorProfile | null {
  const index = mockVendors().findIndex((v) => v.id === id)
  if (index < 0) return null
  const v = mockVendors()[index]
  return {
    id,
    businessName: v.businessName,
    description: `${v.summary ?? ''} (Invented profile, shown in development only.)`.trim(),
    category: v.category,
    city: v.city,
    country: 'GH',
    tier: v.tier,
    services: [
      { kind: v.category, name: 'Standard package', priceMinor: 500_000, currency: 'GHS' },
      { kind: v.category, name: 'Premium package', priceMinor: 1_200_000, currency: 'GHS' },
    ],
    rating: index % 2 === 0 ? 4.6 : undefined,
    ratingCount: index % 2 === 0 ? 12 : undefined,
  }
}
