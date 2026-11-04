import { ApiError } from '#/lib/api'
import type { VenueAvailability } from './types'

/**
 * The availability call answers 409 for an unclaimed or inactive venue. That
 * means "not open for booking", so it becomes a normal answer. Any other
 * failure is a real error and is rethrown.
 */
export function availabilityFromError(err: unknown): VenueAvailability {
  if (err instanceof ApiError && err.status === 409) return { open: false, blocks: [] }
  throw err
}
