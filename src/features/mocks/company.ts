import type { Job, TeamMember } from '#/features/company/visible'

/** Invented, dev only. Fictional people and roles; none refers to anyone real. */
export const MOCK_TEAM: Array<TeamMember> = [
  { name: 'Efua Boateng', role: 'Co-founder, product', bio: 'Spent years running events and still believes the best ones feel effortless.' },
  { name: 'Kojo Antwi-Mensah', role: 'Co-founder, engineering', bio: 'Builds the systems that keep a ticket scan under a second.' },
  { name: 'Abena Owusu', role: 'Head of partnerships', bio: 'Works with venues and vendors so organizers can book with confidence.' },
  { name: 'Yaw Darko', role: 'Design lead', bio: 'Makes busy things calm.' },
  { name: 'Naana Quartey', role: 'Support lead', bio: 'First to answer when something goes wrong on the night.' },
  { name: 'Kwesi Adjei', role: 'Operations', bio: 'Keeps payouts, verification and the details moving.' },
]

export const MOCK_JOBS: Array<Job> = [
  { title: 'Product designer', team: 'Product', location: 'Accra', type: 'Full time', apply: 'mailto:jobs@example.com' },
  { title: 'Backend engineer', team: 'Engineering', location: 'Remote', type: 'Full time', apply: 'mailto:jobs@example.com' },
  { title: 'Partnerships manager', team: 'Partnerships', location: 'Accra', type: 'Full time', apply: 'mailto:jobs@example.com' },
]
