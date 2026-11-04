const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Event ids are UUIDs. Anything else cannot be an event, so pages answer
 * 404 without asking the API (which answers 500 for a malformed id).
 */
export function isEventId(id: string): boolean {
  return UUID.test(id)
}
