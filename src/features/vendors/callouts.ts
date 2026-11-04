import type { Callout, CalloutCard } from './types'
import type { PublicEvent } from '#/features/events/types'

const DAY = 86_400

/** Attach each callout's event. A callout whose event is unknown keeps `event` undefined. */
export function joinCalloutsWithEvents(
  callouts: Array<Callout>,
  events: Array<PublicEvent>,
): Array<CalloutCard> {
  const byId = new Map(events.map((e) => [e.id, e] as const))
  return callouts.map((callout) => ({ callout, event: byId.get(callout.eventId) }))
}

/** The event's title, or "Open callout · category" when the event is not known. */
export function calloutTitle(card: CalloutCard): string {
  return card.event?.title ?? `Open callout · ${card.callout.category}`
}

/** "Closes in 3 days", "Closes today", "Closed", or null when there is no closing time. */
export function closesInLabel(
  closesAt: number | undefined,
  nowSec: number,
): string | null {
  if (!closesAt) return null
  const remaining = closesAt - nowSec
  if (remaining <= 0) return 'Closed'
  if (remaining < DAY) return 'Closes today'
  const days = Math.floor(remaining / DAY)
  return `Closes in ${days} ${days === 1 ? 'day' : 'days'}`
}

/** "check_in_assistance" becomes "Check in assistance". */
export function serviceKindLabel(kind: string): string {
  const spaced = kind.replace(/_/g, ' ').trim()
  return spaced ? spaced.charAt(0).toUpperCase() + spaced.slice(1) : ''
}

/** Each category once, in the order first seen. */
export function calloutCategories(cards: Array<CalloutCard>): Array<string> {
  const seen = new Set<string>()
  for (const c of cards) if (c.callout.category) seen.add(c.callout.category)
  return [...seen]
}

/** Filter by category and by the event's city. A card with no event never matches a city. */
export function filterCallouts(
  cards: Array<CalloutCard>,
  f: { category?: string; city?: string },
): Array<CalloutCard> {
  return cards.filter((c) => {
    if (f.category && c.callout.category !== f.category) return false
    if (f.city && c.event?.city !== f.city) return false
    return true
  })
}
