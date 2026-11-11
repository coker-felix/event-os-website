# Community Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the read-only community section (`/community`, blueprints library and detail, people directory and profile), with every action handed to event-os-org.

**Architecture:** TanStack Start routes under `src/routes/community/`, backed by `src/features/community` (types, normalizers, pure logic, queries, dev-only mocks, link builders) and `src/components/community`. Pure logic gets vitest tests. Pages are checked by typecheck, lint, build and server-rendered output.

**Tech Stack:** TanStack Start/Router/Query, React 19, Tailwind v4, shadcn, vitest, pnpm.

**Spec:** `docs/superpowers/specs/2026-11-10-community-section-design.md`. Backend: `event-os-backend/docs/specs/community.md`. Backend plan Tasks 5, 7 and 9b must be deployed for real data; until then, pages run on dev mocks.

## Global Constraints

- **Honesty rule** and banned words from the spec (WEB-11). No sessions, forms or writes.
- Off-site actions only through `communityLinks` built on `portalUrl()` (spec table). Never hand-write portal URLs in components.
- Every route: own `<title>` and description; 200 with a clear message when the API is slow or down; a real 404 for malformed ids without an API call; static routes win over `$` params.
- Mocks only behind `MOCKS_ENABLED` inside a statement-level `if (MOCKS_ENABLED)`; real API values win.
- Same visual language and components as the rest of the site; mobile first at 390px; targets at least 44px; visible focus; labelled controls; reduced motion respected.
- Commit directly to `main`, one commit per task, no Claude attribution trailer.

## Review Focus

- Status endpoint failing is treated as "down", not "off" (WEB-1 vs WEB-2).
- The `redirect` parameter is encoded exactly once (WEB-5).
- People pages carry `noindex` (WEB-9).

---

### Task 1: Types, normalizers, links

**Files:**
- Create: `src/features/community/types.ts`, `normalise.ts`, `normalise.test.ts`, `links.ts`, `links.test.ts`, `ids.ts`

**Interfaces:** `Blueprint`, `BlueprintDetail` (with `tasks: Array<{ key, title, offsetAmount, offsetUnit, dependsOn }>`), `Profile`, `Skill`, `CommunityStatus`; `normaliseBlueprintList`, `normaliseBlueprint`, `normaliseProfileList`, `normaliseProfile`, `normaliseStatus` (missing → all false); `communityLinks.join()`, `.signIn()`, `.useBlueprint(id)`, `.report(type, id)`; `isUuid`.

- [ ] **Step 1:** Write failing tests: normalizers turn missing arrays into `[]` and a missing `total` into 0, and drop any `email` or `phone` keys; `useBlueprint(id)` equals the spec URL with `redirect` encoded once (WEB-5); `report` rejects types other than profile and blueprint.
- [ ] **Step 2:** Run `pnpm test -- community` Expected: FAIL
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run the same command. Expected: PASS
- [ ] **Step 5:** Commit `feat(community): types, normalizers and portal links`

### Task 2: Timeline ordering and offset wording

**Files:**
- Create: `src/features/community/timeline.ts`, `timeline.test.ts`

- [ ] **Step 1:** Write failing tests: `orderTasks` puts dependencies before dependents and keeps the input order otherwise; a cycle (which shouldn't happen) falls back to input order without throwing; `offsetLabel` gives "6 weeks before", "3 business days before", "On the day" (WEB-6).
- [ ] **Step 2:** Run `pnpm test -- timeline` Expected: FAIL
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run the same command. Expected: PASS
- [ ] **Step 5:** Commit `feat(community): blueprint timeline ordering`

### Task 3: Queries, status and mocks

**Files:**
- Create: `src/features/community/queries.ts` (`statusQuery`, `blueprintsQuery`, `blueprintQuery`, `profilesQuery`, `profileQuery`, `skillsQuery`; 60s stale time; page size 12, using the vendors "Load more" limit pattern), `src/features/community/mocks.ts`, `src/features/community/state.ts` (`resolvePageState(statusResult)` → `off | down | ready`), `state.test.ts`

- [ ] **Step 1:** Write failing tests: `resolvePageState` returns `off` only when status loaded with `blueprints=false`, and `down` when the status request failed (WEB-1, WEB-2).
- [ ] **Step 2:** Run `pnpm test -- state` Expected: FAIL
- [ ] **Step 3:** Implement queries. Mocks are imported only inside `if (MOCKS_ENABLED)`, filling empty lists in development.
- [ ] **Step 4:** Run the same command. Expected: PASS
- [ ] **Step 5:** Commit `feat(community): queries, status and dev mocks`

### Task 4: Shared components and the product entry

**Files:**
- Create: `src/components/community/{blueprint-card.tsx,profile-card.tsx,coming-soon.tsx,community-unavailable.tsx,not-available.tsx,timeline.tsx,skill-chips.tsx}`
- Modify: `src/config/products.ts` (product `community`), `src/components/layout/site-header.tsx`, `product-switcher.tsx`, `site-footer.tsx` (shown only when status is `ready` and `blueprints` is true)
- Create: `src/routes/community/route.tsx` (product layout, status loader with `Promise.allSettled`)

- [ ] **Step 1:** Implement the components. "Former member" renders as text with no link (WEB-7).
- [ ] **Step 2:** Run `pnpm exec tsc --noEmit && pnpm lint` Expected: PASS
- [ ] **Step 3:** Commit `feat(community): community components and navigation`

### Task 5: Landing page

**Files:**
- Create: `src/routes/community/index.tsx`

- [ ] **Step 1:** Implement: hero, top 6 blueprints, founding members strip (not rendered when empty), 3 steps, "Coming soon" row, CTA band. Off → coming soon; down → retry message; empty → the invite copy.
- [ ] **Step 2:** Run `pnpm build`, then render `/community` with the status mocked off, down and ready, and check the HTML for the three states (WEB-1, WEB-2).
- [ ] **Step 3:** Commit `feat(community): community landing page`

### Task 6: Blueprints library and detail

**Files:**
- Create: `src/routes/community/blueprints/index.tsx`, `src/routes/community/blueprints/$blueprintId.tsx`, `src/features/community/search.ts`, `search.test.ts`

- [ ] **Step 1:** Write failing tests for `validateBlueprintsSearch` (sort only `forks|recent`, page ≥1, `author` kept only when it's a UUID, unknown keys dropped).
- [ ] **Step 2:** Run `pnpm test -- search` Expected: FAIL
- [ ] **Step 3:** Implement the pages. The detail page shows the organizer-workspace note under "Use this blueprint" and returns 404 for a non-UUID id before any fetch (WEB-3) and for an API 404 (WEB-4); both empty-state messages (WEB-8); `Cache-Control` headers per the spec.
- [ ] **Step 4:** Run `pnpm test && pnpm build` Expected: PASS
- [ ] **Step 5:** Commit `feat(community): blueprints library and detail`

### Task 7: People directory and profile

**Files:**
- Create: `src/routes/community/people/index.tsx`, `src/routes/community/people/$userId.tsx`; extend `search.ts` with `validatePeopleSearch` and its tests

- [ ] **Step 1:** Write failing tests for `validatePeopleSearch` (availability enum, two-letter country, page ≥1).
- [ ] **Step 2:** Run `pnpm test -- search` Expected: FAIL
- [ ] **Step 3:** Implement. Both pages set `robots: noindex` (WEB-9); the profile shows "Blueprints by …" via `author=`; the report link comes from `communityLinks.report('profile', id)`.
- [ ] **Step 4:** Run `pnpm test && pnpm build` Expected: PASS
- [ ] **Step 5:** Commit `feat(community): people directory and profiles`

### Task 8: Verification

- [ ] Run `pnpm test && pnpm exec tsc --noEmit && pnpm lint && pnpm build`. Expected: all pass.
- [ ] Bundle check: the production build contains no `features/community/mocks` chunk (WEB-10).
- [ ] Copy check: `grep -riE "verified|vetted|certified|rating|fee|free to join" src/components/community src/routes/community` returns nothing (WEB-11).
