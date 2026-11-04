/**
 * Everything the site keeps in the visitor's browser. The Cookies page is
 * generated from this table, and a test fails if the source uses an
 * `event-os:` key that is not listed here.
 */
export type StorageCategory = 'necessary' | 'preferences'

export interface StorageEntry {
  key: string
  kind: 'cookie' | 'localStorage'
  category: StorageCategory
  holds: string
  when: string
  duration: string
}

export const STORAGE = {
  consent: {
    key: 'eos_consent',
    kind: 'cookie',
    category: 'necessary',
    holds: 'Your cookie choice (accepted or declined), its version and the date',
    when: 'When you choose Accept or Decline',
    duration: '1 year',
  },
  carts: {
    key: 'event-os:carts',
    kind: 'localStorage',
    category: 'necessary',
    holds: 'The ID and access token of your cart for each event',
    when: 'When you choose tickets',
    duration: 'Until the order completes or you clear site data',
  },
  preferences: {
    key: 'event-os:preferences',
    kind: 'localStorage',
    category: 'preferences',
    holds: 'Your chosen city, the events you saved and the organizers you follow',
    when: 'After you accept, when you pick a city, save an event or follow an organizer',
    duration: 'Until you decline, withdraw or clear site data',
  },
  theme: {
    key: 'event-os:theme',
    kind: 'localStorage',
    category: 'preferences',
    holds: 'Light, dark or follow-my-device',
    when: 'After you accept, when you change the theme',
    duration: 'Until you decline, withdraw or clear site data',
  },
  contact: {
    key: 'event-os:contact',
    kind: 'localStorage',
    category: 'preferences',
    holds: 'Your phone, email and ticket delivery channel',
    when: 'After you accept, when you start a payment at checkout',
    duration: 'Until you choose Forget my details, decline or clear site data',
  },
} as const satisfies Record<string, StorageEntry>

/** localStorage keys that may only be written after the visitor accepts. */
export const PREFERENCE_KEYS: Array<string> = (
  Object.values(STORAGE) as Array<StorageEntry>
)
  .filter((s) => s.category === 'preferences' && s.kind === 'localStorage')
  .map((s) => s.key)
