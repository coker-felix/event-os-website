import { useState } from 'react'
import { Check } from 'lucide-react'
import { parseContact } from '#/features/alerts/subscribe'
import { followOrganizer } from '#/features/discovery/follow'
import { CTA } from '#/lib/cta'
import { usePreferences } from '#/stores/preferences'

/**
 * Follow is an alerts sign-up for one organizer plus a flag on this device.
 * Unfollowing removes the flag; messages stop with the link in each one.
 */
export function FollowButton({ id, name }: { id: string; name: string }) {
  const following = usePreferences((s) => s.following.includes(id))
  const toggleFollow = usePreferences((s) => s.toggleFollow)
  const [open, setOpen] = useState(false)
  const [contact, setContact] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'error' | 'invalid'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const cleaned = parseContact(contact)
    if (!cleaned) {
      setStatus('invalid')
      return
    }
    setStatus('sending')
    try {
      await followOrganizer({ organizerId: id, contact: cleaned })
      if (!usePreferences.getState().following.includes(id)) toggleFollow(id)
      setOpen(false)
      setContact('')
      setStatus('idle')
    } catch {
      setStatus('error')
    }
  }

  if (following) {
    return (
      <div>
        <button
          type="button"
          aria-pressed
          onClick={() => toggleFollow(id)}
          className={CTA.outline}
        >
          <Check className="size-4" aria-hidden />
          Following
        </button>
        <p className="mt-1.5 text-xs text-mist">
          Tap to unfollow on this device. To stop messages, use the link in them.
        </p>
      </div>
    )
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className={CTA.primary}>
        Follow
      </button>
    )
  }

  return (
    <form onSubmit={submit} className="max-w-sm" noValidate>
      <label className="block text-sm font-medium">
        Email or phone number
        <input
          type="text"
          inputMode="email"
          autoComplete="email"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          aria-invalid={status === 'invalid'}
          aria-describedby="follow-help"
          className="mt-1 h-11 w-full rounded-sm border border-line bg-card px-3 text-base"
        />
      </label>
      <p id="follow-help" className="mt-1.5 text-xs text-mist">
        We'll message you when {name} announces an event. You can unsubscribe in
        every message.
      </p>
      <p role="alert" className="mt-1.5 min-h-5 text-sm text-destructive">
        {status === 'invalid' && 'Enter a valid email or phone number.'}
        {status === 'error' && "We couldn't follow just now. Try again."}
      </p>
      <div className="mt-2 flex gap-2">
        <button type="submit" disabled={status === 'sending'} className={`${CTA.primary} disabled:opacity-60`}>
          {status === 'sending' ? 'Following…' : `Follow ${name}`}
        </button>
        <button type="button" onClick={() => setOpen(false)} className={CTA.outline}>
          Cancel
        </button>
      </div>
    </form>
  )
}
