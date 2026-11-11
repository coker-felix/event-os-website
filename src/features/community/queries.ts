import { queryOptions } from '@tanstack/react-query'
import { apiGet } from '#/lib/api'
import { MOCKS_ENABLED } from '#/lib/mocks'
import { normaliseBlueprint, normaliseBlueprintList, normaliseProfile, normaliseProfileList, normaliseSkillList, normaliseStatus } from './normalise'
import type { BlueprintDetail, BlueprintList, CommunityStatus, Profile, ProfileList, Skill } from './types'

export const COMMUNITY_PAGE_SIZE = 12
const staleTime = 60 * 1000
function listParams(p: Record<string, string | number | undefined> = {}) {
  const qs = new URLSearchParams({ limit: String(p.limit ?? COMMUNITY_PAGE_SIZE), offset: String(p.offset ?? 0) })
  for (const [key, value] of Object.entries(p)) if (value !== undefined && key !== 'limit' && key !== 'offset') qs.set(key, String(value))
  return qs.toString()
}

export const statusQuery = () => queryOptions({
  queryKey: ['community', 'status'],
  queryFn: async (): Promise<CommunityStatus> => normaliseStatus(await apiGet<Record<string, unknown>>('/api/v1/community/status', { timeoutMs: 4000 })),
  staleTime, retry: false,
})

export const blueprintsQuery = (p: { q?: string; tag?: string; author?: string; sort?: string; badge?: string; limit?: number; offset?: number } = {}) => queryOptions({
  queryKey: ['community', 'blueprints', p],
  queryFn: async (): Promise<BlueprintList> => {
    const raw = await apiGet<Record<string, unknown>>(`/api/v1/community/blueprints?${listParams(p)}`, { timeoutMs: 4000 })
    const list = normaliseBlueprintList(raw, p.limit ?? COMMUNITY_PAGE_SIZE)
    if (MOCKS_ENABLED && list.blueprints.length === 0) {
      const { mockBlueprints } = await import('./mocks')
      const rows = mockBlueprints(p).slice(0, p.limit ?? COMMUNITY_PAGE_SIZE)
      return { ...list, blueprints: rows, total: rows.length, hasMore: false }
    }
    return list
  }, staleTime, retry: false,
})

export const blueprintQuery = (id: string) => queryOptions({
  queryKey: ['community', 'blueprint', id],
  queryFn: async (): Promise<BlueprintDetail> => {
    try {
      const raw = await apiGet<Record<string, unknown>>(`/api/v1/community/blueprints/${encodeURIComponent(id)}`, { timeoutMs: 4000 })
      return normaliseBlueprint(raw, true)
    } catch (error) {
      if (MOCKS_ENABLED) {
        const { mockBlueprintDetail } = await import('./mocks')
        const mock = mockBlueprintDetail(id)
        if (mock) return mock
      }
      throw error
    }
  }, staleTime, retry: false,
})

export const profilesQuery = (p: { q?: string; skill?: string; country?: string; city?: string; availability?: string; badge?: string; limit?: number; offset?: number } = {}) => queryOptions({
  queryKey: ['community', 'profiles', p],
  queryFn: async (): Promise<ProfileList> => {
    const raw = await apiGet<Record<string, unknown>>(`/api/v1/community/profiles?${listParams(p)}`, { timeoutMs: 4000 })
    const list = normaliseProfileList(raw, p.limit ?? COMMUNITY_PAGE_SIZE)
    if (MOCKS_ENABLED && list.profiles.length === 0) {
      const { mockProfiles } = await import('./mocks')
      const rows = mockProfiles(p.badge).slice(0, p.limit ?? COMMUNITY_PAGE_SIZE)
      return { ...list, profiles: rows, total: rows.length, hasMore: false }
    }
    return list
  }, staleTime, retry: false,
})

export const profileQuery = (id: string) => queryOptions({
  queryKey: ['community', 'profile', id],
  queryFn: async (): Promise<Profile> => {
    try {
      return normaliseProfile(await apiGet<Record<string, unknown>>(`/api/v1/community/profiles/${encodeURIComponent(id)}`, { timeoutMs: 4000 }))
    } catch (error) {
      if (MOCKS_ENABLED) {
        const { mockProfile } = await import('./mocks')
        const mock = mockProfile(id)
        if (mock) return mock
      }
      throw error
    }
  }, staleTime, retry: false,
})

export const skillsQuery = () => queryOptions({
  queryKey: ['community', 'skills'],
  queryFn: async (): Promise<Array<Skill>> => {
    const skills = normaliseSkillList(await apiGet<Record<string, unknown>>('/api/v1/community/skills', { timeoutMs: 4000 }))
    if (MOCKS_ENABLED && skills.length === 0) {
      const { mockSkills } = await import('./mocks')
      return mockSkills()
    }
    return skills
  }, staleTime, retry: false,
})
