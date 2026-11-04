export type Audience = 'all' | 'attendees' | 'vendors' | 'organizers' | 'venues'

export interface LegalSection {
  id: string
  audience: Audience
  heading: string
  body: Array<string>
}

export interface LegalDoc {
  slug: 'terms' | 'privacy' | 'cookies'
  title: string
  intro: string
  sections: Array<LegalSection>
}
