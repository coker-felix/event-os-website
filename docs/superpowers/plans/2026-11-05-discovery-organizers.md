# Organizer profiles, past events, reviews, follow and "For you" — plan

**Goal:** Move the attendee site from ticket store toward discovery: who hosts an event, what past events were like, what attendees said, and what to see next.

**Approach:** Each piece reads from a proposed API (backend request section 11 in `event-os-backend/docs/specs/website-landing-api.md`). In dev, invented data stands in (`MOCKS_ENABLED`, dynamic import). In production a missing or failing endpoint hides the section. Nothing needs an account.

## Decisions (approved in chat: "yes", after the playback)

- **Reviews** come only from verified ticket holders through a private link (`/review/<token>`), so no account is needed and fake reviews are hard. Rating 1 to 5, text up to 500 characters, shown as plain text.
- **Follow** is an alerts sign-up for that organizer (email or phone) plus a flag on this device. The flag lives in the existing `event-os:preferences` key, so it is written only after Accept.
- **For you** is computed on the device from saved events and followed organizers, and labelled "Because you saved <category>" and "From organizers you follow". No guessing, no profile on the server.
- Photo and video URLs pass `safeHttpsUrl`. A video opens in a new tab, never embedded. Organizer ids must be UUIDs or the page is a real 404.
- Event cards show "Hosted by <name>" as plain text (the card is already one link). The link to the profile is on the event page.
- **Out of scope:** public links to promoters' guest lists, influencer "trending creators" with their own links, accounts.

## Tasks

1. **Discovery data:** types, normalisers (clamp rating, trim text, safe URLs, drop unusable), queries with dev mocks, organizer fields on `PublicEvent` and the dev enrich. Tests: normalisers, id guard.
2. **Recommendations and following:** `following` and `toggleFollow` in the preferences store (registry text updated); pure `recommendFor`. Tests: both.
3. **Follow:** `followOrganizer` API (mock in dev) and `FollowButton` with inline contact form.
4. **Organizer profile:** route `/organizers/$organizerId` (header, follow, upcoming, past events with photos, reviews); "Hosted by" on cards and a link on the event page; photo gallery and video link on past event pages.
5. **Reviews:** `ReviewsSection` (average, count, recent quotes) on the profile and event page; `/review/$token` form.
6. **Landing rows:** "For you", "Trending organizers", "Relive it".
7. **Backend request section 11, README, whole-site check, push waits for the user.**
