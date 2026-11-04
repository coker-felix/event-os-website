import { isEventId } from '#/features/events/ids'

/** Venue ids are UUIDs, like event ids. Anything else cannot be a venue. */
export function isVenueId(id: string): boolean {
  return isEventId(id)
}
