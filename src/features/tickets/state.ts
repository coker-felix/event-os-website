import { formatPrice } from '#/features/events/money'
import type {
  PublicEventPage,
  PublicTicketType,
  VolumeTier,
} from './types'

/** At or below this many left, a ticket type is "Selling fast". */
export const LOW_STOCK_THRESHOLD = 20
/** Largest quantity offered when the backend sets no limit. */
export const DEFAULT_MAX_QTY = 10

export type TicketStatus = 'buyable' | 'sold_out' | 'upcoming' | 'ended'

function num(v: unknown): number | undefined {
  if (v === undefined || v === null || v === '') return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

/** Accepts the loose shape the API sends and returns a clean ticket type. */
export function normaliseTicketType(raw: Record<string, unknown>): PublicTicketType {
  const tiers = Array.isArray(raw.volumeTiers)
    ? (raw.volumeTiers as Array<Record<string, unknown>>)
        .map((t): VolumeTier => ({
          minQty: num(t.minQty) ?? 0,
          unitPriceMinor: num(t.unitPriceMinor) ?? 0,
        }))
        .filter((t) => t.minQty > 0)
    : undefined
  return {
    id: String(raw.id),
    name: String(raw.name ?? ''),
    priceMinor: num(raw.priceMinor) ?? 0,
    available: num(raw.available),
    saleStartAt: num(raw.saleStartAt),
    saleEndAt: num(raw.saleEndAt),
    minPerOrder: num(raw.minPerOrder),
    maxPerOrder: num(raw.maxPerOrder),
    maxPerBuyer: num(raw.maxPerBuyer),
    volumeTiers: tiers?.length ? tiers : undefined,
    supplyKind: raw.supplyKind === 'virtual' ? 'virtual' : raw.supplyKind === 'physical' ? 'physical' : undefined,
    admissionsPerUnit: num(raw.admissionsPerUnit),
    description: typeof raw.description === 'string' ? raw.description : undefined,
    includes: Array.isArray(raw.includes) ? raw.includes.map(String) : undefined,
  }
}

export function ticketStatus(t: PublicTicketType, nowSec: number): TicketStatus {
  if (t.saleEndAt && t.saleEndAt > 0 && nowSec > t.saleEndAt) return 'ended'
  if (t.saleStartAt && t.saleStartAt > 0 && nowSec < t.saleStartAt) return 'upcoming'
  if (t.available !== undefined && t.available <= 0) return 'sold_out'
  return 'buyable'
}

/** Smallest positive number, where 0 or missing means "no limit". */
function tightest(...limits: Array<number | undefined>): number | undefined {
  const set = limits.filter((n): n is number => n !== undefined && n > 0)
  return set.length ? Math.min(...set) : undefined
}

export function qtyBounds(t: PublicTicketType): { min: number; max: number } {
  const min = t.minPerOrder && t.minPerOrder > 0 ? t.minPerOrder : 1
  const limit =
    tightest(t.maxPerOrder, t.maxPerBuyer, t.available) ?? DEFAULT_MAX_QTY
  // Stock below the minimum order means nothing can be bought.
  return { min, max: limit < min ? 0 : limit }
}

/** 0 stays 0; anything else is pulled into the allowed range. */
export function clampQty(t: PublicTicketType, qty: number): number {
  if (qty <= 0) return 0
  const { min, max } = qtyBounds(t)
  if (max === 0) return 0
  return Math.min(Math.max(qty, min), max)
}

function tierFor(t: PublicTicketType, qty: number): VolumeTier | undefined {
  return [...(t.volumeTiers ?? [])]
    .sort((a, b) => b.minQty - a.minQty)
    .find((tier) => qty >= tier.minQty && tier.unitPriceMinor < t.priceMinor)
}

/** Price of one ticket at this quantity, after any volume tier. */
export function unitPriceMinor(t: PublicTicketType, qty: number): number {
  return tierFor(t, qty)?.unitPriceMinor ?? t.priceMinor
}

export function volumeHint(
  t: PublicTicketType,
  qty: number,
  currency?: string,
): string | null {
  const tier = tierFor(t, qty)
  if (!tier || t.priceMinor <= 0) return null
  const each = t.priceMinor - tier.unitPriceMinor
  const percent = Math.round((each / t.priceMinor) * 100)
  const saved = formatPrice(each * qty, currency)
  return `Buying ${qty} saves you ${percent}%: -${saved}`
}

export function isLow(t: PublicTicketType): boolean {
  return (
    t.available !== undefined &&
    t.available > 0 &&
    t.available <= LOW_STOCK_THRESHOLD
  )
}

export type EventSaleState = 'on_sale' | 'free' | 'not_on_sale' | 'cancelled'

export function eventSaleState(
  page: PublicEventPage,
  nowSec: number,
): EventSaleState {
  if (page.event.status === 'cancelled') return 'cancelled'
  const buyable = page.ticketTypes.filter(
    (t) => ticketStatus(t, nowSec) === 'buyable',
  )
  if (buyable.length === 0) return 'not_on_sale'
  return buyable.every((t) => t.priceMinor === 0) ? 'free' : 'on_sale'
}

export function selectedLines(
  qtys: Record<string, number>,
): Array<{ ticketTypeId: string; qty: number }> {
  return Object.entries(qtys)
    .filter(([, qty]) => qty > 0)
    .map(([ticketTypeId, qty]) => ({ ticketTypeId, qty }))
}

export function subtotalMinor(
  types: Array<PublicTicketType>,
  qtys: Record<string, number>,
): number {
  return types.reduce((sum, t) => {
    const qty = qtys[t.id] ?? 0
    return qty > 0 ? sum + unitPriceMinor(t, qty) * qty : sum
  }, 0)
}
