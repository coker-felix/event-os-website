import { isEventId } from '#/features/events/ids'

/** Vendor ids are UUIDs, like event ids. Anything else cannot be a vendor. */
export function isVendorId(id: string): boolean {
  return isEventId(id)
}
