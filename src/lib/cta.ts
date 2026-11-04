/**
 * One style for call-to-action buttons and links, so they stay the same size
 * and shape everywhere. Radius is `rounded-sm` (8px in this theme), not a pill.
 */
const BASE =
  'inline-flex items-center justify-center gap-2 rounded-sm font-ui text-sm font-medium whitespace-nowrap transition-colors'

export const CTA = {
  /** Teal fill, for the main action on a light surface. */
  primary: `${BASE} h-10 px-4 bg-primary text-primary-foreground hover:bg-primary/90`,
  /** White fill, for the main action on an ink, teal or photo surface. */
  onDark: `${BASE} h-10 px-4 bg-white text-ink hover:bg-white/90`,
  /** Outline, for the second action on a dark surface. */
  outlineOnDark: `${BASE} h-10 px-4 border border-white/40 text-white hover:border-white`,
  /** Dark ink fill, for a main action that is not teal. */
  ink: `${BASE} h-10 px-4 bg-ink text-white hover:bg-ink/90`,
  /** Outline, for a second action on a light surface. */
  outline: `${BASE} h-10 px-4 border border-line bg-card text-foreground hover:border-foreground`,
  /** Text only, for a quiet action. */
  ghost: `${BASE} h-10 px-3 text-violet-ink hover:underline`,
  /** A filter chip, chosen and not chosen. */
  chipOn: `${BASE} h-9 px-3.5 bg-ink text-white`,
  chipOff: `${BASE} h-9 px-3.5 border border-line bg-card text-foreground hover:border-foreground`,
  /** A native select next to the chips: same height and radius, form-control text. */
  select: 'h-9 rounded-sm border border-line bg-card px-3 font-ui text-sm font-medium text-foreground',
  /** Compact, for the navbar. */
  nav: `${BASE} h-9 px-3.5 bg-primary text-primary-foreground hover:bg-primary/90`,
  navQuiet: `${BASE} h-9 px-3 text-muted-foreground hover:text-foreground`,
} as const
