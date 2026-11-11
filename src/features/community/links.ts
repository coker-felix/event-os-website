import { portalUrl } from '#/features/vendors/portal'

export const communityLinks = {
  join: () => portalUrl(`/register?redirect=${encodeURIComponent('/community/profile')}`),
  signIn: () => portalUrl(`/login?redirect=${encodeURIComponent('/community')}`),
  useBlueprint: (id: string) => portalUrl(`/login?portal=organizer&redirect=${encodeURIComponent(`/organizer/community/blueprints/${id}?fork=1`)}`),
  report: (type: string, id: string) => {
    if (type !== 'profile' && type !== 'blueprint') throw new Error('Unsupported community report type')
    return portalUrl(`/login?redirect=${encodeURIComponent(`/community/report?type=${type}&id=${id}`)}`)
  },
}
