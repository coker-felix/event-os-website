import type { HeldBlock, VenueEntry, VenueList, VenueProfile } from './types'

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

/** More to load when the total says so, else when a full page came back. */
function hasMore(count: number, total: unknown, limit: number): boolean {
  const t = num(total)
  return t !== undefined ? t > count : count >= limit
}

export function normaliseVenueEntry(raw: Raw): VenueEntry {
  return {
    id: String(raw.id),
    name: text(raw.name) ?? '',
    city: text(raw.city),
    country: text(raw.country),
    capacity: positive(raw.capacity),
    // protojson omits false, so only an explicit true means claimed.
    claimed: raw.claimed === true,
    category: text(raw.category),
    imageUrl: text(raw.imageUrl),
  }
}

export function normaliseVenueList(raw: Raw, limit: number): VenueList {
  const venues = rows(raw.venues).map(normaliseVenueEntry)
  return { venues, hasMore: hasMore(venues.length, raw.total, limit) }
}

export function normaliseVenueProfile(raw: Raw): VenueProfile {
  const links: Record<string, string> = {}
  if (raw.socialLinks && typeof raw.socialLinks === 'object') {
    for (const [platform, url] of Object.entries(raw.socialLinks as Raw)) {
      const clean = text(url)
      if (clean) links[platform] = clean
    }
  }
  return {
    id: String(raw.id),
    name: text(raw.name) ?? '',
    address: text(raw.address),
    city: text(raw.city),
    country: text(raw.country),
    capacity: positive(raw.capacity),
    category: text(raw.category),
    description: text(raw.description),
    amenities: Array.isArray(raw.amenities)
      ? raw.amenities.map(text).filter((a): a is string => !!a)
      : [],
    rating: positive(raw.rating),
    ratingCount: positive(raw.ratingCount),
    claimed: raw.claimed === true,
    websiteUrl: text(raw.websiteUrl),
    socialLinks: links,
  }
}

export function normaliseBlocks(raw: Raw): Array<HeldBlock> {
  return rows(raw.blocks).map((b) => ({
    id: String(b.id),
    fromAt: num(b.fromAt) ?? 0,
    toAt: num(b.toAt) ?? 0,
  }))
}
