# Dark Mode, Motion, Cookie Consent, Footer and Legal Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add cookie consent that gates what the site remembers, dark mode, smooth scroll and scroll animations, remembered checkout details, a fuller footer, and Terms, Privacy and Cookies pages.

**Architecture:** One storage registry is the source of truth for everything the site keeps in the browser. A consent store gates the Preferences keys (city and saved events, theme, remembered contact). Theme, motion and legal content are small modules with pure logic under tests; pages and components use them.

**Tech Stack:** TanStack Start/Router/Query, React 19, Tailwind v4, shadcn, zustand, vitest, pnpm.

**Spec:** `docs/superpowers/specs/2026-11-04-polish-consent-legal-design.md`.

## Global Constraints

- Storage registry (code is the source of truth): `eos_consent` cookie (Necessary, 1 year, `SameSite=Lax`); localStorage `event-os:carts` (Necessary); `event-os:preferences`, `event-os:theme`, `event-os:contact` (Preferences, written only after Accept).
- Before a choice or after Decline the site works fully but writes no Preferences key; Decline or withdraw deletes every Preferences key. On load, Preferences keys that exist without an Accept are deleted. Cart and consent record stay.
- No analytics, advertising or tracking, and the copy says so.
- Remembered details: phone, email and delivery channel only, on that device only, saved when payment starts after Accept; a cart's own contact details beat remembered ones; a visible "Forget my details" control.
- Dark mode: follows the device; header button cycles System, Light, Dark; no flash (inline head script); `text-violet` becomes `text-violet-ink`; tokens under `.dark`; contrast of key pairs at least 4.5:1 for text, enforced by a test that reads `src/styles.css`.
- Motion: smooth scroll is CSS only and only when `prefers-reduced-motion: no-preference`; scroll reveals never hide content without JavaScript or above the fold, and show everything at once for reduced motion; no count-up numbers.
- Legal pages are drafts: written only from what the product does; business and legal decisions are visible `[To confirm: ...]` placeholders; a "Draft, pending legal review" notice shows on every legal page until `VITE_LEGAL_REVIEWED=true`. Audiences: attendees, vendors, event organizers, venue owners. No payment protection, escrow-for-vendors or "Coming soon" feature is promised; the word "escrow" is not used.
- Same visual language as the rest of the site; mobile first at 390px, targets at least 44px, visible focus, labelled controls, sentence case, errors say what to do.
- Commit directly to `main`, one commit per task, no Claude attribution trailer. Do not push unless asked.

## Review Focus

1. A returning visitor who stored preferences before this feature, with no consent record: their Preferences keys are deleted on load (Task 1).
2. Decline or withdraw after details were remembered: phone and email are gone from storage at once, and the next checkout starts empty (Tasks 1, 4).
3. Declined or no choice: starting payment must not write `event-os:contact`; the cart token must still be written (Tasks 1, 4).
4. A cart that already has contact details: remembered details must not overwrite them (Task 4).
5. Theme: with an explicit light choice on a dark device and vice versa, the head script and the toggle agree; an unknown or corrupt stored value falls back to the device (Task 2).
6. Legal copy honesty: every storage key appears on the Cookies page, no banned phrase, placeholders for business decisions (Task 5).

## Execution notes (lessons from the earlier sections)

- zsh does not split unquoted variables: loop over an array. A `--include=*.ts` glob must be quoted.
- After `pnpm exec eslint --fix src`, confirm the exit code with `pnpm exec eslint src`.
- The router passes raw junk from the URL through `useSearch()`: validate again in the component.
- Never stop the user's API gateway or their other vite processes: start your own dev server, wait with a curl loop, kill only the listener on `:3000`. Check a production build with `pnpm build && pnpm preview --port 3000`.
- Read a file with the Read tool before editing a file you created through the shell.

## File structure

- `src/lib/`: `storage-registry.ts`, `consent.ts`, `theme.ts`, `motion.ts`, `legal.ts` (+ tests).
- `src/stores/`: `consent.ts`, `theme.ts`, `contact.ts`; modify `preferences.ts`, `carts.ts` (registry key only), `preferences-hydrator.tsx`.
- `src/features/checkout/prefill.ts` (+ test).
- `src/components/`: `consent/` (banner, settings), `layout/theme-toggle.tsx`, `motion/reveal.tsx`, `legal/legal-page.tsx`, `checkout/remember-note.tsx`; rewrite `layout/site-footer.tsx`; `src/config/footer.ts`.
- `src/content/legal/`: `types.ts`, `terms.ts`, `privacy.ts`, `cookies.ts`; routes `terms.tsx`, `privacy.tsx`, `cookies.tsx`.

---

### Task 1: Storage registry and cookie consent

**Files:** Create `src/lib/storage-registry.ts`, `src/lib/consent.ts`, `src/stores/consent.ts`, `src/components/consent/{consent-banner,cookie-settings}.tsx`, `src/lib/consent.test.ts`. Modify `src/stores/preferences.ts`, `src/stores/carts.ts`, `src/components/preferences-hydrator.tsx`, `src/routes/__root.tsx`.

**Interfaces:**
- Produces:
  - `STORAGE: Record<'consent'|'carts'|'preferences'|'theme'|'contact', { key: string; kind: 'cookie'|'localStorage'; category: 'necessary'|'preferences'; holds: string; when: string; duration: string }>`; `PREFERENCE_KEYS: string[]` (the localStorage keys whose category is `preferences`).
  - `CONSENT_VERSION = 1`; `type ConsentChoice = 'accepted'|'declined'`; `serializeConsent(choice: ConsentChoice, nowMs: number, version?: number): string`; `parseConsent(value: string | undefined, version?: number): ConsentChoice | null` (null for missing, malformed or another version); `readCookie(cookieHeader: string, name: string): string | undefined`; `consentCookie(value: string, maxAgeDays?: number, secure?: boolean): string`; `createGatedStorage(canWrite: () => boolean, inner: StateStorage): StateStorage` (reads and removals always pass, writes only when `canWrite()`).
  - `useConsent` (zustand): `status: 'loading'|'none'|'accepted'|'declined'`, `settingsOpen: boolean`; `load()` (reads the cookie; for any status other than accepted, deletes every `PREFERENCE_KEYS` key), `accept()`, `decline()` (sets the cookie, deletes Preferences keys), `openSettings()`, `closeSettings()`, `forgetDetails()` (deletes `event-os:contact` only); `onAccepted(cb)` registers a callback run once whenever status becomes `accepted`. `canStorePreferences(): boolean` (status is accepted).
- `usePreferences` persists through `createGatedStorage(canStorePreferences, localStorage)`; on `onAccepted` it re-saves its current state.

- [ ] **Step 1: Failing tests** in `consent.test.ts`: `parseConsent(serializeConsent('accepted', 1, 1), 1)` is `'accepted'` and likewise `'declined'`; `parseConsent` returns null for `undefined`, `''`, junk, and for a value written with version 1 read as version 2; `readCookie('a=1; eos_consent=xyz; b=2', 'eos_consent')` is `'xyz'` and a missing name is `undefined`; `consentCookie` contains `Max-Age=31536000`, `Path=/`, `SameSite=Lax`, and `Secure` only when asked; `createGatedStorage` with `canWrite` false never calls `setItem` on the inner storage but still reads and removes, and with true writes through; the registry has unique keys, `PREFERENCE_KEYS` equals `['event-os:preferences','event-os:theme','event-os:contact']`, and every `event-os:` string literal in non-test files under `src` (read with `node:fs`) is a key in the registry (**pins that the Cookies page cannot miss a key**). A `useConsent` test with an in-memory `localStorage` and `document.cookie` stub: `load()` with no cookie and `event-os:preferences` present deletes it and leaves `event-os:carts` (**Review Focus 1**); `decline()` after setting `event-os:contact` deletes it and keeps the cart key (**Review Focus 2**); `accept()` sets the cookie and status.
- [ ] **Step 2:** `pnpm exec vitest run src/lib/consent.test.ts` fails (modules missing).
- [ ] **Step 3:** Implement the modules above. The banner is a non-blocking `role="region"` bar at the bottom: one sentence ("We use browser storage to remember your choices, like your city, saved events, theme and checkout details. No tracking or ads."), **Accept**, **Decline**, a link to `/cookies`; both buttons at least 44px. `CookieSettings` is a shadcn `Dialog` bound to `settingsOpen` with the current choice, Accept and Decline, a **Forget my details** button and a link to `/cookies`. Mount both in `__root.tsx`; the hydrator calls `useConsent.getState().load()` before rehydrating stores. The banner shows only when `status === 'none'`, so server render and first client render match (status starts `'loading'`).
- [ ] **Step 4:** `pnpm exec vitest run && pnpm exec tsc --noEmit && pnpm exec eslint src && pnpm build` pass (Expected: all green). Dev server: `curl localhost:3000/` is 200 and the server HTML contains no consent banner text (it appears only after mount).
- [ ] **Step 5:** commit `Add storage registry and cookie consent`.

### Task 2: Dark mode

**Files:** Create `src/lib/theme.ts`, `src/lib/theme.test.ts`, `src/lib/contrast.test.ts`, `src/stores/theme.ts`, `src/components/layout/theme-toggle.tsx`. Modify `src/styles.css`, `src/routes/__root.tsx`, `src/components/layout/site-header.tsx`, and every `*.tsx` using `text-violet`.

**Interfaces:**
- Produces: `type ThemeChoice = 'system'|'light'|'dark'`; `resolveTheme(choice: ThemeChoice, systemDark: boolean): 'light'|'dark'`; `nextChoice(c: ThemeChoice): ThemeChoice` (system, light, dark, system); `parseTheme(v: unknown): ThemeChoice` (unknown or corrupt becomes `'system'`); `themeScript(): string` (inline script that reads `localStorage['event-os:theme']`, falls back to `matchMedia('(prefers-color-scheme: dark)')`, toggles `dark` on `document.documentElement` and sets `colorScheme`; never throws). `useTheme` (zustand, persisted through the gated storage under `event-os:theme`): `choice`, `setChoice`, `cycle`.
- Contract: `src/styles.css` defines the dark values under `.dark` for `--background --foreground --card --secondary --muted-foreground --border --line --mist --ink --violet-ink --paper`, and a `--violet-ink` in `:root` (light: the brand violet) mapped as `--color-violet-ink`.

- [ ] **Step 1: Failing tests:** `theme.test.ts`: `resolveTheme` for all six combinations; `nextChoice` cycles in order; `parseTheme('banana')`, `parseTheme(null)`, `parseTheme(42)` are `'system'`; `themeScript()` run with fake `localStorage`, `matchMedia` and `document` sets `dark` for stored `'dark'` on a light device, clears it for stored `'light'` on a dark device, follows the device for `'system'`, for no stored value and for a corrupt value, and does not throw when `localStorage` throws (**Review Focus 5**). `contrast.test.ts`: read `src/styles.css`, parse the custom properties in `:root` and in `.dark`, compute WCAG contrast (hex only), and assert at least 4.5 for `foreground/background`, `foreground/card`, `mist/background`, `mist/card`, `violet-ink/background`, `violet-ink/card`, and `#ffffff` on `violet`, in both modes; also at least 3 for `line` against `background` is NOT required.
- [ ] **Step 2:** run; fails (modules and `.dark` tokens missing).
- [ ] **Step 3:** Implement. Dark values (a starting point to tune until the contrast test passes): `--background #0d0b1f`, `--foreground #f1effb`, `--card #17143a`, `--secondary #221e4d`, `--mist #a9a4cf`, `--line #2c2760`, `--ink #1f1b49` (panel colour, still dark enough for text on white chips), `--violet-ink #b3a8ff`, `--paper` equal to the background; keep `--violet` and `--flame`. Re-add `@custom-variant dark (&:is(.dark *))` and `color-scheme: dark` under `.dark`. Replace `text-violet` with `text-violet-ink` across `src` (also `hover:text-violet`), leaving `bg-violet`, `border-violet`, `ring-violet` and `accent-violet`. Add `themeScript()` to the root `head` as an inline script and `suppressHydrationWarning` on `<html>`. `ThemeToggle` is a 44px icon button (sun, moon, or monitor for the current choice) with `aria-label` "Theme: System. Switch to light." and a polite live announcement; add it to `SiteHeader` for every product.
- [ ] **Step 4:** `pnpm exec vitest run && pnpm exec tsc --noEmit && pnpm exec eslint src && pnpm build` pass. Dev server: every header has the toggle (`curl` `/`, `/vendors`, `/venues` contain `Theme:`); the server HTML for `/` contains the inline script and `<html` without the `dark` class; `grep -rn "text-violet\b" src --include='*.tsx'` finds none (`text-violet-ink` only).
- [ ] **Step 5:** commit `Add dark mode`.

### Task 3: Smooth scroll and scroll animations

**Files:** Create `src/lib/motion.ts`, `src/lib/motion.test.ts`, `src/components/motion/reveal.tsx`. Modify `src/styles.css` and the section components listed below.

**Interfaces:**
- Produces: `staggerDelay(index: number, stepMs?: number, maxMs?: number): number` (default step 60, cap 300, never negative); `prefersReducedMotion(match?: (q: string) => { matches: boolean }): boolean` (false when `matchMedia` is unavailable); `Reveal({ children, delayIndex?, className?, as? })` renders the children visible on the server and first paint; after mount, if the element is below the viewport and motion is allowed, it hides it and reveals it with a fade and 16px rise when it enters the viewport (`IntersectionObserver`, once); with reduced motion or no `IntersectionObserver` it does nothing.

- [ ] **Step 1: Failing tests** in `motion.test.ts`: `staggerDelay(0)` is 0; `staggerDelay(3)` is 180; `staggerDelay(20)` is 300; `staggerDelay(-2)` is 0; a custom step and cap are honoured; `prefersReducedMotion` returns true when the query matches, false when it does not, and false when no matcher exists (**no throw on the server**).
- [ ] **Step 2:** run; fails. **Step 3:** Implement. CSS: `html { scroll-behavior: smooth }` inside `@media (prefers-reduced-motion: no-preference)`; `scroll-margin-top: 1rem` on in-page targets (`#faqs`, `#alerts`); keep the existing reduced-motion override. Hero entrance uses CSS only (`animate-in fade-in slide-in-from-bottom-2 duration-700`) on the three hero components and page `h1`s of the landing pages. Wrap in `Reveal`: landing event rows, stats band, how it works, partner strip, blog cards, alerts, FAQ; vendors and venues scenarios or audiences, benefits, coming soon, how to start, FAQ, closing panel; card grids on callouts, vendor and venue directories and event lists (each `<li>` gets `delayIndex={i}`); event details About, Sponsors and Similar events; the legal page body.
- [ ] **Step 4:** `pnpm exec vitest run && pnpm exec tsc --noEmit && pnpm exec eslint src && pnpm build` pass. Dev server: server HTML for `/`, `/vendors`, `/venues` contains no `data-reveal="hidden"` (content is visible without JavaScript) and the section text is present.
- [ ] **Step 5:** commit `Add smooth scroll and scroll animations`.

### Task 4: Remembered checkout details

**Files:** Create `src/stores/contact.ts`, `src/features/checkout/prefill.ts`, `src/features/checkout/prefill.test.ts`, `src/components/checkout/remember-note.tsx`. Modify `src/routes/_attendee/events/$eventId/checkout.tsx`.

**Interfaces:**
- Consumes: `useConsent`, `createGatedStorage`, `STORAGE`, `ContactValue` (`phone`, `email`, `delivery`), `Cart`.
- Produces: `interface Remembered { phone: string; email: string; delivery: 'sms'|'email' }`; `useContact` (zustand, persisted through the gated storage under `event-os:contact`): `remembered: Remembered | null`, `remember(r: Remembered)`, `forget()`; `contactPrefill(cart: Cart | undefined, remembered: Remembered | null): ContactValue` (a cart with a phone or email wins and keeps its channel; otherwise remembered; otherwise empty with `delivery: 'sms'`; delivery follows the entered contact like today when nothing says otherwise).

- [ ] **Step 1: Failing tests** in `prefill.test.ts`: a cart with a phone returns the cart's values even when remembered differs (**Review Focus 4**); a cart with neither contact and remembered details returns the remembered ones; neither gives `{ phone:'', email:'', delivery:'sms' }`; a cart with only an email uses `delivery: 'email'`; remembered with a blank phone and an email gives the email channel. Contact-store tests with a memory `StateStorage` behind `createGatedStorage`: `remember` while consent is not accepted writes nothing to storage (**Review Focus 3**); after accepting it writes `event-os:contact`; `forget()` removes it; declining clears it (**Review Focus 2**).
- [ ] **Step 2:** run; fails. **Step 3:** Implement. In the checkout route, replace the existing prefill effect with `contactPrefill(cart, remembered)` once the cart and the store have loaded. When payment is pressed and validation passes, call `remember({ phone, email, delivery })` (it is a no-op unless consent was accepted). `RememberNote` shows: with Accept, "We'll remember your phone and email on this device." and a **Forget my details** button; without it, "Accept cookies and we'll remember your phone and email next time." with a **Cookie settings** button (opens `useConsent.openSettings`).
- [ ] **Step 3b:** The cart token is still written with no consent (`event-os:carts` is Necessary): confirm `startCheckout` is unchanged.
- [ ] **Step 4:** `pnpm exec vitest run && pnpm exec tsc --noEmit && pnpm exec eslint src && pnpm build` pass; dev server: `curl` the checkout route returns 200 with no render errors.
- [ ] **Step 5:** commit `Remember checkout details after consent`.

### Task 5: Legal pages

**Files:** Create `src/content/legal/{types,terms,privacy,cookies}.ts`, `src/lib/legal.ts`, `src/lib/legal.test.ts`, `src/components/legal/legal-page.tsx`, `src/routes/{terms,privacy,cookies}.tsx` (as `src/routes/_attendee/...`, so they get the site header and footer). Modify `.env.example`, `README.md`.

**Interfaces:**
- Produces: `type Audience = 'all'|'attendees'|'vendors'|'organizers'|'venues'`; `interface LegalSection { id: string; audience: Audience; heading: string; body: string[] }`; `interface LegalDoc { slug: 'terms'|'privacy'|'cookies'; title: string; intro: string; sections: LegalSection[] }`; `AUDIENCES` (the four audiences with labels); `filterSections(doc, audience | undefined): LegalSection[]` (an audience sees `all` plus its own; undefined sees everything); `placeholdersIn(doc): string[]` (every `[To confirm: ...]` found); `draftNoticeVisible(reviewed: string | undefined): boolean` (false only for `'true'`); `validateLegalSearch(raw): { for?: Audience }`.
- The Cookies document is generated from `STORAGE`: one row per key (name, kind, category, what it holds, when it is written, how long).

- [ ] **Step 1: Failing tests** in `legal.test.ts`: `filterSections` shows `all` plus the chosen audience, and everything when none; each document has sections for all four audiences; section ids are unique per document; `placeholdersIn` finds placeholders in every document (business decisions are not invented) (**Review Focus 6**); `draftNoticeVisible` is true for undefined, `''`, `'false'` and false only for `'true'`; no document text matches `/escrow|guarantee|payment protection|fully secure|100%/i` and none states a specific country or company; the Cookies document mentions every `STORAGE` key and says there is no tracking or advertising; the Privacy document mentions each data type the product collects (phone, email, order, support message, vendor or venue profile, KYC documents) and Paystack; the Terms document says vendor payouts for callout bookings are held until KYC clears and does not promise vendor payment protection.
- [ ] **Step 2:** run; fails. **Step 3:** Draft the content from the facts in the design (data collected, Paystack page for cards, ticket money held and released after the event with `[To confirm: holdback period]`, vendor payout hold until KYC, public ratings, held dates public without personal details). Business or legal decisions are `[To confirm: ...]` (company name, address, governing law and country, retention periods, refund and cancellation rules, minimum age, privacy contact). `LegalPage` shows the title, the draft notice (when `draftNoticeVisible(import.meta.env.VITE_LEGAL_REVIEWED)`), audience filter chips (All, Attendees, Vendors, Event organizers, Venue owners) driven by `?for=`, a contents list, the sections inside `Reveal`, and links to the other two documents. Routes set a unique title and description. Add `VITE_LEGAL_REVIEWED` to `.env.example` and the README configuration table.
- [ ] **Step 4:** `pnpm exec vitest run && pnpm exec tsc --noEmit && pnpm exec eslint src && pnpm build` pass. Dev server: `/terms`, `/privacy`, `/cookies` return 200 with unique titles and the draft notice; `?for=vendors` shows the vendors sections and not the attendees ones; `?for=junk` is 200; `grep -ci escrow` of each page is 0.
- [ ] **Step 5:** commit `Add terms, privacy and cookies pages`.

### Task 6: Footer

**Files:** Create `src/config/footer.ts`, `src/config/footer.test.ts`. Rewrite `src/components/layout/site-footer.tsx`.

**Interfaces:**
- Produces: `FOOTER_COLUMNS: { heading: string; links: ({ label: string; to: string } | { label: string; portal: '/login' | '/register' })[] }[]` for Explore, Vendors, Venues, Organizers, Help and Legal; `LEGAL_LINKS` is the Legal column.

- [ ] **Step 1: Failing tests** in `footer.test.ts`: no duplicate internal `to`; the Legal column links `/terms`, `/privacy` and `/cookies`; the Organizers column has Create an event (portal `/register`) and Organizer sign in (portal `/login`); every internal `to` is one of the real routes (`/events`, `/blog`, `/tickets/help`, `/contact`, `/vendors`, `/vendors/callouts`, `/vendors/directory`, `/venues`, `/venues/directory`, `/terms`, `/privacy`, `/cookies`, `/`); no external social URLs.
- [ ] **Step 2:** run; fails. **Step 3:** Implement. The footer renders the columns (responsive grid), the brand blurb, a **Cookie settings** button (opens `useConsent.openSettings`), a **Back to top** link (`#top`, with `id="top"` on the page wrapper) and the year. FAQs link to `/#faqs`.
- [ ] **Step 4:** `pnpm exec vitest run && pnpm exec tsc --noEmit && pnpm exec eslint src && pnpm build` pass. Dev server: the footer on `/`, `/vendors`, `/venues` contains `/terms`, `/privacy`, `/cookies`, `Cookie settings`, `Create an event` and a `localhost:5173` portal link.
- [ ] **Step 5:** commit `Expand the footer`.

### Task 7: Whole-site verification and notes

**Files:** Modify `README.md`.

- [ ] **Step 1:** README: a "Cookies and storage" section (the registry table, Preferences gating, how to change `CONSENT_VERSION`), a "Dark mode" line, and the legal drafts (`VITE_LEGAL_REVIEWED`).
- [ ] **Step 2:** `pnpm exec vitest run && pnpm exec tsc --noEmit && pnpm exec eslint src && pnpm build` pass.
- [ ] **Step 3:** With the real gateway and with `VITE_API_URL=http://localhost:9`, `curl` `/`, `/events`, `/vendors`, `/venues`, `/terms`, `/privacy`, `/cookies` and the checkout route: 200 with unique titles and no render errors in the dev log.
- [ ] **Step 4:** Production check: `pnpm build && pnpm preview --port 3000`; the same routes answer 200; the server HTML contains the theme script and no consent banner; mocks stay out of the client entry chunk as before.
- [ ] **Step 5:** Self-review: no Preferences key is written before Accept (the registry test and gated storage tests), no raw HTML sinks in the new code, the legal text has no promise the vendors and venues pages mark "Coming soon". Record what was not verified (the banner, theme toggle, animations and focus order in a real browser; a 390px pass), and commit `Add notes for consent, theme and legal pages`.
