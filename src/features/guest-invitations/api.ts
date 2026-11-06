import { ApiError, apiGet, apiPost } from '#/lib/api'

export type InvitationStatus = 'invited' | 'going' | 'declined' | 'expired' | 'opted_out'

export interface Invitation {
  eventTitle: string
  startsAt: number
  status: InvitationStatus
  partySize: number
  closed: boolean
  maxPartySize: number
}

const path = (token: string) => `/api/v1/guest-invitations/${encodeURIComponent(token)}`

export const getInvitation = (token: string) => apiGet<Invitation>(path(token))

export const respondToInvitation = (
  token: string,
  response: 'going' | 'declined',
  partySize: number,
) => apiPost<Invitation>(`${path(token)}/respond`, { response, partySize })

export const optOutOfInvitation = (token: string) =>
  apiPost<{ ok: true }>(`${path(token)}/opt-out`, {})

export function invitationErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.body && typeof error.body === 'object') {
    const body = error.body as { message?: unknown; error?: unknown }
    if (typeof body.message === 'string') return body.message
    if (typeof body.error === 'string') return body.error
  }
  return 'We could not save your response. Please try again.'
}

export function isInvitationNotFound(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404
}

export function isInvitationNotEnabled(error: unknown): boolean {
  return error instanceof ApiError && error.status === 412
}
