import { describe, expect, it } from 'vitest'
import { visibleTestimonials } from './visible'
import type { Testimonial } from './visible'

const t = (o: Partial<Testimonial> = {}): Testimonial => ({
  quote: 'It saved us a week of work.',
  name: 'Ama Mensah',
  role: 'Organizer',
  audience: 'organizers',
  ...o,
})

describe('visibleTestimonials', () => {
  it('shows only the audience asked for', () => {
    const list = [t(), t({ quote: 'Booked three events.', audience: 'vendors' })]
    expect(visibleTestimonials(list, 'vendors').map((x) => x.quote)).toEqual(['Booked three events.'])
    expect(visibleTestimonials(list, 'organizers')).toHaveLength(1)
  })
  it('needs a quote and a name, and trims them', () => {
    expect(visibleTestimonials([t({ quote: '  ' }), t({ name: '' })], 'organizers')).toEqual([])
    expect(visibleTestimonials([t({ quote: '  Great  ', name: ' A ' })], 'organizers')[0]).toMatchObject({ quote: 'Great', name: 'A' })
  })
  it('refuses a quote over 280 characters rather than cutting it', () => {
    expect(visibleTestimonials([t({ quote: 'a'.repeat(281) })], 'organizers')).toEqual([])
    expect(visibleTestimonials([t({ quote: 'a'.repeat(280) })], 'organizers')).toHaveLength(1)
  })
  it('drops duplicate quotes and shows at most three', () => {
    expect(visibleTestimonials([t(), t()], 'organizers')).toHaveLength(1)
    const many = Array.from({ length: 6 }, (_, i) => t({ quote: `Quote ${i}` }))
    expect(visibleTestimonials(many, 'organizers')).toHaveLength(3)
  })
  it('drops an unsafe photo but keeps the person', () => {
    expect(visibleTestimonials([t({ photo: 'javascript:1' })], 'organizers')[0].photo).toBeUndefined()
  })
})
