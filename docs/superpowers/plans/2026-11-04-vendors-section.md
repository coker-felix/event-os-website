# Vendors Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the vendors section of the website: landing page, open callouts, vendor directory and public vendor page, with sign-up and sign-in handed to the existing vendor portal.

**Architecture:** Four TanStack Start routes under `/vendors`, backed by `src/features/vendors` (types, pure logic, queries, dev-only mocks) and `src/components/vendors`. Callouts only carry `eventId`, so a hook joins them to events from the existing events query. Pure logic gets vitest tests; pages are checked by typecheck, lint, build and server-rendered output.

**Tech Stack:** TanStack Start/Router/Query, React 19, Tailwind v4, shadcn, vitest, pnpm.

**Spec:** `docs/superpowers/specs/2026-11-04-vendors-section-design.md`. Backend asks: `event-os-backend/docs/specs/website-landing-api.md`.

## Global Constraints

- **Honesty rule:** promise only what exists today: open callouts, apply and be selected before KYC (payout held until KYC clears), one calendar that blocks accepted dates, a contract and draft invoice per accepted booking, one rating per completed booking, verified and partnered tiers set by an admin, a public directory and vendor page. Payment protection, headcount lock, request-for-proposal tools and venue add-on bundles appear only as "Coming soon".
- The word "escrow" appears on no vendors page. No fee, commission, pricing or "free to join" copy anywhere in the section.
- Sign-up and sign-in go to the vendor portal via `portalUrl()`: Create profile is `/register`, Sign in is `/login`, base from `VITE_VENDOR_PORTAL_URL` (default `http://localhost:5173`). No vendor sessions on the website; no applying to a callout on the website.
- Same visual language and components as the rest of the site (ink, paper, violet, flame, line, mist; Bricolage Grotesque and Figtree; ticket-stub cards). Mobile first at 390px, targets at least 44px, visible keyboard focus, labelled controls, reduced motion respected.
- Errors say what went wrong and what to do; empty states invite an action; sentence case; one name per action ("Create your profile", "Sign in to apply").
- Invented data only behind `MOCKS_ENABLED` and only imported inside a statement-level `if (MOCKS_ENABLED)` (a dynamic import did not remove the chunk in the last build). Real API values always win. Every invented field goes in the backend request doc.
- External links go through `safeHttpUrl`; paths through the router. Event and vendor ids are UUIDs: malformed ids answer a real 404 without calling the API.
- Every page works with the API slow or down (200 with a clear message), and sets its own `<title>` and description.
- Commit directly to `main`, one commit per task, no Claude attribution trailer.

Routes: `/vendors`, `/vendors/callouts`, `/vendors/directory`, `/vendors/$vendorId`. Static routes win over `$vendorId`.

## Review Focus

Inputs the spec implies but its tests would not otherwise exercise; each is pinned in the named task.

1. A callout whose event is not in the events list (or the events call failed): still renders as "Open callout · {category}" with its service kinds, no crash (Task 1).
2. `closesAt` missing, zero (protojson omits zero values) or in the past: no label or "Closed", never "Closes in -3 days" or NaN (Task 1).
3. The real API returns `{}` for no callouts and a one-vendor list: honest empty states, never an error (Tasks 2, 4, 6).
4. A malformed or unknown vendor id: real 404 (Task 7).
5. Copy honesty: no banned words and no promised-but-missing feature outside "Coming soon" (Task 5).

## Execution notes (lessons from the attendee pages)

- zsh does not split unquoted variables: loop over an array.
- After `pnpm exec eslint --fix src`, confirm the exit code with `pnpm exec eslint src`.
- The router passes raw junk from the URL through `useSearch()`: validate again in the component. A single number in a URL arrives as a number.
- protojson sends int64 as strings and omits zero and empty values (`{}` for no results).
- Never stop the user's API gateway or their other vite processes: start your own dev server, wait for it with a curl loop, and kill only the listener on `:3000`.
- Read a file with the Read tool before editing a file you created through the shell.

## File structure

- `src/features/vendors/`: `types.ts`, `callouts.ts`, `portal.ts`, `ids.ts`, `queries.ts`, `normalise.ts`, `mocks.ts`, `use-callout-cards.ts`, `search.ts` (+ tests).
- `src/content/`: `vendor-landing.ts`, `vendor-faqs.ts`.
- `src/components/vendors/`: callout card, filters, landing sections, vendor card, tier badge.
- `src/routes/vendors/`: `index.tsx`, `callouts.tsx`, `directory.tsx`, `$vendorId.tsx`; modify `src/config/products.ts`, `src/components/layout/site-header.tsx`.

---

### Task 1: Vendors logic (callouts, portal links, ids)

**Files:** Create `src/features/vendors/{types,callouts,portal,ids}.ts`, `callouts.test.ts`.

**Interfaces:**
- Produces:
  - `type VendorTier = 'normal' | 'verified' | 'partnered'`.
  - `interface Callout { id: string; eventId: string; category: string; serviceKinds: string[]; opensAt?: number; closesAt?: number }` (unix seconds).
  - `interface CalloutCard { callout: Callout; event?: PublicEvent }`.
  - `joinCalloutsWithEvents(callouts: Callout[], events: PublicEvent[]): CalloutCard[]`; `closesInLabel(closesAt: number | undefined, nowSec: number): string | null`; `serviceKindLabel(kind: string): string`; `calloutCategories(cards: CalloutCard[]): string[]`; `filterCallouts(cards: CalloutCard[], f: { category?: string; city?: string }): CalloutCard[]`; `calloutTitle(card: CalloutCard): string`.
  - `portalUrl(path: string, base?: string): string`; `isVendorId(id: string): boolean`.

- [ ] **Step 1: Failing tests** in `callouts.test.ts`:
  - `joinCalloutsWithEvents` attaches the matching event and leaves `event` undefined for an unknown `eventId` or an empty events list (**pins Review Focus 1**); `calloutTitle` is the event title, else `"Open callout · {category}"`.
  - `closesInLabel`: `undefined` and `0` give `null`; a past time gives `"Closed"`; under 24 hours gives `"Closes today"`; 36 hours gives `"Closes in 1 day"`; 3.5 days gives `"Closes in 3 days"`; never a negative number or `NaN` (**pins Review Focus 2**).
  - `serviceKindLabel('check_in_assistance')` is `"Check in assistance"`; `serviceKindLabel('')` is `""`.
  - `calloutCategories` lists each category once in first-seen order; `filterCallouts` filters by category and by `event.city`, and a card with no event never matches a city filter.
  - `portalUrl('/register', 'http://localhost:5173/')` is `http://localhost:5173/register`; `portalUrl('login', 'https://portal.example.com')` is `https://portal.example.com/login`.
  - `isVendorId` accepts a UUID in either case and rejects `does-not-exist`, `''` and a UUID with a suffix.
- [ ] **Step 2:** `pnpm exec vitest run src/features/vendors` fails (modules missing).
- [ ] **Step 3:** Implement the signatures above. `portalUrl` default base is `import.meta.env.VITE_VENDOR_PORTAL_URL ?? 'http://localhost:5173'`. `isVendorId` uses the same UUID rule as `src/features/events/ids.ts` (import and reuse it rather than copying the regex).
- [ ] **Step 4:** `pnpm exec vitest run && pnpm exec tsc --noEmit && pnpm exec eslint src` pass (Expected: all green).
- [ ] **Step 5:** commit `Add vendors logic for callouts, portal links and ids`.

### Task 2: Vendors data layer and dev mocks

**Files:** Create `src/features/vendors/{normalise,queries,mocks,use-callout-cards}.ts`, `normalise.test.ts`, `mocks.test.ts`. Modify `src/features/vendors/types.ts`.

**Interfaces:**
- Consumes: Task 1 types; `eventsQuery` and `categoriesQuery` (`src/features/events/queries.ts`); `apiGet`; `MOCKS_ENABLED`, `hash`.
- Produces:
  - `interface VendorEntry { id: string; businessName: string; tier: VendorTier; category?: string; city?: string; summary?: string; imageUrl?: string }` (last four proposed, not yet returned).
  - `interface VendorService { kind?: string; name: string; priceMinor?: number; currency?: string }`; `interface VendorProfile { id: string; businessName: string; description?: string; category?: string; city?: string; country?: string; tier: VendorTier; services: VendorService[] }`.
  - `normaliseCallout(raw: Record<string, unknown>): Callout` (int64 strings to numbers, missing `serviceKinds` to `[]`); `normaliseVendorEntry(raw): VendorEntry`; `normaliseVendorProfile(raw): VendorProfile` (unknown tier becomes `'normal'`; `priceMinor` string to number).
  - `calloutsQuery(p: { category?: string; page: number })` (`GET /api/v1/vendor-callouts?limit=12*page&offset=0[&category=]`, returns `{ callouts: Callout[]; hasMore: boolean }`); `vendorDirectoryQuery(p: { category?: string; city?: string; page: number })` (`GET /api/v1/vendors?limit=...&category=&locality=`, returns `{ vendors: VendorEntry[]; hasMore: boolean }`); `vendorQuery(id: string)` (`GET /api/v1/vendors/{id}`).
  - `mockCallouts(eventIds: string[], nowSec?: number): Callout[]` (six callouts across catering, sound, staging, decor; `eventId` cycles through `eventIds`, or `mock-event-N` when empty); `mockVendors(): VendorEntry[]` (six, with category, city, summary, and UUID-shaped ids that pass `isVendorId`); `mockVendorProfile(id: string): VendorProfile | null`.
  - `useCalloutCards(p: { category?: string; page: number }): { cards: CalloutCard[]; isPending: boolean; isError: boolean; hasMore: boolean; refetch: () => void }` joins `calloutsQuery` with `eventsQuery`; in dev (`if (MOCKS_ENABLED)`), when the real list is empty it uses `mockCallouts(events ids)`.

- [ ] **Step 1: Probe the real API** (read-only): `curl localhost:8080/api/v1/vendors/<id>` for the id returned by `GET /api/v1/vendors?limit=1`, and `.../services`. Note whether the store page includes `services` or they need merging from `/services`; implement `vendorQuery` to return both in one `VendorProfile`.
- [ ] **Step 2: Failing tests:** `normaliseCallout({ id:'c1', eventId:'e1', category:'catering', closesAt:'1800000000' })` gives numbers and `serviceKinds: []`; `normaliseVendorEntry` keeps `tier` from `normal | verified | partnered` and maps anything else to `normal`; `normaliseVendorProfile` converts `priceMinor` strings and tolerates no `services`; an empty response (`{}`) normalises to empty lists (**pins Review Focus 3**). `mockCallouts(['e1','e2'])` returns six callouts whose `eventId`s come from the list and cycle; `mockCallouts([])` uses `mock-event-N`; `mockVendors()` ids all pass `isVendorId`; `mockVendorProfile` returns a profile for a mock id and `null` otherwise.
- [ ] **Step 3:** run; fails. **Step 4:** implement the files. Mock modules are imported only inside `if (MOCKS_ENABLED)` blocks.
- [ ] **Step 5:** `pnpm exec vitest run && pnpm exec tsc --noEmit && pnpm exec eslint src && pnpm build`; then `grep -rl "mock-event" dist | wc -l` is `0` (Expected: 0).
- [ ] **Step 6:** commit `Add vendors data layer and dev mocks`.

### Task 3: Vendors header, nav and portal links

**Files:** Modify `src/config/products.ts`, `src/components/layout/site-header.tsx`, `.env.example`, `README.md`.

**Interfaces:** Consumes `portalUrl`. Produces `Product.actions?: Array<{ label: string; path: string; variant: 'primary' | 'secondary' }>` (vendors only: `Sign in` to `/login`, `Create profile` to `/register`); vendors `nav` becomes Callouts (`/vendors/callouts`) and Directory (`/vendors/directory`).

- [ ] **Step 1:** Add `actions` to the `Product` type and the vendors entry; render them in `SiteHeader` as external links built with `portalUrl(path)` (secondary is a text link, primary a violet pill, both at least 44px tall, wrapping below the logo on a phone).
- [ ] **Step 2:** Add `VITE_VENDOR_PORTAL_URL=http://localhost:5173` to `.env.example` with a one-line comment; add it to the README configuration table.
- [ ] **Step 3:** Verify: typecheck, lint, build; start the dev server and `curl localhost:3000/vendors` contains `href="http://localhost:5173/register"` and `href="http://localhost:5173/login"` and the nav link `/vendors/directory`; the attendee header (`curl localhost:3000/`) contains neither.
- [ ] **Step 4:** commit `Add vendor header actions and portal links`.

### Task 4: Callouts page

**Files:** Create `src/features/vendors/search.ts`, `search.test.ts`, `src/components/vendors/{callout-card,callout-filters}.tsx`. Modify `src/routes/vendors/callouts.tsx`.

**Interfaces:**
- Consumes: `useCalloutCards`, `filterCallouts`, `calloutCategories`, `closesInLabel`, `serviceKindLabel`, `calloutTitle`, `portalUrl`, `formatEventWhen`.
- Produces: `interface CalloutsSearch { category?: string; city?: string; page?: number }`; `validateCalloutsSearch(raw: Record<string, unknown>): CalloutsSearch` (trims text, drops blanks and junk, page must be an integer above 1).

- [ ] **Step 1: Failing tests** in `search.test.ts`: `validateCalloutsSearch({ category:' catering ', city:'', page:'abc' })` is `{ category:'catering' }`; `page: 3` is kept, `page: -3` and `page: 1` are dropped; a numeric `category: 7` is read as `"7"`.
- [ ] **Step 2:** run; fails. **Step 3:** implement `search.ts`.
- [ ] **Step 4:** `CalloutCard` shows the event image (gradient fallback), `calloutTitle`, date and place from the event when present, the category chip, service kinds as chips, `closesInLabel`, a **View event** link (`/events/$eventId`, only when the event is known) and **Sign in to apply** (`portalUrl('/login')`). Page: loader warms `calloutsQuery` and `eventsQuery` with `Promise.allSettled`; `validateSearch` plus validating again in the component; filters in the URL (category chips from `calloutCategories`, city select from the events' cities, Clear filters); load more; empty states: none open ("No open callouts right now. Create your profile and you'll be ready when one opens." with **Create your profile**) and none match ("No callouts match. Clear filters"); API failure shows Try again; head title "Open callouts | Event OS for Vendors".
- [ ] **Step 5:** Verify: typecheck, lint, build; dev server: `curl localhost:3000/vendors/callouts` is 200 with at least one card in dev; `?category=nope` shows "No callouts match"; `?page=abc&city=` is 200; with `VITE_API_URL=http://localhost:9` it is 200 with a clear message (**pins Review Focus 3**).
- [ ] **Step 6:** commit `Build vendor callouts page`.

### Task 5: Vendors landing page

**Files:** Create `src/content/{vendor-landing,vendor-faqs}.ts`, `src/content/vendor-copy.test.ts`, `src/components/vendors/{vendor-hero,callout-strip,scenarios,benefits,coming-soon,how-to-start,closing-cta}.tsx`, `src/components/landing/faq-section.test.ts`. Modify `src/components/landing/faq-section.tsx`, `src/routes/vendors/index.tsx`.

**Interfaces:**
- Produces: `SCENARIOS`, `BENEFITS`, `COMING_SOON`, `HOW_TO_START` (arrays of plain-text objects) in `vendor-landing.ts`; `VENDOR_FAQS: Faq[]`; `FaqSection({ faqs?: Faq[] })` and `faqJsonLd(faqs?: Faq[]): string` (defaults to the attendee `FAQS`, so the landing page is unchanged).

- [ ] **Step 1: Failing tests:**
  - `vendor-copy.test.ts` walks every string in `SCENARIOS`, `BENEFITS`, `COMING_SOON`, `HOW_TO_START` and `VENDOR_FAQS` and asserts none matches `/escrow|guarantee|commission|\bfees?\b|free to join|paid the next day|protected payment/i`; `BENEFITS` has exactly the four real items (calendar, contract and invoice, verified badge, start without KYC) and `COMING_SOON` has exactly payment protection, headcount lock and request-for-proposal tools (**pins Review Focus 5**); each scenario that mentions a missing feature marks it "coming soon".
  - `faq-section.test.ts`: `faqJsonLd(VENDOR_FAQS)` parses as a `FAQPage` with one question per entry, and a question containing `<` is escaped as `<` in the output.
- [ ] **Step 2:** run; fails. **Step 3:** implement the content and the `FaqSection`/`faqJsonLd` parameter.
- [ ] **Step 4:** Landing page sections in order: hero ("Get booked at events near you", buttons **See open callouts** and **Create your profile**), `CalloutStrip` ("Open now: N callouts" with up to three `CalloutCard`s from `useCalloutCards({ page: 1 })`, or the honest empty state), who it's for (three `SCENARIOS`), what you get today (`BENEFITS`), a dashed "Coming soon" box (`COMING_SOON`), how to start (numbered, a real sequence), FAQ (`VENDOR_FAQS`), closing **Create your profile** panel. Loader warms the callout and event queries; head title "Get booked at events near you | Event OS for Vendors" plus description and FAQ JSON-LD.
- [ ] **Step 5:** Verify: typecheck, lint, build, tests; dev server: `curl localhost:3000/vendors` is 200 and contains "Coming soon", "Create your profile", "Open now" and no occurrence of the word "escrow" (`grep -ci escrow` is 0).
- [ ] **Step 6:** commit `Build vendors landing page`.

### Task 6: Directory page

**Files:** Create `src/components/vendors/{vendor-card,tier-badge}.tsx`. Modify `src/features/vendors/search.ts`, `search.test.ts`, create `src/routes/vendors/directory.tsx`.

**Interfaces:** Produces `interface DirectorySearch { category?: string; city?: string; page?: number }`, `validateDirectorySearch(raw): DirectorySearch`, `TierBadge({ tier })` (renders nothing for `normal`, "Verified" or "Partnered" otherwise).

- [ ] **Step 1: Failing tests** in `search.test.ts`: `validateDirectorySearch` behaves like the callouts validator (trim, drop blanks and junk, page above 1); `{ category:'catering', city:'Accra', page:2 }` round-trips unchanged.
- [ ] **Step 2:** run; fails. **Step 3:** implement. **Step 4:** `VendorCard` links to `/vendors/$vendorId`, shows name, `TierBadge`, and category, city and summary only when present, with a gradient or `imageUrl` header (through `safeHttpUrl`). Page: loader warms `vendorDirectoryQuery`; filters in the URL (category, city) validated again in the component; load more; in dev real vendors come first and invented ones fill up to six; empty state ("No vendors listed yet. Create your profile to be one of the first.") and error state; head title "Vendor directory | Event OS for Vendors".
- [ ] **Step 5:** Verify: typecheck, lint, build; dev server: `/vendors/directory` is 200 and lists the real vendor (`Codex QA Vendor`) plus invented ones; `?category=nope` shows the empty state; API down gives 200 with a message.
- [ ] **Step 6:** commit `Build vendor directory page`.

### Task 7: Vendor page

**Files:** Create `src/routes/vendors/$vendorId.tsx`, `src/components/vendors/vendor-services.tsx`.

**Interfaces:** Consumes `vendorQuery`, `isVendorId`, `TierBadge`, `formatPrice`, `portalUrl`.

- [ ] **Step 1:** Loader: `if (!isVendorId(params.vendorId)) throw notFound()`; warm `vendorQuery`; an `ApiError` 404 throws `notFound()`; any other error returns `null` and the page shows Try again (**pins Review Focus 4**). `notFoundComponent` says "We can't find that vendor" with a link to the directory. Head title is the vendor name with the description.
- [ ] **Step 2:** Page: name, `TierBadge`, category and city, description, service catalog (`VendorServices`: name and, when present, `formatPrice(priceMinor, currency)`; an empty catalog says "This vendor hasn't listed services yet."), and a **Sign in to book** link to `portalUrl('/login')`.
- [ ] **Step 3:** Verify: typecheck, lint, build; dev server: the real vendor id returns 200 with its name; `/vendors/does-not-exist` and `/vendors/00000000-0000-0000-0000-000000000000` return 404 with "We can't find that vendor"; `/vendors/callouts` and `/vendors/directory` still return 200 (static routes win).
- [ ] **Step 4:** commit `Build vendor page`.

### Task 8: Backend request and whole-section verification

**Files:** Modify `event-os-backend/docs/specs/website-landing-api.md` (backend repo, edit only), `README.md`.

- [ ] **Step 1:** Add a section "9. Vendors section" to the backend request doc: callouts need a title, a short description and the event's name, date and city, a way to fetch one callout and a place filter; directory entries need category, city, summary and a photo; real data has no open callouts (seeding demo callouts is a data job). Do not commit the backend repo; report the edit.
- [ ] **Step 2:** In `README.md`, add the four vendors routes to the Structure list and a sentence under "Running against the backend" saying vendor sign-up and sign-in links go to the vendor portal (`VITE_VENDOR_PORTAL_URL`), which must be running for them to work.
- [ ] **Step 3:** `pnpm exec vitest run && pnpm exec tsc --noEmit && pnpm exec eslint src && pnpm build` pass.
- [ ] **Step 3b:** With the real gateway and then `VITE_API_URL=http://localhost:9`, `curl` `/vendors`, `/vendors/callouts`, `/vendors/directory` and the real vendor page: each 200 with a unique title and no render errors in the dev log.
- [ ] **Step 4:** Production check: `rm -rf dist && pnpm build`, then none of `mock-event`, a mock vendor name or a mock callout title appears in a chunk referenced by the client entry (an unreferenced `*.js` file is reported, not hidden); then a build with `VITE_ENABLE_MOCKS=true` contains them.
- [ ] **Step 5:** Record in the final message what was not verified: the 390px browser pass, keyboard-only pass and the portal's apply screen.
- [ ] **Step 6:** commit `Add vendors section verification notes`.
