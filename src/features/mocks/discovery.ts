import { hash, uuidFromSeed } from '#/lib/mocks'
import type { Organizer, PastEvent, ReviewSummary } from '#/features/discovery/types'

/** Invented, dev only. Names are made up and do not refer to real businesses. */
const ORGS: Array<{ name: string; city: string; bio: string }> = [
  { name: 'Sunset Sessions', city: 'Lagos', bio: 'Rooftop nights with live DJs and skyline views, every other weekend.' },
  { name: 'Harbour Nights', city: 'Lagos', bio: 'Boat parties, beach clubs and late sets by the water.' },
  { name: 'The Gather Co.', city: 'Abuja', bio: 'Community dinners, markets and open-air film evenings.' },
  { name: 'Green Room Live', city: 'Port Harcourt', bio: 'Small rooms, loud bands. Live music from local acts.' },
  { name: 'Afterglow Events', city: 'Ibadan', bio: 'Festivals and day parties built around food and music.' },
  { name: 'Common Ground', city: 'Abuja', bio: 'Talks, workshops and meetups for people who make things.' },
]

const TINTS = ['#176b5b', '#e8b34b', '#b83d36', '#286b83', '#a96512', '#247a52']
const NOW = () => Math.floor(Date.now() / 1000)

export function mockOrganizers(): Array<Organizer> {
  return ORGS.map((o, i) => ({
    id: uuidFromSeed(`org-${i}`),
    name: o.name,
    city: o.city,
    bio: o.bio,
    upcomingCount: 1 + (hash(o.name) % 5),
    hostedCount: 8 + (hash(o.name + 'h') % 60),
  }))
}

export function mockOrganizer(id: string): Organizer | null {
  return mockOrganizers().find((o) => o.id === id) ?? null
}

/** A stable organizer for an event id, so cards and profiles agree. */
export function mockOrganizerFor(eventId: string): Organizer {
  const all = mockOrganizers()
  return all[hash(eventId) % all.length]
}

const PAST_TITLES = ['Rooftop Sunset Sessions', 'Beach Club Takeover', 'Lagoon Night Market', 'Highlife Evening', 'Summer Closing Party', 'Open Air Cinema']

export function mockPastEvents(organizerId?: string): Array<PastEvent> {
  const orgs = organizerId ? mockOrganizers().filter((o) => o.id === organizerId) : mockOrganizers()
  const out: Array<PastEvent> = []
  orgs.forEach((o, oi) => {
    for (let n = 0; n < 4; n++) {
      const seed = `${o.id}-past-${n}`
      const h = hash(seed)
      out.push({
        id: uuidFromSeed(seed),
        title: PAST_TITLES[(h + oi) % PAST_TITLES.length],
        startsAt: NOW() - (n + 1) * 26 * 86400,
        city: o.city,
        organizerId: o.id,
        organizerName: o.name,
        accentColor: TINTS[h % TINTS.length],
        photos: [],
        photoCount: 8 + (h % 30),
        videoUrl: h % 2 === 0 ? 'https://example.com/aftermovie' : undefined,
        rating: { average: 3.8 + (h % 12) / 10, count: 6 + (h % 40) },
      })
    }
  })
  return out
}

const QUOTES = [
  'Best sound system I have heard at an outdoor night. Worth every kobo.',
  'Great vibes, but the bar line was long. Go early.',
  'Easy entry, friendly staff, and the music never dropped.',
  'The view alone made it. Will be back next month.',
  'Smooth from ticket to gate. The scanner took seconds.',
]

export function mockReviewSummary(seed: string): ReviewSummary {
  const h = hash(seed)
  return {
    average: 4 + (h % 9) / 10,
    count: 12 + (h % 90),
    recent: [0, 1, 2].map((i) => ({
      id: `${seed}-r${i}`,
      rating: 5 - ((h + i) % 2),
      text: QUOTES[(h + i) % QUOTES.length],
      createdAt: NOW() - (i + 1) * 3 * 86400,
    })),
  }
}
