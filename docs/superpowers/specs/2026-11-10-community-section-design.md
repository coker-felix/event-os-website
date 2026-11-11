# Community section design: landing, blueprints, people

Status: draft for review. Nothing here is built yet.
Backend spec: `event-os-backend/docs/specs/community.md` (the source of truth for rules and endpoints)
Plan: `docs/superpowers/plans/2026-11-10-community-section.md`
Sibling specs: `event-os-org/docs/specs/2026-11-10-community-organization.md` (every signed-in action), `event-os-admin/docs/specs/2026-11-10-community-admin.md`

## Intent

Let anyone, signed in or not, see that the community is real before joining:
proven event playbooks ("blueprints") they could use tomorrow, and the people
who made them. Then hand them to the workspace app to join, use a blueprint,
or report something. The website stays session-free, like the vendors
section.

The people it speaks to:

- **The first-time organizer** who doesn't know what to do 8 weeks before an
  event. They need a ready plan.
- **The seasoned organizer or production lead** who wants recognition for
  their playbook and their name in front of future clients.
- **The freelancer** (sound, ushering, photography) who wants a profile that
  shows their skills and lets work find them.

## The honesty rule

Checked against the backend spec, Phase 1:

| Real at launch (may be promised) | Not real yet ("Coming soon", never promised) |
|---|---|
| Browse and search blueprints (task playbooks with timing and dependencies) | Q&A and discussions (Phase 2) |
| Use a blueprint: it is copied into your organization's playbooks | Crew Call: shift jobs and hiring (Phase 3) |
| Public professional profiles with skills, location and availability | Verified work history and reviews (Phase 3–4) |
| Founding member badges | Following people, groups, downloadable templates such as contracts and budget sheets (Phase 4) |
| Report anything; human moderators review it | Messaging (no phase) |

No copy says or implies "verified", "vetted" or "certified" professionals.
No reputation scores, star ratings or hire buttons on community pages. No
fee or pricing copy.

## Goals, non-goals, anti-goals

Goals
- A visitor sees real blueprints on the first screen of `/community`.
- Any blueprint can be put to use in at most two taps after signing in.
- Every community page works, and reads well, with the API down or the
  feature off.

Non-goals
- No new analytics events in Phase 1. The community funnel (forks, joins) is
  measured server-side from backend facts.
- No sign-in, sessions, forms or writes on the website. Joining, using a
  blueprint and reporting are links into the workspace app.
- No Q&A, Crew Call or follow features (later phases add their own read-only
  pages here).

Anti-goals: an empty library page that looks broken; a "Join" link that sends
a freelancer into organization onboarding; showing a hidden or private
profile through a cached page.

## Routes

| Route | Content | Data |
|---|---|---|
| `/community` | Hero ("Plans that worked, from people who ran them"); 6 most-forked blueprints; founding members strip (up to 12 profiles with the badge; the strip isn't rendered when there are none); how it works in 3 steps; "Coming soon" row (Q&A, Crew Call); CTA band | `status`, `blueprints?sort=forks&limit=6`, `profiles?badge=founding_member&limit=12` |
| `/community/blueprints` | Library: search `q`, tag chips, sort (Most used / Newest), optional `author` (from "More by …", shown as a removable "By <name>" chip), "Load more" (12 per page, the vendors pattern) | `blueprints?q&tag&author&sort&limit&offset` |
| `/community/blueprints/$blueprintId` | Title, summary, tags, version, times used, author (link to their profile if visible), credited organizer (link to `/organizers/$organizerId` when it resolves), **task timeline**: tasks in dependency order, each with its offset ("6 weeks before") and what it depends on. Actions: "Use this blueprint" (with the note "You'll need an organizer workspace. We'll help you set one up."), "Report" | `blueprints/{id}` |
| `/community/people` | Directory: search `q`, skill select, country, city, availability chips, "Load more" | `profiles?…`, `skills` |
| `/community/people/$userId` | Display name, headline, bio, skills, location, availability, badges; "Blueprints by …" (up to 6, link to more). Action: "Report profile" | `profiles/{id}`, `blueprints?author={id}&limit=6` |

Static routes win over the `$` params. Ids are UUIDs: a malformed id is a real
404 page without calling the API.

## Links into the workspace app

Built with `portalUrl()` (base `VITE_PORTAL_URL`). These are the only ways
off-site:

| Action | Target in event-os-org |
|---|---|
| Join the community | `/register?redirect=/community/profile` |
| Sign in | `/login?redirect=/community` |
| Use this blueprint | `/login?portal=organizer&redirect=/organizer/community/blueprints/{id}?fork=1` (a signed-in user passes straight through) |
| Report | `/login?redirect=/community/report?type={profile|blueprint}&id={id}` |

The `redirect` value is URL-encoded once. event-os-org accepts `/community`
redirects and doesn't send these users to onboarding (event-os-org spec, UI-1
to UI-4).

## States

| Situation | What the page does |
|---|---|
| `status.blueprints=false` | All community routes return 200 with a "Community is coming soon" panel and a "Get notified" link to the contact page. No data calls are made. The header doesn't show "Community" |
| API slow or down | 200 with "We can't load the community right now. Try again in a minute." and a retry button. The status check failing counts as "down", not as "off" |
| Blueprint or profile 404 (hidden, withdrawn, private, suspended, deleted) | A real 404 page: "This page isn't available. It may have been removed or made private." with a link to the library or directory |
| Empty library or directory | "No blueprints yet. Be one of the first to share one." with the Join CTA; with filters: "No matches. Clear filters." |
| Author shown as "Former member" | Rendered as plain text, no link |

## Caching and privacy

- Detail pages server-render with `Cache-Control: public, max-age=60,
  stale-while-revalidate=300`. Lists use `max-age=60`. This bounds how long a
  newly hidden or private item can still be served (the backend CM-S4/S7
  behavior applies on the next fetch).
- Client-side TanStack Query stale time is 60 seconds for community queries.
- Profiles never show email or phone; the API doesn't return them, and the
  types don't declare them.
- `<meta name="robots" content="noindex">` on people pages for Phase 1. Public
  profile indexing needs a privacy decision (backend open decision 8).
  Blueprint pages are indexable.

## Header and navigation

Add a `community` product to `src/config/products.ts`: name "Community", home
`/community`, nav Blueprints · People, and header actions "Join" (primary) and
"Sign in". The product switcher and the attendee footer always link to
Community; `/community` itself shows "coming soon" or "can't load" when the
feature is off or the API is down. The home page has a "Event OS" pillars
section (Community, Operations, Commerce) whose Community card links to
`/community`.

## Mock data

Follow the vendors pattern: invented blueprints and profiles exist only behind
`MOCKS_ENABLED`, only inside a statement-level `if (MOCKS_ENABLED)`, and real
API values always win. No invented data ships in production builds.

## Later phases (outline)

- **Phase 2:** read-only `/community/questions` (channels, threads,
  accepted-answer highlight). "Ask" and "Reply" link into event-os-org.
- **Phase 3:** read-only `/community/crew` (open shift listings). "Apply"
  links into event-os-org. A pay note is shown verbatim, never reformatted.
- **Phase 4:** follower counts and groups, only when the backend exposes them.

## Acceptance tests

| ID | Scenario | Expected |
|---|---|---|
| WEB-1 | Status off | Every community route returns 200 with "coming soon"; no data requests; switcher, footer and home pillar still link to `/community` |
| WEB-2 | API down | 200 with the retry message; no crash in SSR |
| WEB-3 | Malformed id | 404 without an API call |
| WEB-4 | Hidden blueprint | 404 page with the removed/private copy |
| WEB-5 | "Use this blueprint" href | Exactly the spec URL, with `redirect` encoded once |
| WEB-6 | Timeline | Tasks render with dependencies first, and offsets in words |
| WEB-7 | "Former member" author | Plain text, no link |
| WEB-8 | Empty library, with and without filters | The two empty-state messages |
| WEB-9 | People page head | Contains `noindex` |
| WEB-10 | Production build | Contains no mock module (bundle check, as in the vendors plan) |
| WEB-11 | Copy check | No occurrence of "verified", "vetted", "certified", "rating", "fee" or "free to join" in community components |
