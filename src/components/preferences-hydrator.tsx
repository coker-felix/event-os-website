import { useEffect } from 'react'
import { useCarts } from '#/stores/carts'
import { useConsent } from '#/stores/consent'
import { usePreferences } from '#/stores/preferences'
import { useContact } from '#/stores/contact'
import { useTheme } from '#/stores/theme'

/** Loads persisted stores after mount, so SSR and first paint match. */
export function PreferencesHydrator() {
  useEffect(() => {
    useConsent.getState().load()
    void usePreferences.persist.rehydrate()
    void useCarts.persist.rehydrate()
    void useTheme.persist.rehydrate()
    void useContact.persist.rehydrate()
  }, [])
  return null
}
