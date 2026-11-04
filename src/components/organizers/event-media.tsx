import { useQuery } from '@tanstack/react-query'
import { Play } from 'lucide-react'
import { eventMediaQuery } from '#/features/discovery/queries'
import { CTA } from '#/lib/cta'

/** Photos and a replay from the event, when the organizer has added them. Hidden otherwise. */
export function EventMedia({ eventId, title }: { eventId: string; title: string }) {
  const media = useQuery(eventMediaQuery(eventId)).data
  if (!media) return null
  return (
    <section aria-label="Photos and replay" className="mt-10">
      <h2 className="text-2xl font-bold">Photos and replay</h2>
      {media.videoUrl && (
        <a
          href={media.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${CTA.primary} mt-4`}
        >
          <Play className="size-4" aria-hidden />
          Watch the replay
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}
      {media.photos.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {media.photos.map((src, i) => (
            <li key={src} className="aspect-[4/3] overflow-hidden rounded-xl bg-secondary">
              <img
                src={src}
                alt={`${title}, photo ${i + 1}`}
                loading="lazy"
                className="size-full object-cover"
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
