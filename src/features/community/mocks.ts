import { uuidFromSeed } from '#/lib/mocks'
import type { Blueprint, BlueprintDetail, Profile, Skill } from './types'

const BLUEPRINTS: Array<Blueprint> = [
  { id: uuidFromSeed('community-blueprint-1'), kind: 'playbook', title: 'Accra garden wedding', summary: 'A practical plan for a relaxed outdoor wedding.', tags: ['wedding', 'outdoor'], authorUserId: uuidFromSeed('community-person-1'), authorLabel: 'Ama Owusu', authorName: 'Ama Owusu', taskCount: 2, currentVersion: 1, forkCount: 14 },
  { id: uuidFromSeed('community-blueprint-2'), kind: 'playbook', title: 'Community product launch', summary: 'A simple launch plan built around a live event.', tags: ['launch', 'community'], authorUserId: uuidFromSeed('community-person-2'), authorLabel: 'Kojo Mensah', authorName: 'Kojo Mensah', taskCount: 2, currentVersion: 2, forkCount: 8 },
]
const PROFILES: Array<Profile> = [
  { userId: uuidFromSeed('community-person-1'), displayName: 'Ama Owusu', headline: 'Event producer', bio: 'I bring thoughtful gatherings to life.', country: 'GH', city: 'Accra', availability: 'available', skillIds: ['planning'], badges: ['founding_member'] },
  { userId: uuidFromSeed('community-person-2'), displayName: 'Kojo Mensah', headline: 'Production lead', bio: 'Live events, from first plan to final cue.', country: 'GH', city: 'Accra', availability: 'available', skillIds: ['production'], badges: ['founding_member'] },
]
export const mockBlueprints = (p: { author?: string; sort?: string } = {}): Array<Blueprint> => BLUEPRINTS.filter(x => !p.author || x.authorUserId === p.author).slice().sort((a, b) => p.sort === 'forks' ? (b.forkCount ?? 0) - (a.forkCount ?? 0) : 0)
export function mockBlueprintDetail(id: string): BlueprintDetail | null {
  const blueprint = BLUEPRINTS.find(x => x.id === id)
  if (!blueprint) return null
  const tasks = [{ key: 'venue', title: 'Confirm the venue', offsetAmount: 6, offsetUnit: 'calendar_weeks', weekendPolicy: '', leadDays: 42, dependsOn: [] }, { key: 'guest-list', title: 'Prepare the guest list', offsetAmount: 3, offsetUnit: 'calendar_weeks', weekendPolicy: '', leadDays: 21, dependsOn: ['venue'] }]
  const snapshot = { name: blueprint.title, version: blueprint.currentVersion ?? 1, tasks }
  return { blueprint, snapshot, tasks }
}
export const mockProfiles = (badge?: string): Array<Profile> => PROFILES.filter(x => !badge || x.badges.includes(badge))
export function mockProfile(id: string): Profile | null { return PROFILES.find(x => x.userId === id) ?? null }
export const mockSkills = (): Array<Skill> => [{ id: 'planning', slug: 'planning', name: 'Event planning' }, { id: 'production', slug: 'production', name: 'Production' }]
