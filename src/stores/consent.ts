import { create } from 'zustand'
import {
  CONSENT_VERSION,
  consentCookie,
  parseConsent,
  readCookie,
  serializeConsent,
} from '#/lib/consent'
import { PREFERENCE_KEYS, STORAGE } from '#/lib/storage-registry'

type Status = 'loading' | 'none' | 'accepted' | 'declined'

interface ConsentState {
  status: Status
  settingsOpen: boolean
  load: () => void
  accept: () => void
  decline: () => void
  openSettings: () => void
  closeSettings: () => void
  forgetDetails: () => void
  onAccepted: (cb: () => void) => void
}

const callbacks: Array<() => void> = []

function removeKeys(keys: Array<string>) {
  try {
    for (const k of keys) localStorage.removeItem(k)
  } catch {
    // storage unavailable: nothing was written, nothing to remove
  }
}

function writeChoice(choice: 'accepted' | 'declined') {
  const secure =
    typeof location !== 'undefined' && location.protocol === 'https:'
  document.cookie = consentCookie(
    serializeConsent(choice, Date.now(), CONSENT_VERSION),
    365,
    secure,
  )
}

export const useConsent = create<ConsentState>()((set, get) => ({
  status: 'loading',
  settingsOpen: false,
  load: () => {
    const choice = parseConsent(
      readCookie(document.cookie, STORAGE.consent.key),
    )
    // Anything kept without an Accept (for example from before this banner
    // existed) is removed, so a visitor never has data we have no consent for.
    if (choice !== 'accepted') removeKeys(PREFERENCE_KEYS)
    set({ status: choice ?? 'none' })
  },
  accept: () => {
    writeChoice('accepted')
    set({ status: 'accepted' })
    for (const cb of callbacks) cb()
  },
  decline: () => {
    writeChoice('declined')
    removeKeys(PREFERENCE_KEYS)
    set({ status: 'declined' })
  },
  openSettings: () => set({ settingsOpen: true }),
  closeSettings: () => set({ settingsOpen: false }),
  forgetDetails: () => removeKeys([STORAGE.contact.key]),
  onAccepted: (cb) => {
    callbacks.push(cb)
    // already accepted before the store that registered was created
    if (get().status === 'accepted') cb()
  },
}))

export const canStorePreferences = () => useConsent.getState().status === 'accepted'
