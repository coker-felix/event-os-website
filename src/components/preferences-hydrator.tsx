import { useEffect } from 'react'
import { useCarts } from '#/stores/carts'
import { useConsent } from '#/stores/consent'
import { usePreferences } from '#/stores/preferences'
import { useTheme } from '#/stores/theme'

/** Loads persisted stores after mount, so SSR and first paint match. */
export function PreferencesHydrator() {
  useEffect(() => {
    useConsent.getState().load()
    void usePreferences.persist.rehydrate()
    void useCarts.persist.rehydrate()
    void useTheme.persist.rehydrate()
  }, [])
  return null
}
