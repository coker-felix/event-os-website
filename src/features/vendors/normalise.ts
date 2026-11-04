import type {
  Callout,
  CalloutList,
  VendorEntry,
  VendorList,
  VendorProfile,
  VendorService,
  VendorTier,
} from './types'

type Raw = Record<string, unknown>

function text(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim() : undefined
}

/** A finite number, from a number or a numeric string (protojson int64). */
function num(v: unknown): number | undefined {
  if (v === undefined || v === null || v === '') return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

/** A number above zero, or undefined: protojson sends zero for "none". */
function positive(v: unknown): number | undefined {
  const n = num(v)
  return n !== undefined && n > 0 ? n : undefined
}

function rows(v: unknown): Array<Raw> {
  return Array.isArray(v) ? (v as Array<Raw>) : []
}

/** Anything that is not a known tier is the plain tier. */
export function normaliseTier(v: unknown): VendorTier {
  return v === 'verified' || v === 'partnered' ? v : 'normal'
}

/** More to load when the total says so, else when a full page came back. */
function hasMore(count: number, total: unknown, limit: number): boolean {
  const t = num(total)
  return t !== undefined ? t > count : count >= limit
}

export function normaliseCallout(raw: Raw): Callout {
  return {
    id: String(raw.id),
    eventId: String(raw.eventId),
    category: text(raw.category) ?? '',
    serviceKinds: Array.isArray(raw.serviceKinds) ? raw.serviceKinds.map(String) : [],
    opensAt: positive(raw.opensAt),
    closesAt: positive(raw.closesAt),
  }
}

/** `{}` (the real empty response) is an empty list, not an error. */
export function normaliseCalloutList(raw: Raw, limit: number): CalloutList {
  const callouts = rows(raw.callouts).map(normaliseCallout)
  return { callouts, hasMore: hasMore(callouts.length, raw.total, limit) }
}

export function normaliseVendorEntry(raw: Raw): VendorEntry {
  return {
    id: String(raw.id),
    businessName: text(raw.businessName) ?? '',
    tier: normaliseTier(raw.tier),
    category: text(raw.category),
    city: text(raw.city),
    summary: text(raw.summary),
    imageUrl: text(raw.imageUrl),
  }
}

export function normaliseVendorList(raw: Raw, limit: number): VendorList {
  const vendors = rows(raw.vendors).map(normaliseVendorEntry)
  return { vendors, hasMore: hasMore(vendors.length, raw.total, limit) }
}

export function normaliseVendorProfile(raw: Raw): VendorProfile {
  const services: Array<VendorService> = rows(raw.services).map((s) => ({
    kind: text(s.kind),
    name: text(s.name) ?? '',
    priceMinor: num(s.priceMinor),
    currency: text(s.currency),
  }))
  return {
    id: String(raw.id),
    businessName: text(raw.businessName) ?? '',
    description: text(raw.description),
    category: text(raw.category),
    city: text(raw.city),
    country: text(raw.country),
    tier: normaliseTier(raw.tier),
    services,
    rating: positive(raw.rating),
    ratingCount: positive(raw.ratingCount),
  }
}
