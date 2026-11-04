const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Organizer ids are UUIDs; anything else is a real 404 without asking the API. */
export function isOrganizerId(id: string): boolean {
  return UUID.test(id)
}

const TOKEN = /^[A-Za-z0-9_-]{16,128}$/

/** The private review link carries an opaque token. Reject anything that cannot be one. */
export function isReviewToken(t: string): boolean {
  return TOKEN.test(t)
}
