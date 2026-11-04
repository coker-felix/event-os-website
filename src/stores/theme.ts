import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createGatedStorage } from '#/lib/consent'
import { STORAGE } from '#/lib/storage-registry'
import { nextChoice, parseTheme, resolveTheme } from '#/lib/theme'
import type { ThemeChoice } from '#/lib/theme'
import { canStorePreferences, useConsent } from '#/stores/consent'

interface ThemeState {
  choice: ThemeChoice
  setChoice: (c: ThemeChoice) => void
  cycle: () => void
}

/** Light, dark or follow-the-device. Saved only after the visitor accepts. */
export const useTheme = create<ThemeState>()(
  persist(
    (set) => ({
      choice: 'system',
      setChoice: (choice) => set({ choice }),
      cycle: () => set((s) => ({ choice: nextChoice(s.choice) })),
    }),
    {
      name: STORAGE.theme.key,
      storage: createJSONStorage(() =>
        createGatedStorage(canStorePreferences, localStorage),
      ),
      skipHydration: true,
      merge: (persisted, current) => ({
        ...current,
        choice: parseTheme((persisted as Partial<ThemeState> | undefined)?.choice),
      }),
    },
  ),
)

/** Applies the current choice to <html>. Call after every change. */
export function applyTheme(choice: ThemeChoice) {
  const dark = resolveTheme(
    choice,
    matchMedia('(prefers-color-scheme: dark)').matches,
  )
  const root = document.documentElement
  root.classList.toggle('dark', dark === 'dark')
  root.style.colorScheme = dark
}

useConsent.getState().onAccepted(() => {
  useTheme.setState({})
})
