import { STORAGE } from '#/lib/storage-registry'
import type { StorageEntry } from '#/lib/storage-registry'
import type { LegalDoc, LegalSection } from './types'

const entries = Object.values(STORAGE) as Array<StorageEntry>

const describe = (s: StorageEntry) =>
  `${s.key} (${s.kind === 'cookie' ? 'cookie' : 'browser storage'}). Holds: ${s.holds}. Written: ${s.when}. Kept: ${s.duration}.`

const necessary = entries.filter((s) => s.category === 'necessary')
const preferences = entries.filter((s) => s.category === 'preferences')

const section = (
  id: string,
  audience: LegalSection['audience'],
  heading: string,
  body: Array<string>,
): LegalSection => ({ id, audience, heading, body })

/** Generated from the storage registry, so it cannot miss a key. */
export const COOKIES: LegalDoc = {
  slug: 'cookies',
  title: 'Cookies and browser storage',
  intro:
    'This page lists everything EventRail keeps in your browser. There is no tracking and no advertising: nothing here follows you across sites or builds a profile of you.',
  sections: [
    section('necessary', 'all', 'Necessary', [
      'These keep the site working and need no consent.',
      ...necessary.map(describe),
    ]),
    section('preferences', 'all', 'Preferences', [
      'These are written only after you choose Accept. Choosing Decline, or withdrawing later, deletes them.',
      ...preferences.map(describe),
    ]),
    section('your-choice', 'all', 'Your choice', [
      'Use Cookie settings in the footer at any time to accept, decline, or choose Forget my details.',
      'Clearing site data in your browser removes everything listed here.',
    ]),
    section('attendees', 'attendees', 'Checkout details we remember', [
      'If you accept, we remember your phone, email and ticket delivery channel on this device when you start a payment, so checkout is filled in next time. They stay on this device and are not sent anywhere for this purpose.',
    ]),
    section('vendors', 'vendors', 'Vendor pages and the portal', [
      'Browsing vendor pages uses the same storage as the rest of the site. The portal you sign in to is a separate service. [To confirm: the portal\'s own cookie notice]',
    ]),
    section('organizers', 'organizers', 'Event organizers', [
      'Organizer sign-in happens in the portal, a separate service. [To confirm: the portal\'s own cookie notice]',
    ]),
    section('venues', 'venues', 'Venue owners', [
      'Browsing venue pages uses the same storage as the rest of the site. Managing a venue happens in the portal, a separate service. [To confirm: the portal\'s own cookie notice]',
    ]),
  ],
}
