# 002 — Respect reduced motion when checkout scrolls to questions

- **Status**: TODO
- **Commit**: 1dfab30
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 1 file, small

## Problem

When checkout detects a stale questionnaire, it replaces the questions and always smooth-scrolls to them. That explicit JavaScript behavior bypasses the stylesheet's reduced-motion scroll setting.

`src/routes/_attendee/events/$eventId/checkout.tsx:320–326` currently contains:

```tsx
if (issue.kind === 'questionnaire_stale') {
  setFreshQuestionnaire(asQuestionnaire(issue.questionnaire))
  setAnswers({})
  window.setTimeout(
    () => questionsRef.current?.scrollIntoView({ behavior: 'smooth' }),
    0,
  )
}
```

## Target

Use the existing `prefersReducedMotion()` helper from `src/lib/motion.ts`. Scroll smoothly for standard motion settings and use `auto` when reduced motion is requested:

```tsx
window.setTimeout(
  () =>
    questionsRef.current?.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    }),
  0,
)
```

## Repo conventions to follow

- `src/lib/motion.ts:6–15` exports `prefersReducedMotion()` and safely returns `false` when `matchMedia` is unavailable.
- `src/components/motion/reveal.tsx:27–30` imports and calls this helper before applying scroll-reveal motion.
- `src/routes/_attendee/contact.tsx` already checks the same media query before its user-initiated scroll; keep the checkout route consistent with that behavior while using the shared helper.

## Steps

1. Add `import { prefersReducedMotion } from '#/lib/motion'` to `src/routes/_attendee/events/$eventId/checkout.tsx`.
2. Change the questionnaire `scrollIntoView` behavior to `prefersReducedMotion() ? 'auto' : 'smooth'` using the target snippet.
3. Preserve the `setTimeout(..., 0)` so scrolling occurs after the refreshed questionnaire has rendered.

## Boundaries

- Do NOT change questionnaire refresh, validation, or payment behavior.
- Do NOT modify the contact page or global scroll rules.
- Do NOT add dependencies.
- If the stale-questionnaire branch has changed since commit `1dfab30`, stop and report the drift before editing.

## Verification

- **Mechanical**: run `pnpm exec tsc --noEmit`, `pnpm lint`, and `pnpm build`; expect all three to pass.
- **Feel check**: in checkout, trigger the stale-questionnaire refresh with standard motion enabled; confirm the view scrolls to the new questions after they render. Repeat with `prefers-reduced-motion: reduce`; confirm the view moves there immediately.
- **Done when**: the same refresh works in both modes and reduced-motion mode does not animate the scroll.
