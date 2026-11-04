import { useEffect } from 'react'
import { useCarts } from '#/stores/carts'
import { usePreferences } from '#/stores/preferences'

/** Loads persisted stores after mount, so SSR and first paint match. */
export function PreferencesHydrator() {
  useEffect(() => {
    void usePreferences.persist.rehydrate()
    void useCarts.persist.rehydrate()
  }, [])
  return null
}
