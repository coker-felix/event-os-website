import { Monitor, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { applyTheme, useTheme } from '#/stores/theme'
import { nextChoice } from '#/lib/theme'
import type { ThemeChoice } from '#/lib/theme'

const LABEL: Record<ThemeChoice, string> = {
  system: 'System',
  light: 'Light',
  dark: 'Dark',
}
const ICON = { system: Monitor, light: Sun, dark: Moon } as const

/** Cycles System, Light, Dark. Announces the new choice politely. */
export function ThemeToggle() {
  const choice = useTheme((s) => s.choice)
  const cycle = useTheme((s) => s.cycle)
  // Server and first client render both show "System"; the saved choice
  // arrives after the hydrator runs.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Keep <html> in step with the choice, and with the device while on System.
  useEffect(() => {
    if (!mounted) return
    // Read the live store: the hydrator may have loaded the saved choice
    // after this render, and applying the stale one would flicker.
    const live = useTheme.getState().choice
    applyTheme(live)
    if (live !== 'system') return
    const mq = matchMedia('(prefers-color-scheme: dark)')
    const on = () => applyTheme('system')
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [choice, mounted])

  const Icon = ICON[choice]
  return (
    <>
      <button
        type="button"
        onClick={cycle}
        aria-label={`Theme: ${LABEL[choice]}. Switch to ${LABEL[nextChoice(choice)].toLowerCase()}.`}
        className="grid size-11 place-items-center rounded-full border border-line bg-card text-foreground hover:border-foreground"
      >
        <Icon className="size-5" aria-hidden />
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {mounted ? `Theme: ${LABEL[choice]}` : ''}
      </span>
    </>
  )
}
