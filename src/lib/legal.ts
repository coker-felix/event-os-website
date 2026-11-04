import type { Audience, LegalDoc, LegalSection } from '#/content/legal/types'

export const AUDIENCES: Array<{ id: Exclude<Audience, 'all'>; label: string }> = [
  { id: 'attendees', label: 'Attendees' },
  { id: 'vendors', label: 'Vendors' },
  { id: 'organizers', label: 'Event organizers' },
  { id: 'venues', label: 'Venue owners' },
]

const IDS = new Set<string>(AUDIENCES.map((a) => a.id))

/** An audience sees the sections for everyone plus its own. */
export function filterSections(
  doc: LegalDoc,
  audience: Audience | undefined,
): Array<LegalSection> {
  if (!audience || audience === 'all') return doc.sections
  return doc.sections.filter((s) => s.audience === 'all' || s.audience === audience)
}

/** Every `[To confirm: ...]` left in the document. */
export function placeholdersIn(doc: LegalDoc): Array<string> {
  const all = [doc.intro, ...doc.sections.flatMap((s) => s.body)].join('\n')
  return all.match(/\[To confirm:[^\]]*\]/g) ?? []
}

/** The draft notice shows until the owner sets VITE_LEGAL_REVIEWED=true. */
export function draftNoticeVisible(reviewed: string | undefined): boolean {
  return reviewed !== 'true'
}

/** `?for=` is user input: keep a known audience, drop anything else. */
export function validateLegalSearch(raw: unknown): { for?: Exclude<Audience, 'all'> } {
  const v = (raw as { for?: unknown } | null)?.for
  return typeof v === 'string' && IDS.has(v)
    ? { for: v as Exclude<Audience, 'all'> }
    : {}
}
