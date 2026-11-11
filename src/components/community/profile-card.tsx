import { MapPin } from 'lucide-react'
import type { Profile } from '#/features/community/types'
import { SkillChips } from './skill-chips'

export function ProfileCard({ profile, skills = [] }: { profile: Profile; skills?: Array<string> }) {
  const location = [profile.city, profile.country].filter(Boolean).join(', ')
  return (
    <a href={`/community/people/${encodeURIComponent(profile.userId)}`} className="group flex h-full flex-col rounded-2xl border border-line bg-card p-5 hover:shadow-lg focus-visible:shadow-lg">
      <h2 className="text-lg leading-snug font-bold group-hover:underline">{profile.displayName}</h2>
      {profile.headline && <p className="mt-1 text-sm text-muted-foreground">{profile.headline}</p>}
      {location && <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="size-4 shrink-0" aria-hidden />{location}</p>}
      <div className="mt-auto pt-4"><SkillChips skills={skills} /></div>
      {profile.badges.includes('founding_member') && <span className="mt-4 w-fit rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold">Founding member</span>}
    </a>
  )
}
