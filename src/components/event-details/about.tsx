import { useState } from 'react'

/** Event description, collapsed to about six lines with "Read more". */
export function About({ text }: { text?: string }) {
  const [open, setOpen] = useState(false)
  if (!text?.trim()) return null
  const long = text.length > 320 || text.split('\n').length > 6
  return (
    <section aria-label="About this event" className="mt-8">
      <h2 className="text-xl font-bold">About</h2>
      <p
        className={`mt-2 whitespace-pre-line text-base leading-relaxed ${
          long && !open ? 'line-clamp-6' : ''
        }`}
      >
        {text}
      </p>
      {long && (
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="mt-1 min-h-11 text-sm font-semibold text-violet hover:underline"
        >
          {open ? 'Show less' : 'Read more'}
        </button>
      )}
    </section>
  )
}
