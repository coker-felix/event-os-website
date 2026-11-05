import { useState } from 'react'
import { Heart, Share2 } from 'lucide-react'
import { usePreferences } from '#/stores/preferences'
import type { PublicEvent } from '#/features/events/types'

const HEX_COLOR = /^#[0-9a-f]{6}$/i

/** Banner with the organizer's image and accent, plus Save and Share. */
export function EventHero({
  event,
  categoryName,
}: {
  event: PublicEvent
  categoryName?: string
}) {
  const [imageFailed, setImageFailed] = useState(false)
  const [shared, setShared] = useState('')
  const saved = usePreferences((s) => s.saved.includes(event.id))
  const toggleSaved = usePreferences((s) => s.toggleSaved)
  const tint =
    event.accentColor && HEX_COLOR.test(event.accentColor)
      ? event.accentColor
      : '#176b5b'

  async function share() {
    const url = window.location.href
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title: event.title, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setShared('Link copied')
      window.setTimeout(() => setShared(''), 2500)
    } catch {
      // The person closed the share sheet; nothing to do.
    }
  }

  return (
    <div
      className="relative aspect-[16/9] max-h-[420px] w-full overflow-hidden rounded-3xl sm:aspect-[21/9]"
      style={{ background: `linear-gradient(135deg, ${tint}, #172a26)` }}
    >
      {event.heroImageUrl && !imageFailed && (
        <img
          src={event.heroImageUrl}
          alt=""
          onError={() => setImageFailed(true)}
          className="size-full object-cover"
        />
      )}
      {categoryName && (
        <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-ink">
          {categoryName}
        </span>
      )}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {shared && (
          <span role="status" className="rounded-full bg-ink px-3 py-1 text-sm text-white">
            {shared}
          </span>
        )}
        <button
          type="button"
          onClick={share}
          aria-label="Share this event"
          className="grid size-11 place-items-center rounded-full bg-white/90 text-ink hover:bg-white"
        >
          <Share2 className="size-5" aria-hidden />
        </button>
        <button
          type="button"
          aria-pressed={saved}
          aria-label={saved ? 'Remove from saved' : 'Save this event'}
          onClick={() => toggleSaved(event.id)}
          className="grid size-11 place-items-center rounded-full bg-white/90 text-ink hover:bg-white"
        >
          <Heart
            className={saved ? 'size-5 fill-flame text-flame' : 'size-5'}
            aria-hidden
          />
        </button>
      </div>
    </div>
  )
}
