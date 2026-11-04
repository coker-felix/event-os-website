import { JOBS, TEAM } from '#/content/company'
import { MOCK_JOBS, MOCK_TEAM } from '#/features/mocks/company'
import { MOCKS_ENABLED } from '#/lib/mocks'
import { visibleJobs, visibleTeam } from './visible'
import type { Job, TeamMember } from './visible'

/** The real team, or invented placeholders in dev when there is none. */
export function getTeam(): Array<TeamMember> {
  const real = visibleTeam(TEAM)
  return real.length > 0 ? real : MOCKS_ENABLED ? MOCK_TEAM : []
}

/** Open roles, or invented placeholders in dev when there are none. */
export function getJobs(): Array<Job> {
  const real = visibleJobs(JOBS)
  return real.length > 0 ? real : MOCKS_ENABLED ? MOCK_JOBS : []
}
