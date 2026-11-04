import { useEffect } from 'react'
import { usePreferences } from '#/stores/preferences'

/** Loads persisted preferences after mount, so SSR and first paint match. */
export function PreferencesHydrator() {
  useEffect(() => {
    void usePreferences.persist.rehydrate()
  }, [])
  return null
}
