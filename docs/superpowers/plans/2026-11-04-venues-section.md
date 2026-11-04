# Venues Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the venues section of the website: a landing page for venue owners and organizers, a venue directory, and a venue page with held dates, handing sign-up and sign-in to the portal.

**Architecture:** Three TanStack Start routes under `/venues`, backed by `src/features/venues` (types, pure logic, normalisers, queries, dev-only mocks) and `src/components/venues`. It follows the vendors section's patterns: URL-state validators validated again in the component, loaders that never fail the page, mocks loaded by dynamic import, a copy test as the honesty guard.

**Tech Stack:** TanStack Start/Router/Query, React 19, Tailwind v4, shadcn, vitest, pnpm.

**Spec:** `docs/superpowers/specs/2026-11-04-venues-section-design.md`. Backend asks: `event-os-backend/docs/specs/website-landing-api.md`.

## Global Constraints

- **Honesty rule:** promise only what exists today: a public profile once a venue is reviewed and active; date-range bookings on a calendar guarded against double-booking; held dates shown as date ranges only; a contract and a draft invoice per accepted booking (the organizer's confirmation completes it); one rating per completed booking; utilization analytics for the owner. Payment or deposit protection, add-on rentals and request-for-proposal tools appear only as "Coming soon".
- No page tells anyone they can claim a listing (the `venue_claims` flag is off by default). The only owner call to action is "List your venue".
- The word "escrow" and any fee, pricing, commission or "free to list" copy appear nowhere in the section.
- Portal links use `portalUrl()`: List your venue is `/register`, Sign in is `/login`. The base is `VITE_PORTAL_URL`, falling back to `VITE_VENDOR_PORTAL_URL`, then `http://localhost:5173`. No sessions, no booking form on the website.
- Same visual language and components as the rest of the site (ink, paper, violet, flame, line, mist; Bricolage Grotesque and Figtree). Mobile first at 390px, targets at least 44px, visible keyboard focus, labelled controls, reduced motion respected.
- Errors say what went wrong and what to do; empty states invite an action; sentence case; one name per action ("List your venue", "Sign in to request a booking").
- Invented data only behind `MOCKS_ENABLED`, loaded by dynamic `import('./mocks')` inside `if (MOCKS_ENABLED)` blocks, never imported statically. Real API values always win. Every invented field goes in the backend request doc.
- External links go through `safeHttpUrl`. Venue ids are UUIDs: a malformed id answers a real 404 without calling the API. A claimed-flag of `false` is omitted by the API (protojson), so a missing `claimed` means unclaimed.
- Every page works with the API slow or down (200 with a clear message) and sets its own `<title>` and description.
- Commit directly to `main`, one commit per task, no Claude attribution trailer.

Routes: `/venues`, `/venues/directory`, `/venues/$venueId`. Static routes win over `$venueId`.

## Review Focus

Inputs the spec implies but its tests would not otherwise exercise; each is pinned in the named task.

1. `claimed` missing (protojson omits false), and capacity missing or zero: treated as unclaimed and "capacity not listed", never a crash or a filter that hides everything (Task 1).
2. A held block with `toAt` at or before `fromAt`, a block already past, or `blocks` missing: dropped or empty, never a bad date range (Task 1).
3. The availability call answering 409 for an unclaimed or inactive venue: shown as "not claimed yet", not as an error (Task 2).
4. An empty directory (`{"venues":[],"total":0}`) and a venue id that is malformed or unknown: honest empty state and a real 404 (Tasks 4, 5).
5. Copy honesty and the unclaimed-listing rule: no banned words, no promise of claiming, no missing feature outside "Coming soon" (Task 6).

## Execution notes (lessons from the earlier sections)

- zsh does not split unquoted variables: loop over an array.
- After `pnpm exec eslint --fix src`, confirm the exit code with `pnpm exec eslint src`.
- The router passes raw junk from the URL through `useSearch()`: validate again in the component. A single number in a URL arrives as a number.
- protojson sends int64 as strings and omits zero, false and empty values.
- Never stop the user's API gateway or their other vite processes: start your own dev server, wait with a curl loop, kill only the listener on `:3000`. A production build is checked with `pnpm build && pnpm preview --port 3000`.
- A mock imported statically stays in the client entry chunk even when nothing calls it; use dynamic imports.
- Read a file with the Read tool before editing a file you created through the shell.

## File structure

- `src/features/venues/`: `types.ts`, `venues.ts`, `normalise.ts`, `search.ts`, `ids.ts`, `queries.ts`, `mocks.ts` (+ tests). Modify `src/features/vendors/portal.ts`.
- `src/content/`: `venue-landing.ts`, `venue-faqs.ts`.
- `src/components/venues/`: card, filters, chips, held dates, landing sections. Make the vendors `ComingSoon`, `HowToStart` and `ClosingCta` take optional props.
- `src/routes/venues/`: `route.tsx` (exists), `index.tsx`, `directory.tsx`, `$venueId.tsx`; modify `src/config/products.ts`.

---

### Task 1: Venues logic

**Files:** Create `src/features/venues/{types,venues,normalise,search,ids}.ts`, `venues.test.ts`. Modify `src/features/vendors/portal.ts`.

**Interfaces:**
- Produces:
  - `interface VenueEntry { id: string; name: string; city?: string; country?: string; capacity?: number; claimed: boolean; category?: string; imageUrl?: string }` (last two proposed); `interface VenueProfile { id: string; name: string; address?: string; city?: string; country?: string; capacity?: number; category?: string; description?: string; amenities: string[]; rating?: number; ratingCount?: number; claimed: boolean; websiteUrl?: string; socialLinks: Record<string,string> }`; `interface HeldBlock { id: string; fromAt: number; toAt: number }` (unix seconds); `interface VenueList { venues: VenueEntry[]; hasMore: boolean }`.
  - `normaliseVenueEntry(raw)`, `normaliseVenueList(raw, limit): VenueList`, `normaliseVenueProfile(raw): VenueProfile`, `normaliseBlocks(raw): HeldBlock[]` (int64 strings to numbers; `claimed` defaults to `false`; capacity zero or missing becomes `undefined`; rating only when above zero).
  - `CAPACITY_STEPS: { min: 100 | 300 | 1000; label: string }[]` (labels "100+", "300+", "1000+"); `filterVenues(v: VenueEntry[], f: { city?: string; country?: string; minCapacity?: number; bookableOnly?: boolean }): VenueEntry[]` (a venue with no capacity never passes a minimum); `sortVenues(v): VenueEntry[]` (claimed first, then name, case-insensitive; does not mutate); `venueCities(v): string[]` and `venueCountries(v): string[]` (distinct, sorted).
  - `upcomingBlocks(blocks: HeldBlock[], nowSec: number, days?: number): HeldBlock[]` (default 90; drops blocks with `toAt <= fromAt` and blocks already over; keeps those overlapping the window; sorted by `fromAt`); `formatHeldRange(fromAt: number, toAt: number): string` (UTC; the range is read as ending the second before `toAt`; same day gives "12 Dec 2026", same month "12 to 14 Dec 2026", else "30 Nov to 2 Dec 2026").
  - `safeSocialLinks(links: Record<string,string>): { platform: string; url: string }[]` (http(s) only, sorted by platform).
  - `interface VenuesSearch { city?: string; country?: string; minCapacity?: 100 | 300 | 1000; bookable?: true; page?: number }`; `validateVenuesSearch(raw: Record<string, unknown>): VenuesSearch`; `isVenueId(id: string): boolean` (reuses `isEventId`).
  - `portalUrl` default base: `import.meta.env.VITE_PORTAL_URL ?? import.meta.env.VITE_VENDOR_PORTAL_URL ?? 'http://localhost:5173'`.

- [ ] **Step 1: Failing tests** in `venues.test.ts`:
  - Normalisers: `normaliseVenueEntry({id:'v',name:'Hall',capacity:'250'})` is `{claimed:false, capacity:250, ...}`; a missing or `'0'` capacity gives `undefined` (**pins Review Focus 1**); `normaliseVenueList({venues:[],total:0}, 12)` and `normaliseVenueList({}, 12)` are both an empty, no-more list; `hasMore` follows `total`, else a full page; `normaliseVenueProfile` reads `socialLinks` and `amenities`, defaults them to `{}` and `[]`, and drops a rating of zero; `normaliseBlocks({})` is `[]` and `{blocks:[{id:'b',fromAt:'100',toAt:'200'}]}` converts strings.
  - `filterVenues` by city, country, `minCapacity` (no capacity never passes) and `bookableOnly`; `sortVenues` puts claimed first then by name and leaves the input untouched.
  - `upcomingBlocks`: drops `toAt` equal to or below `fromAt`, drops blocks that ended before now, keeps a block that started before now and ends after it, drops blocks starting after the window, sorts by start (**pins Review Focus 2**). `formatHeldRange` for one day, one month and across months, and a `toAt` at exactly midnight reads as the day before.
  - `safeSocialLinks` drops `javascript:` and relative links and sorts by platform.
  - `validateVenuesSearch`: trims text, keeps only `minCapacity` of 100, 300 or 1000 (also from a string), keeps `bookable` only for `true` or `'true'`, page above 1, drops junk; `isVenueId` accepts a UUID and rejects `does-not-exist`.
- [ ] **Step 2:** `pnpm exec vitest run src/features/venues` fails (modules missing).
- [ ] **Step 3:** Implement the signatures above. Update `portal.ts` to the base chain above.
- [ ] **Step 4:** `pnpm exec vitest run && pnpm exec tsc --noEmit && pnpm exec eslint src` pass (Expected: all green).
- [ ] **Step 5:** commit `Add venues logic`.

### Task 2: Venues data layer and dev mocks

**Files:** Create `src/features/venues/{queries,mocks}.ts`, `mocks.test.ts`.

**Interfaces:**
- Consumes: Task 1; `apiGet`, `ApiError`, `MOCKS_ENABLED`, `hash`.
- Produces: `mockVenues(): VenueEntry[]` (six: mixed claimed and unclaimed, capacities from 60 to 1500, in Accra, Lagos and Kumasi, UUID-shaped ids that pass `isVenueId`); `mockVenueProfile(id): VenueProfile | null`; `mockHeldBlocks(id, nowSec?): HeldBlock[]` (two or three blocks for a claimed mock venue, none for an unclaimed one). `venueDirectoryQuery(p: { country?: string; page: number })` (`GET /api/v1/venues?limit=12*page&offset=0[&country=]`, returns `VenueList`; in dev, with fewer than six real venues it appends matching invented ones); `venueQuery(id)` (`GET /api/v1/venues/{id}`, 404 stays an `ApiError`; in dev an invented id returns its mock profile); `interface VenueAvailability { open: boolean; blocks: HeldBlock[] }` and `venueAvailabilityQuery(id: string, nowSec: number)` (`GET /api/v1/venues/{id}/availability?fromAt=&toAt=` over 120 days; a 409 returns `{ open: false, blocks: [] }`; a 200 returns `{ open: true, blocks }`).

- [ ] **Step 1: Failing tests** in `mocks.test.ts`: `mockVenues()` has six venues, stable ids that pass `isVenueId`, at least one claimed and one unclaimed; `mockVenueProfile` returns a profile (amenities, `claimed` matching the list) for a mock id and `null` for any other; `mockHeldBlocks` for a claimed id returns blocks that survive `upcomingBlocks` and for an unclaimed id returns `[]`.
- [ ] **Step 2:** run; fails. **Step 3:** implement the files; mock modules are reached only through `await import('./mocks')` inside `if (MOCKS_ENABLED)` blocks. A 409 is caught in `venueAvailabilityQuery` by checking `err instanceof ApiError && err.status === 409` (**pins Review Focus 3**; add a unit-testable `availabilityFromError(err)` helper and test it: 409 gives `{open:false,blocks:[]}`, any other error rethrows).
- [ ] **Step 4:** `pnpm exec vitest run && pnpm exec tsc --noEmit && pnpm exec eslint src && pnpm build` pass.
- [ ] **Step 5:** commit `Add venues data layer and dev mocks`.

### Task 3: Venues header and nav

**Files:** Modify `src/config/products.ts`, `.env.example`, `README.md`.

**Interfaces:** Consumes `HeaderAction` and `SiteHeader` (already render `actions` through `portalUrl`). Produces the venues nav entry `Directory` (`/venues/directory`) and actions `Sign in` (`/login`, secondary) and `List your venue` (`/register`, primary).

- [ ] **Step 1:** Add the venues `nav` and `actions`. In `.env.example` and the README configuration table, add `VITE_PORTAL_URL` and describe `VITE_VENDOR_PORTAL_URL` as the older name that still works.
- [ ] **Step 2:** Verify: typecheck, lint, build; dev server: `curl localhost:3000/venues` contains `href="http://localhost:5173/register"`, `href="http://localhost:5173/login"` and `href="/venues/directory"`; the vendors header (`/vendors`) still shows "Create profile" and not "List your venue"; the attendee header shows neither.
- [ ] **Step 3:** commit `Add venue header actions`.

### Task 4: Directory page

**Files:** Create `src/components/venues/{venue-card,venue-filters,bookable-chip}.tsx`, `src/routes/venues/directory.tsx`.

**Interfaces:** Consumes Tasks 1 and 2 (`venueDirectoryQuery`, `filterVenues`, `sortVenues`, `venueCities`, `venueCountries`, `CAPACITY_STEPS`, `validateVenuesSearch`), `portalUrl`.

- [ ] **Step 1:** `BookableChip({ claimed })` reads "Bookable" or "Listing only". `VenueCard` links to `/venues/$venueId` and shows name, city and country, capacity ("Up to 250 guests", or "Capacity not listed"), the chip and a gradient header (an `imageUrl`, if the API ever returns one, goes through `safeHttpUrl`). `VenueFilters` has a city menu, a country menu, a minimum-capacity menu (Any, 100+, 300+, 1000+), a "Bookable only" toggle with `aria-pressed`, and Clear filters; menus appear only when there is more than one choice.
- [ ] **Step 2:** Route: `validateSearch` plus validating again in the component; loader warms `venueDirectoryQuery`; filters in the URL; the choices come from the unfiltered first page; the list is `sortVenues(filterVenues(...))`; load more; empty states: none listed ("No venues listed yet. List yours and be one of the first." with **List your venue**) and none match ("No venues match. Clear filters"); API failure shows Try again; head title "Venue directory | Event OS for Venues".
- [ ] **Step 3:** Verify: typecheck, lint, build, tests; dev server: `/venues/directory` is 200 with six invented venues, bookable ones first; `?bookable=true` shows only bookable; `?minCapacity=1000` and `?city=Nowhere` show the none-match message; `?minCapacity=abc&page=-2` is 200; with `VITE_API_URL=http://localhost:9` it is 200 with a clear message. Production build (`pnpm build && pnpm preview --port 3000`) against the real API shows the honest empty state with a working List your venue link and no invented venues (**pins Review Focus 4**).
- [ ] **Step 4:** commit `Build venue directory page`.

### Task 5: Venue page

**Files:** Create `src/components/venues/held-dates.tsx`, `src/routes/venues/$venueId.tsx`.

**Interfaces:** Consumes `venueQuery`, `venueAvailabilityQuery`, `upcomingBlocks`, `formatHeldRange`, `safeSocialLinks`, `safeHttpUrl`, `isVenueId`, `BookableChip`, `portalUrl`.

- [ ] **Step 1:** Loader: `if (!isVenueId(params.venueId)) throw notFound()`; warm `venueQuery`; an `ApiError` 404 throws `notFound()`; any other error returns `null` and the page shows Try again (**pins Review Focus 4**). `notFoundComponent` says "We can't find that venue" with a link to the directory. Head title is the venue name with its description or "category in city".
- [ ] **Step 2:** Page: name, `BookableChip`, category and city, capacity, rating ("4.6 (12 ratings)" only when there are ratings), description (text), amenities as chips, website and social links (only through `safeHttpUrl` and `safeSocialLinks`), then `HeldDates` and a **Sign in to request a booking** panel linking to `portalUrl('/login')`. `HeldDates({ availability })` shows each held range from `upcomingBlocks(blocks, nowSec)` with `formatHeldRange`, or "No held dates in the next 90 days"; when `open` is false it says "This listing hasn't been claimed yet, so availability and booking aren't open." and the booking panel says the same instead of a button. For an unclaimed venue the availability call is skipped.
- [ ] **Step 3:** Verify: typecheck, lint, build; dev server: an invented claimed venue id (taken from the directory page) returns 200 with held dates; an unclaimed one returns 200 with the not-claimed message and no booking button; `/venues/does-not-exist` and `/venues/00000000-0000-0000-0000-000000000000` return 404 with "We can't find that venue"; `/venues/directory` still returns 200.
- [ ] **Step 4:** commit `Build venue page`.

### Task 6: Landing page

**Files:** Create `src/content/{venue-landing,venue-faqs}.ts`, `src/content/venue-copy.test.ts`, `src/components/venues/{venue-hero,venue-strip,audiences,venue-benefits}.tsx`. Modify `src/components/vendors/{coming-soon,how-to-start,closing-cta}.tsx` (optional props, vendor defaults unchanged), `src/routes/venues/index.tsx`.

**Interfaces:**
- Produces in `venue-landing.ts`: `HERO`, `AUDIENCES` (ids `owner`, `organizer`; each has `who`, `situation`, `today`), `BENEFITS` (ids `profile`, `calendar`, `contract`, `insights`), `COMING_SOON` (ids `protection`, `addons`, `rfp`), `HOW_TO_START` (three steps); `VENUE_FAQS: Faq[]`. `ComingSoon({ items? })`, `HowToStart({ steps? })`, `ClosingCta({ heading?, body?, label?, path? })` default to the vendor content.

- [ ] **Step 1: Failing test** `venue-copy.test.ts` (same shape as `vendor-copy.test.ts`): walks every string in `HERO`, `AUDIENCES`, `BENEFITS`, `COMING_SOON`, `HOW_TO_START`, `VENUE_FAQS` and asserts none matches `/escrow|guarantee|commission|\bfees?\b|\bpricing\b|free to list|free to join|protected deposit|instant(ly)? book|claim your/i`; `BENEFITS` ids are exactly `profile, calendar, contract, insights`; `COMING_SOON` ids are exactly `protection, addons, rfp`; the "today" copy (benefits, audience situations and `today`, how-to-start) never matches `/protection|add-on|request-for-proposal/i`; there are two audiences, `owner` then `organizer`; the "Do I pay a deposit?"-style question is absent (no payment promises): the FAQ answer to "Can organizers book my venue?" says requests are accepted or declined by the owner (**pins Review Focus 5**).
- [ ] **Step 2:** run; fails. **Step 3:** implement the content and the optional props (vendor pages must render unchanged: `curl localhost:3000/vendors` still contains "Coming soon" and "Create your profile").
- [ ] **Step 4:** Landing sections in order: hero ("Get your venue seen, and every booking in one place", buttons **List your venue** and **Browse venues**), `VenueStrip` ("Listed now" with up to three `VenueCard`s from `venueDirectoryQuery({ page: 1 })` sorted bookable first, or the honest empty state), audiences, what you get today, a dashed "Coming soon" box, how to start (numbered), FAQ (`FaqSection faqs={VENUE_FAQS}`), closing **List your venue** panel. Loader warms the directory query; head title and description plus FAQ JSON-LD.
- [ ] **Step 5:** Verify: typecheck, lint, build, tests; dev server: `/venues` is 200 and contains "Coming soon", "List your venue", "Listed now"; `grep -ci escrow` is 0; `/vendors` and `/` unchanged.
- [ ] **Step 6:** commit `Build venues landing page`.

### Task 7: Backend request, README and whole-section verification

**Files:** Modify `event-os-backend/docs/specs/website-landing-api.md` (backend repo, edit only), `README.md`.

- [ ] **Step 1:** Add "10. Venues section" to the backend request doc: directory entries need `category`, a short description and a photo URL (today `id`, `name`, `city`, `country`, `capacity`, `claimed`); the profile needs photos and coordinates; server-side city and capacity filters; the list has no venues in the real data (seeding is a data job); `claimed: false` is omitted by the API; the portal's missing booking-request screen (portal work). Do not commit the backend repo; report the edit.
- [ ] **Step 2:** README: add the venues routes to Structure and a line that `VITE_PORTAL_URL` serves vendors and venues.
- [ ] **Step 3:** `pnpm exec vitest run && pnpm exec tsc --noEmit && pnpm exec eslint src && pnpm build` pass.
- [ ] **Step 4:** With the real gateway and then `VITE_API_URL=http://localhost:9`, `curl` `/venues`, `/venues/directory`, an invented venue page (dev) and `/venues/does-not-exist`: 200, 200, 200 and 404 with unique titles and no render errors in the dev log.
- [ ] **Step 5:** Production check: `rm -rf dist && pnpm build`, then none of the invented venue names or `mock-venue` strings appear in a chunk referenced by the client entry (an unreferenced `mocks-*.js` file is reported); a build with `VITE_ENABLE_MOCKS=true` contains them; a served production build shows only honest empty states.
- [ ] **Step 6:** Self-review the section for untrusted data (venue description, amenities and names render as text; website and social links go through `safeHttpUrl`), record what was not verified (the 390px browser pass, the portal's booking-request screen), and commit `Add venues section verification and notes`.
