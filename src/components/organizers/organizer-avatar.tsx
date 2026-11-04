import { useState } from 'react'

const SIZES = { sm: 'size-10 text-sm', md: 'size-14 text-lg', lg: 'size-20 text-2xl' } as const

/** The organizer's logo, or their initials when there is none or it fails to load. */
export function OrganizerAvatar({
  name,
  logoUrl,
  size = 'md',
}: {
  name: string
  logoUrl?: string
  size?: keyof typeof SIZES
}) {
  const [failed, setFailed] = useState(false)
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
  return logoUrl && !failed ? (
    <img
      src={logoUrl}
      alt=""
      onError={() => setFailed(true)}
      className={`${SIZES[size]} shrink-0 rounded-full object-cover`}
    />
  ) : (
    <span
      aria-hidden
      className={`${SIZES[size]} grid shrink-0 place-items-center rounded-full bg-secondary font-display font-extrabold`}
    >
      {initials}
    </span>
  )
}
