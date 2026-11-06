export function clampPartySize(value: number, max: number): number {
  if (!Number.isFinite(max) || max < 1) return 1
  return Math.max(1, Math.min(Math.floor(value), Math.floor(max)))
}

export function formatInvitationDate(startsAt: number): string {
  const date = new Date(startsAt * 1000)
  if (!Number.isFinite(date.getTime())) return 'Date to be confirmed'
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(date)
}

export type InvitationView = 'loading' | 'not-found' | 'not-enabled' | 'error' | 'closed' | 'opted-out' | 'active'

export function invitationView(input: {
  loadState: 'loading' | 'ready' | 'not-found' | 'not-enabled' | 'error'
  closed?: boolean
  status?: string
}): InvitationView {
  if (input.loadState !== 'ready') return input.loadState
  if (input.closed) return 'closed'
  if (input.status === 'opted_out') return 'opted-out'
  return 'active'
}
