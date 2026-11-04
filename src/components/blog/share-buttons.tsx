import { useState } from 'react'
import { Link2, Share2 } from 'lucide-react'
import { CTA } from '#/lib/cta'

/** Share (native sheet where there is one) and Copy link. */
export function ShareButtons({ title }: { title: string }) {
  const [status, setStatus] = useState('')

  function flash(message: string) {
    setStatus(message)
    window.setTimeout(() => setStatus(''), 2500)
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      flash('Link copied')
    } catch {
      flash("Couldn't copy. Copy it from the address bar.")
    }
  }

  async function share() {
    try {
      await navigator.share({ title, url: window.location.href })
    } catch {
      // The person closed the share sheet; nothing to do.
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
        <button
          type="button"
          onClick={share}
          className={`${CTA.outline}`}
        >
          <Share2 className="size-4" aria-hidden />
          Share
        </button>
      )}
      <button
        type="button"
        onClick={copy}
        className={`${CTA.outline}`}
      >
        <Link2 className="size-4" aria-hidden />
        Copy link
      </button>
      <span role="status" className="text-sm text-mist">
        {status}
      </span>
    </div>
  )
}
