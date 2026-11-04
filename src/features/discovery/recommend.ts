import { toDate } from '#/features/events/format'
import type { PublicEvent } from '#/features/events/types'

export interface RecommendationRow {
  id: 'followed' | 'category'
  title: string
  events: Array<PublicEvent>
}

const MAX_PER_ROW = 8

/**
 * Rows for the "For you" part of the landing page, worked out on the device
 * from what the visitor saved and which organizers they follow. Nothing is
 * guessed: each row says why it is there.
 */
export function recommendFor(p: {
  events: Array<PublicEvent>
  saved: Array<string>
  followed: Array<string>
  categoryNames: Map<number, string>
  nowSec: number
}): Array<RecommendationRow> {
  const nowMs = p.nowSec * 1000
  const upcoming = p.events
    .filter((e) => {
      const d = toDate(e.startsAt)
      return d !== null && d.getTime() >= nowMs
    })
    .sort(
      (a, b) =>
        (toDate(a.startsAt)?.getTime() ?? 0) - (toDate(b.startsAt)?.getTime() ?? 0),
    )
  const rows: Array<RecommendationRow> = []

  const followedSet = new Set(p.followed)
  const fromFollowed = upcoming
    .filter((e) => e.organizerId && followedSet.has(e.organizerId))
    .slice(0, MAX_PER_ROW)
  if (fromFollowed.length > 0) {
    rows.push({ id: 'followed', title: 'From organizers you follow', events: fromFollowed })
  }

  // The category you saved most (saved ids that no longer exist are ignored).
  const savedSet = new Set(p.saved)
  const counts = new Map<number, number>()
  for (const e of p.events) {
    if (savedSet.has(e.id) && e.categoryId !== undefined) {
      counts.set(e.categoryId, (counts.get(e.categoryId) ?? 0) + 1)
    }
  }
  const top = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0] - b[0])
    .at(0)
  const name = top ? p.categoryNames.get(top[0]) : undefined
  if (top && name) {
    const shown = new Set(fromFollowed.map((e) => e.id))
    const similar = upcoming
      .filter(
        (e) => e.categoryId === top[0] && !savedSet.has(e.id) && !shown.has(e.id),
      )
      .slice(0, MAX_PER_ROW)
    if (similar.length > 0) {
      rows.push({ id: 'category', title: `Because you saved ${name} events`, events: similar })
    }
  }
  return rows
}
