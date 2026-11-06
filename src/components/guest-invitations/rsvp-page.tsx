import { useEffect, useState } from 'react'
import {
  getInvitation,
  invitationErrorMessage,
  isInvitationNotEnabled,
  isInvitationNotFound,
  optOutOfInvitation,
  respondToInvitation,
} from '#/features/guest-invitations/api'
import type { Invitation } from '#/features/guest-invitations/api'
import { clampPartySize, formatInvitationDate, invitationView } from '#/features/guest-invitations/rsvp'
import { CTA } from '#/lib/cta'

type LoadState = 'loading' | 'ready' | 'not-found' | 'not-enabled' | 'error'

export function RsvpPage({ token }: { token: string }) {
  const [invitation, setInvitation] = useState<Invitation | null>(null)
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [partySize, setPartySize] = useState(1)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [confirmOptOut, setConfirmOptOut] = useState(false)

  useEffect(() => {
    let active = true
    getInvitation(token).then((data) => {
      if (!active) return
      setInvitation(data)
      setPartySize(clampPartySize(data.partySize, data.maxPartySize))
      setLoadState('ready')
    }).catch((cause: unknown) => {
      if (!active) return
      setLoadState(isInvitationNotFound(cause) ? 'not-found' : isInvitationNotEnabled(cause) ? 'not-enabled' : 'error')
    })
    return () => { active = false }
  }, [token])

  async function submit(response: 'going' | 'declined') {
    if (!invitation || invitation.closed || busy) return
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const updated = await respondToInvitation(token, response, clampPartySize(partySize, invitation.maxPartySize))
      setInvitation(updated)
      setPartySize(clampPartySize(updated.partySize, updated.maxPartySize))
      setMessage(response === 'going' ? 'Your RSVP is saved. We look forward to seeing you.' : 'Your response has been saved.')
    } catch (cause) {
      setError(invitationErrorMessage(cause))
    } finally {
      setBusy(false)
    }
  }

  async function optOut() {
    setBusy(true)
    setError('')
    try {
      await optOutOfInvitation(token)
      setInvitation((current) => current ? { ...current, status: 'opted_out' } : current)
      setConfirmOptOut(false)
      setMessage('You have opted out of this invitation.')
    } catch (cause) {
      setError(invitationErrorMessage(cause))
    } finally {
      setBusy(false)
    }
  }

  const view = invitationView({ loadState, closed: invitation?.closed, status: invitation?.status })
  if (view === 'loading') return <Panel title="Loading invitation"><p role="status">Loading your invitation…</p></Panel>
  if (view === 'not-found') return <Panel title="Invitation unavailable"><p role="alert">This invitation was not found or is no longer valid.</p></Panel>
  if (view === 'not-enabled') return <Panel title="Guest invitations unavailable"><p role="status">Guest invitations are not enabled for this organization.</p></Panel>
  if (view === 'error') return <Panel title="We couldn't load this invitation"><p role="alert">Please check your connection and try again.</p></Panel>
  if (!invitation) return null

  const answer = invitation.status === 'going' ? 'You’re going' : invitation.status === 'declined' ? 'You’ve declined' : invitation.status === 'opted_out' ? 'You opted out' : 'Please RSVP'
  return (
    <Panel title={invitation.eventTitle}>
      <p className="mt-2 text-sm text-mist">{formatInvitationDate(invitation.startsAt)}</p>
      <p className="mt-5 rounded-sm bg-secondary px-4 py-3 font-semibold" role="status">{answer}</p>
      {view === 'closed' ? (
        <p className="mt-4" role="status">This invitation is closed. Your response can no longer be changed.</p>
      ) : view === 'opted-out' ? (
        <p className="mt-4">You have opted out of this invitation.</p>
      ) : (
        <>
          <div className="mt-6">
            <p className="text-sm font-semibold">Your response</p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <button type="button" disabled={busy} onClick={() => void submit('going')} className={`${CTA.primary} w-full sm:w-auto`}>Going</button>
              <button type="button" disabled={busy} onClick={() => void submit('declined')} className={`${CTA.outline} w-full sm:w-auto`}>Decline</button>
            </div>
          </div>
          <fieldset className="mt-6" disabled={busy}>
            <legend className="text-sm font-semibold">Party size</legend>
            <p className="mt-1 text-sm text-mist">How many people are attending with you?</p>
            <div className="mt-2 inline-flex items-center gap-3">
              <button type="button" aria-label="Decrease party size" disabled={partySize <= 1} onClick={() => setPartySize((n) => clampPartySize(n - 1, invitation.maxPartySize))} className={`${CTA.outline} size-11 px-0`}><span aria-hidden>−</span></button>
              <output aria-live="polite" aria-label="Party size" className="min-w-8 text-center text-lg font-bold">{partySize}</output>
              <button type="button" aria-label="Increase party size" disabled={partySize >= invitation.maxPartySize} onClick={() => setPartySize((n) => clampPartySize(n + 1, invitation.maxPartySize))} className={`${CTA.outline} size-11 px-0`}><span aria-hidden>+</span></button>
            </div>
          </fieldset>
          {invitation.status === 'declined' && <p className="mt-2 text-sm text-mist">Choose Going to update your RSVP.</p>}
        </>
      )}
      {view !== 'opted-out' && (
        <div className="mt-8 border-t border-line pt-5">
          {confirmOptOut ? (
            <div className="space-y-3" role="group" aria-label="Confirm opt out">
              <p>Stop receiving messages about this invitation?</p>
              <button type="button" disabled={busy} onClick={() => void optOut()} className={CTA.primary}>Yes, opt out</button>
              <button type="button" disabled={busy} onClick={() => setConfirmOptOut(false)} className={CTA.outline}>Keep invitation</button>
            </div>
          ) : (
            <button type="button" disabled={busy} onClick={() => setConfirmOptOut(true)} className="min-h-11 text-sm underline underline-offset-4">Opt out of this invitation</button>
          )}
        </div>
      )}
      {message && <p className="mt-4 text-sm text-success" role="status">{message}</p>}
      {error && <p className="mt-4 text-sm text-destructive" role="alert">{error}</p>}
    </Panel>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="min-h-[70svh] px-4 py-10 sm:py-16">
      <section className="mx-auto max-w-xl rounded-lg border border-line bg-card p-5 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">EventRail invitation</p>
        <h1 className="mt-3 break-words font-display text-2xl font-extrabold sm:text-3xl">{title}</h1>
        {children}
      </section>
    </main>
  )
}

