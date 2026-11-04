import { safeLogoSrc } from '#/features/trusted/visible'
import { safeHttpsUrl } from '#/lib/url'

export interface TeamMember {
  name: string
  role: string
  bio?: string
  /** An https URL, or a file served from this site such as "/team/ama.jpg". */
  photo?: string
  /** A profile page, for example LinkedIn. https only. */
  link?: string
}

export interface Job {
  title: string
  team: string
  location: string
  type: string
  /** An https link or a mailto: address. */
  apply: string
}

const MAX_TEAM = 24
const MAX_BIO = 280
const MAILTO = /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i

/** How to apply: an https page or a mailto address, nothing else. */
export function safeApplyHref(raw: string): string | undefined {
  if (MAILTO.test(raw)) return raw
  return safeHttpsUrl(raw) ?? undefined
}

/** Clean the team list: named and titled, de-duplicated, safe links, at most 24. */
export function visibleTeam(list: Array<TeamMember>): Array<TeamMember> {
  const seen = new Set<string>()
  const out: Array<TeamMember> = []
  for (const m of list) {
    const name = m.name.trim()
    const role = m.role.trim()
    const key = name.toLowerCase()
    if (!name || !role || seen.has(key)) continue
    seen.add(key)
    out.push({
      name,
      role,
      bio: m.bio?.trim().slice(0, MAX_BIO) || undefined,
      photo: safeLogoSrc(m.photo),
      link: m.link ? (safeHttpsUrl(m.link) ?? undefined) : undefined,
    })
    if (out.length === MAX_TEAM) break
  }
  return out
}

/** Only roles with a title and a safe way to apply are shown. */
export function visibleJobs(list: Array<Job>): Array<Job> {
  return list.flatMap((j) => {
    const apply = safeApplyHref(j.apply)
    const title = j.title.trim()
    return title && apply ? [{ ...j, title, apply }] : []
  })
}
