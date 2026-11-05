# 003 — Scope shared button transitions to feedback properties

- **Status**: TODO
- **Commit**: 1dfab30
- **Severity**: LOW
- **Category**: Performance
- **Estimated scope**: 1 file, small

## Problem

The shared button class uses Tailwind's `transition-all`. That allows every property change on the button to animate, including layout or transform properties that are not part of its current hover, focus, or disabled feedback.

`src/components/ui/button.tsx:7–8` currently contains:

```tsx
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
```

## Target

Replace `transition-all` with explicit transitions for the properties used by button states: `color`, `background-color`, `border-color`, and `opacity`. Use `150ms ease-out`, within the animation guide's button-press budget. The target base string begins:

```tsx
"inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-[color,background-color,border-color,opacity] duration-150 ease-out outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
```

Keep the existing variants, focus rings, disabled behavior, and sizes unchanged.

## Repo conventions to follow

- The shared variants live in `src/components/ui/button.tsx` and are created with `class-variance-authority`.
- `src/styles.css:153–161` uses explicit CSS transition properties for the new card motion; use the same property-specific approach here.
- Do not add a CSS helper or a new dependency for this single shared class.

## Steps

1. In `src/components/ui/button.tsx`, replace `transition-all` with `transition-[color,background-color,border-color,opacity] duration-150 ease-out` in the shared base class.
2. Leave every variant and size class unchanged.

## Boundaries

- Do NOT change button dimensions, focus-ring styles, colors, variants, or component API.
- Do NOT change transitions in links, cards, dialogs, or sheets.
- Do NOT add dependencies.
- If the shared base class has changed since commit `1dfab30`, stop and report the drift before editing.

## Verification

- **Mechanical**: run `pnpm exec tsc --noEmit`, `pnpm lint`, and `pnpm build`; expect all three to pass.
- **Feel check**: hover and focus each button variant, and toggle disabled state. Confirm color, border, and opacity feedback remains responsive; confirm no dimension or transform changes animate. In DevTools' Animations panel at 10% playback, verify a button does not animate width, height, padding, or position.
- **Done when**: the shared button no longer uses `transition-all`, and only the listed feedback properties transition over 150ms with `ease-out`.
