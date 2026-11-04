import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createGatedStorage } from '#/lib/consent'
import { STORAGE } from '#/lib/storage-registry'
import { canStorePreferences, useConsent } from '#/stores/consent'
import type { Remembered } from '#/features/checkout/prefill'

interface ContactState {
  remembered: Remembered | null
  remember: (r: Remembered) => void
  forget: () => void
}

/**
 * Phone, email and delivery channel from the last checkout, kept on this
 * device only and written only after the visitor accepts.
 */
export const useContact = create<ContactState>()(
  persist(
    (set) => ({
      remembered: null,
      remember: (remembered) => set({ remembered }),
      forget: () => {
        set({ remembered: null })
        // Setting state re-saves it; remove the key so nothing is left behind.
        useContact.persist.clearStorage()
      },
    }),
    {
      name: STORAGE.contact.key,
      storage: createJSONStorage(() =>
        createGatedStorage(canStorePreferences, localStorage),
      ),
      partialize: (s) => ({ remembered: s.remembered }),
      skipHydration: true,
    },
  ),
)

// Details entered before Accept live in memory; save them once accepted.
useConsent.getState().onAccepted(() => {
  if (useContact.getState().remembered) useContact.setState({})
})
// Decline and "Forget my details" must empty memory too, not just storage.
useConsent.getState().onForget(() => useContact.getState().forget())
