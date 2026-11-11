export type OffsetUnit = 'calendar_days' | 'calendar_weeks' | 'business_days' | string

export interface BlueprintTask {
  key: string
  title: string
  offsetAmount: number
  offsetUnit: OffsetUnit
  weekendPolicy: string
  leadDays: number
  dependsOn: Array<string>
}

export interface BlueprintSnapshot {
  name: string
  version: number
  tasks: Array<BlueprintTask>
}

export interface Blueprint {
  id: string
  kind: string
  title: string
  summary: string
  tags: Array<string>
  authorUserId?: string
  authorLabel: string
  creditedOrgId?: string
  currentVersion?: number
  forkCount?: number
  taskCount: number
  authorName: string
  status?: string
}

export interface BlueprintDetail {
  blueprint: Blueprint
  snapshot: BlueprintSnapshot
  tasks: Array<BlueprintTask>
}

export interface BlueprintList {
  blueprints: Array<Blueprint>
  total: number
  hasMore: boolean
}

export interface Profile {
  userId: string
  displayName: string
  headline?: string
  bio?: string
  country?: string
  city?: string
  availability?: string
  visibility?: string
  status?: string
  skillIds: Array<string>
  badges: Array<string>
}

export interface ProfileList {
  profiles: Array<Profile>
  total: number
  hasMore: boolean
}

export interface Skill {
  id: string
  slug?: string
  name: string
}

export interface CommunityStatus {
  blueprints: boolean
  qa: boolean
  crewCall: boolean
  network: boolean
}
