# 001 — Preserve useful feedback in reduced-motion mode

- **Status**: TODO
- **Commit**: 1dfab30
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 1 file, small

## Problem

The global reduced-motion rule shortens every transition to `0.01ms`, including color and opacity feedback that helps communicate focus, hover, and state changes. This makes the experience feel abruptly disabled instead of reducing only spatial or decorative motion.

`src/styles.css:254–261` currently contains:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Target

Keep the `0.01ms` animation duration for CSS keyframe sequences and keep instant scrolling. Remove the universal `transition-duration` override. Preserve concise interaction feedback on controls at `150ms`; this is within the animation guide's 100–160ms button-press budget. Keep spatial motion disabled for the existing `.lift-card`, `.motion-arrow`, and `.lift-media` interactions.

Target reduced-motion rule:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  :where(a, button, input, select, textarea, [role='button']) {
    transition-duration: 150ms !important;
  }
}
```

Retain the existing reduced-motion block for `.lift-card:hover`, `.lift-card:focus-visible`, `.motion-arrow`, and `.lift-media`; those rules remove their spatial transforms.

## Repo conventions to follow

- Reduced motion is declared in `src/styles.css`.
- `src/components/motion/reveal.tsx:27–30` uses the shared `prefersReducedMotion()` helper and leaves content visible when reduced motion is enabled.
- Keep the rule CSS-only and do not add a motion library or dependency.

## Steps

1. In `src/styles.css`, remove `transition-duration: 0.01ms !important` from the universal reduced-motion rule.
2. Add the `:where(a, button, input, select, textarea, [role='button'])` override shown above with a `150ms` transition duration.
3. Leave `animation-duration: 0.01ms` and `scroll-behavior: auto` in the universal block.
4. Leave the existing transform suppression for `.lift-card`, `.motion-arrow`, and `.lift-media` in place.

## Boundaries

- Do NOT modify `src/components/ui/button.tsx`; button transition properties are handled by plan 003.
- Do NOT change the standard-motion behavior or the 180ms/220ms durations in the card motion rules.
- Do NOT add dependencies.
- If the reduced-motion selectors have changed since commit `1dfab30`, stop and report the drift before editing.

## Verification

- **Mechanical**: run `pnpm exec tsc --noEmit`, `pnpm lint`, and `pnpm build`; expect all three to pass.
- **Feel check**: enable `prefers-reduced-motion: reduce` in browser DevTools. Hover the blog, “How it works,” and organizer pillar cards: no card lift, image zoom, or arrow movement should occur. Focus and hover buttons and links: color and opacity feedback should remain brief and visible. Scroll to a lower section: the page should jump instead of smooth scrolling.
- **Done when**: reduced-motion mode removes spatial movement while retaining 150ms control transitions and instant document scrolling.
