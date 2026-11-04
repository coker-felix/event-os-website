import { queryOptions } from '@tanstack/react-query'
import { apiGet } from '#/lib/api'
import { MOCKS_ENABLED } from '#/lib/mocks'
import { withEventExtras } from '#/features/events/enrich'
import type { PublicEvent } from '#/features/events/types'
import { mockTicketTypes, withTicketExtras } from './mocks'
import { normaliseTicketType } from './state'
import type { EventSponsor, PublicEventPage, PublicQuestionnaire } from './types'

interface RawEventPage {
  event: PublicEvent
  ticketTypes?: Array<Record<string, unknown>>
  sponsors?: Array<EventSponsor>
  questionnaire?: PublicQuestionnaire
}

/** `GET /api/v1/events/{eventId}`: the event page with ticket types. */
export const eventPageQuery = (eventId: string) =>
  queryOptions({
    queryKey: ['event-page', eventId],
    queryFn: async (): Promise<PublicEventPage> => {
      const raw = await apiGet<RawEventPage>(
        `/api/v1/events/${encodeURIComponent(eventId)}`,
      )
      let ticketTypes = (raw.ticketTypes ?? []).map(normaliseTicketType)
      // Dev only: a published event with no ticket types gets invented ones.
      if (
        MOCKS_ENABLED &&
        ticketTypes.length === 0 &&
        raw.event.status === 'published'
      ) {
        ticketTypes = mockTicketTypes(eventId)
      }
      return {
        event: withEventExtras(raw.event),
        ticketTypes: ticketTypes.map((t) => withTicketExtras(t)),
        sponsors: raw.sponsors ?? [],
        questionnaire: raw.questionnaire,
      }
    },
    staleTime: 60 * 1000,
  })
