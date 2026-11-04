import { apiPost } from '#/lib/api'
import { MOCKS_ENABLED } from '#/lib/mocks'

/**
 * Proposed contract: `POST /api/v1/organizers/{id}/follow` with
 * `{ contact: string }`, 2xx on success. Following is an alerts sign-up for
 * that organizer. With mocks enabled it pretends to succeed.
 */
export async function followOrganizer(input: {
  organizerId: string
  contact: string
}): Promise<void> {
  if (MOCKS_ENABLED) {
    await new Promise((r) => setTimeout(r, 600))
    return
  }
  await apiPost(`/api/v1/organizers/${encodeURIComponent(input.organizerId)}/follow`, {
    contact: input.contact,
  })
}
