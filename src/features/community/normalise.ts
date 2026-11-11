import type { Blueprint, BlueprintDetail, BlueprintList, BlueprintSnapshot, BlueprintTask, CommunityStatus, Profile, ProfileList, Skill } from './types'

type Raw = Record<string, unknown>
const rows = (v: unknown): Array<Raw> => Array.isArray(v) ? v.filter((x): x is Raw => !!x && typeof x === 'object') : []
const text = (v: unknown): string | undefined => typeof v === 'string' && v.trim() ? v.trim() : undefined
const num = (v: unknown): number | undefined => {
  if (v === undefined || v === null || v === '') return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}
const listText = (v: unknown): Array<string> => Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []

export function normaliseBlueprint(raw: Raw): Blueprint
export function normaliseBlueprint(raw: Raw, detail: true): BlueprintDetail
export function normaliseBlueprint(raw: Raw, detail = false): Blueprint | BlueprintDetail {
  const bpRaw = (raw.blueprint && typeof raw.blueprint === 'object' ? raw.blueprint : raw) as Raw
  const blueprint: Blueprint = {
    id: String(bpRaw.id ?? ''), kind: text(bpRaw.kind) ?? '', title: text(bpRaw.title) ?? '',
    summary: text(bpRaw.summary) ?? '', tags: listText(bpRaw.tags),
    authorUserId: text(bpRaw.authorUserId), authorLabel: text(bpRaw.authorLabel) ?? '',
    creditedOrgId: text(bpRaw.creditedOrgId), currentVersion: num(bpRaw.currentVersion),
    forkCount: num(bpRaw.forkCount), taskCount: num(bpRaw.taskCount) ?? 0,
    authorName: text(bpRaw.authorName) ?? '', status: text(bpRaw.status),
  }
  if (!detail) return blueprint
  const snap = (raw.snapshot && typeof raw.snapshot === 'object' ? raw.snapshot : {}) as Raw
  const snapshot: BlueprintSnapshot = {
    name: text(snap.name) ?? '', version: num(snap.version) ?? 0,
    tasks: rows(snap.tasks).map(normaliseTask),
  }
  return { blueprint, snapshot, tasks: snapshot.tasks }
}

function normaliseTask(raw: Raw): BlueprintTask {
  return { key: text(raw.key) ?? '', title: text(raw.title) ?? '', offsetAmount: num(raw.offsetAmount) ?? 0,
    offsetUnit: text(raw.offsetUnit) ?? 'calendar_days', weekendPolicy: text(raw.weekendPolicy) ?? '',
    leadDays: num(raw.leadDays) ?? 0, dependsOn: listText(raw.dependsOn) }
}

function totalValue(raw: Raw): number { return num(raw.total) ?? 0 }
export function normaliseBlueprintList(raw: Raw, limit = 12): BlueprintList {
  const blueprints = rows(raw.blueprints).map((x) => normaliseBlueprint(x))
  const total = totalValue(raw)
  return { blueprints, total, hasMore: total > blueprints.length || (raw.total === undefined && blueprints.length >= limit) }
}

export function normaliseProfile(raw: Raw): Profile {
  return { userId: String(raw.userId ?? raw.id ?? ''), displayName: text(raw.displayName) ?? '',
    headline: text(raw.headline), bio: text(raw.bio), country: text(raw.country), city: text(raw.city),
    availability: text(raw.availability), visibility: text(raw.visibility), status: text(raw.status),
    skillIds: listText(raw.skillIds), badges: listText(raw.badges) }
}
export function normaliseProfileList(raw: Raw, limit = 12): ProfileList {
  const profiles = rows(raw.profiles).map(normaliseProfile)
  const total = totalValue(raw)
  return { profiles, total, hasMore: total > profiles.length || (raw.total === undefined && profiles.length >= limit) }
}
export function normaliseStatus(raw: Raw): CommunityStatus {
  return { blueprints: raw.blueprints === true, qa: raw.qa === true, crewCall: raw.crewCall === true, network: raw.network === true }
}
export function normaliseSkill(raw: Raw): Skill {
  return { id: String(raw.id ?? ''), slug: text(raw.slug), name: text(raw.name) ?? '' }
}
export function normaliseSkillList(raw: Raw): Array<Skill> { return rows(raw.skills).map(normaliseSkill) }
