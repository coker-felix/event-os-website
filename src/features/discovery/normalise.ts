import { safeHttpsUrl } from '#/lib/url'
import type { Organizer, PastEvent, Review, ReviewSummary } from './types'

const HEX = /^#[0-9a-f]{6}$/i
const MAX_PHOTOS = 12
const MAX_TEXT = 500
const MAX_BIO = 600

const rec = (v: unknown): Record<string, unknown> | null =>
  v && typeof v === 'object' ? (v as Record<string, unknown>) : null
const str = (v: unknown): string | undefined =>
  typeof v === 'string' && v.trim() ? v.trim() : undefined
const num = (v: unknown): number | undefined =>
  typeof v === 'number' && Number.isFinite(v) ? v : typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v)) ? Number(v) : undefined
const url = (v: unknown): string | undefined => {
  const s = str(v)
  return s ? (safeHttpsUrl(s) ?? undefined) : undefined
}

export function normaliseOrganizer(raw: unknown): Organizer | null {
  const r = rec(raw)
  const id = str(r?.id)
  const name = str(r?.name)
  if (!r || !id || !name) return null
  return {
    id,
    name,
    city: str(r.city),
    bio: str(r.bio)?.slice(0, MAX_BIO),
    logoUrl: url(r.logoUrl),
    upcomingCount: num(r.upcomingCount),
    hostedCount: num(r.hostedCount),
  }
}

export function normalisePastEvent(raw: unknown): PastEvent | null {
  const r = rec(raw)
  const id = str(r?.id)
  const title = str(r?.title)
  if (!r || !id || !title) return null
  const photos = (Array.isArray(r.photos) ? r.photos : [])
    .map(url)
    .filter((p): p is string => !!p)
    .slice(0, MAX_PHOTOS)
  const accent = str(r.accentColor)
  const rating = rec(r.rating)
  const avg = num(rating?.average)
  const count = num(rating?.count)
  return {
    id,
    title,
    startsAt: typeof r.startsAt === 'number' || typeof r.startsAt === 'string' ? r.startsAt : undefined,
    timezone: str(r.timezone),
    city: str(r.city),
    organizerId: str(r.organizerId),
    organizerName: str(r.organizerName),
    accentColor: accent && HEX.test(accent) ? accent : undefined,
    coverUrl: url(r.coverUrl),
    photos,
    photoCount: num(r.photoCount),
    videoUrl: url(r.videoUrl),
    rating:
      avg !== undefined && count !== undefined && count > 0
        ? { average: Math.min(5, Math.max(0, avg)), count }
        : undefined,
  }
}

export function normaliseReview(raw: unknown): Review | null {
  const r = rec(raw)
  const id = str(r?.id)
  const rating = r?.rating
  if (!r || !id) return null
  if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) return null
  return {
    id,
    rating,
    text: (typeof r.text === 'string' ? r.text.trim() : '').slice(0, MAX_TEXT),
    createdAt:
      typeof r.createdAt === 'number' || typeof r.createdAt === 'string' ? r.createdAt : undefined,
  }
}

export function normaliseReviewSummary(raw: unknown): ReviewSummary | null {
  const r = rec(raw)
  const count = num(r?.count)
  if (!r || !count || count <= 0) return null
  const recent = (Array.isArray(r.reviews) ? r.reviews : [])
    .map(normaliseReview)
    .filter((x): x is Review => !!x)
    .slice(0, 3)
  return {
    average: Math.min(5, Math.max(0, num(r.average) ?? 0)),
    count: Math.floor(count),
    recent,
  }
}
