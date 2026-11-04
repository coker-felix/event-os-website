import { describe, expect, it } from 'vitest'
import { safeApplyHref, visibleJobs, visibleTeam } from './visible'

describe('safeApplyHref', () => {
  it('allows https links and mailto addresses', () => {
    expect(safeApplyHref('https://jobs.test/a')).toBe('https://jobs.test/a')
    expect(safeApplyHref('mailto:jobs@example.com')).toBe('mailto:jobs@example.com')
  })
  it('rejects everything else', () => {
    for (const bad of ['http://x.test', 'javascript:alert(1)', 'mailto:not an email', 'mailto:', '', 'jobs@example.com'])
      expect(safeApplyHref(bad)).toBeUndefined()
  })
})

describe('visibleTeam', () => {
  it('needs a name and a role, trims them, and drops duplicates', () => {
    const t = visibleTeam([
      { name: ' Ama Mensah ', role: ' Founder ' },
      { name: 'ama mensah', role: 'Founder' },
      { name: '', role: 'x' },
      { name: 'No Role', role: '' },
    ])
    expect(t.map((m) => [m.name, m.role])).toEqual([['Ama Mensah', 'Founder']])
  })
  it('drops an unsafe photo or profile link but keeps the person', () => {
    const [m] = visibleTeam([{ name: 'A', role: 'B', photo: 'javascript:1', link: 'http://x.test' }])
    expect(m.photo).toBeUndefined()
    expect(m.link).toBeUndefined()
  })
  it('keeps a safe photo and link, caps the bio, and caps the team at 24', () => {
    const [m] = visibleTeam([{ name: 'A', role: 'B', photo: '/team/a.jpg', link: 'https://x.test', bio: 'a'.repeat(400) }])
    expect(m.photo).toBe('/team/a.jpg')
    expect(m.link).toBe('https://x.test')
    expect(m.bio?.length).toBe(280)
    expect(visibleTeam(Array.from({ length: 40 }, (_, i) => ({ name: `P${i}`, role: 'r' }))).length).toBe(24)
  })
})

describe('visibleJobs', () => {
  it('needs a title and a safe way to apply', () => {
    const j = visibleJobs([
      { title: 'Designer', team: 'Product', location: 'Accra', type: 'Full time', apply: 'mailto:jobs@example.com' },
      { title: 'No link', team: 'x', location: 'y', type: 'z', apply: 'http://x.test' },
      { title: '', team: 'x', location: 'y', type: 'z', apply: 'https://x.test' },
    ])
    expect(j.map((x) => x.title)).toEqual(['Designer'])
  })
})
