import { Linkedin } from 'lucide-react'
import { OrganizerAvatar } from '#/components/organizers/organizer-avatar'
import type { TeamMember } from '#/features/company/visible'

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="flex gap-4 rounded-2xl border border-line bg-card p-5">
      <OrganizerAvatar name={member.name} logoUrl={member.photo} size="lg" />
      <div className="min-w-0">
        <h3 className="text-lg font-bold">{member.name}</h3>
        <p className="text-sm text-mist">{member.role}</p>
        {member.bio && <p className="mt-2 text-sm leading-relaxed">{member.bio}</p>}
        {member.link && (
          <a
            href={member.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex min-h-9 items-center gap-1.5 text-sm font-medium text-violet-ink hover:underline"
          >
            <Linkedin className="size-4" aria-hidden />
            Profile
            <span className="sr-only"> of {member.name} (opens in a new tab)</span>
          </a>
        )}
      </div>
    </article>
  )
}
