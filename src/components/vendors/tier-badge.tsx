import { BadgeCheck } from 'lucide-react'
import type { VendorTier } from '#/features/vendors/types'

/** "Verified" or "Partnered", set by an admin. The plain tier shows nothing. */
export function TierBadge({ tier }: { tier: VendorTier }) {
  if (tier === 'normal') return null
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-violet px-2.5 py-1 text-xs font-semibold text-white">
      <BadgeCheck className="size-3.5" aria-hidden />
      {tier === 'verified' ? 'Verified' : 'Partnered'}
    </span>
  )
}
