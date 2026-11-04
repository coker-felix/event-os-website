import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createGatedStorage } from '#/lib/consent'
import { STORAGE } from '#/lib/storage-registry'
import { canStorePreferences, useConsent } from '#/stores/consent'

interface PreferencesState {
  /** Chosen city, or null for all locations. */
  city: string | null
  /** Saved event ids. Local only until sign-in can sync them to the API. */
  saved: Array<string>
  setCity: (city: string | null) => void
  toggleSaved: (eventId: string) => void
}

/**
 * Persisted in localStorage. `skipHydration` keeps the first client render
 * identical to the server render; <PreferencesHydrator /> loads the saved
 * values right after mount.
 */
export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      city: null,
      saved: [],
      setCity: (city) => set({ city }),
      toggleSaved: (eventId) =>
        set((s) => ({
          saved: s.saved.includes(eventId)
            ? s.saved.filter((id) => id !== eventId)
            : [...s.saved, eventId],
        })),
    }),
    {
      name: STORAGE.preferences.key,
      storage: createJSONStorage(() =>
        createGatedStorage(canStorePreferences, localStorage),
      ),
      skipHydration: true,
    },
  ),
)

// Choices made before Accept live in memory; save them once the visitor accepts.
useConsent.getState().onAccepted(() => {
  usePreferences.setState({})
})
