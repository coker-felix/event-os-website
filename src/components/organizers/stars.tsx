import { Star } from 'lucide-react'

/** A rating as stars, with the number spoken for screen readers. */
export function Stars({ value, size = 'size-4' }: { value: number; size?: string }) {
  const full = Math.round(value)
  return (
    <span
      role="img"
      aria-label={`${value.toFixed(1)} out of 5`}
      className="inline-flex gap-0.5 text-flame"
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`${size} ${i <= full ? 'fill-current' : 'opacity-30'}`} aria-hidden />
      ))}
    </span>
  )
}
