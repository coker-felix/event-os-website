import { STORAGE } from './storage-registry'

export type ThemeChoice = 'system' | 'light' | 'dark'

const ORDER: Array<ThemeChoice> = ['system', 'light', 'dark']

export function resolveTheme(
  choice: ThemeChoice,
  systemDark: boolean,
): 'light' | 'dark' {
  if (choice === 'system') return systemDark ? 'dark' : 'light'
  return choice
}

export function nextChoice(c: ThemeChoice): ThemeChoice {
  return ORDER[(ORDER.indexOf(c) + 1) % ORDER.length]
}

/** Unknown or corrupt stored values fall back to following the device. */
export function parseTheme(v: unknown): ThemeChoice {
  return v === 'light' || v === 'dark' || v === 'system' ? v : 'system'
}

/**
 * Inline script for <head>: sets the theme before first paint so there is no
 * flash. Reads the zustand-persisted choice, falls back to the device, and
 * never throws (storage can be blocked).
 */
export function themeScript(): string {
  return `try{var c='system';try{var s=localStorage.getItem(${JSON.stringify(STORAGE.theme.key)});if(s){var v=JSON.parse(s).state.choice;if(v==='light'||v==='dark'||v==='system')c=v}}catch(e){}var d=c==='dark'||(c==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light'}catch(e){}`
}
