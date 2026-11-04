# Venues section design: landing, directory, venue page

Status: draft. You asked for the design and the build in one go, using my
recommendations, so every call below that you did not make is listed under
"My calls". Reuses what the attendee and vendors sections established.

## Intent

Two audiences use the venues section:

- **Venue owners**: want their venue seen and the work of renting it out
  contained: who has the dates, what was agreed, whether it is paid. They need
  a reason to list and a one-tap path to do it.
- **Organizers**: want a curated list of venues for their next event, with
  what decides a shortlist: where, how big, whether it can be booked, and
  which dates are already taken.

The vendor portal (`event-os-ui`) is one app for organizers, vendors and
venues: it has `/login`, `/register` and a venue workspace at `/venue/...`
(dashboard, profile, spaces, availability). This section does not rebuild
that. It persuades, lists real venues and hands people to the portal.

## The honesty rule (same as vendors)

Checked against the backend specs:

| Real today (may be promised) | Not real yet ("Coming soon", never promised) |
|---|---|
| A public venue profile, listed once a venue is reviewed and active | Payment or deposit protection for venue bookings |
| Date-range bookings on a calendar guarded against double-booking | Add-on rentals (chairs, tables) bundled with a booking |
| Held dates shown publicly as date ranges only, no personal details | Request-for-proposal tools for organizers |
| A contract and a draft invoice for every accepted booking; the organizer's confirmation completes it | |
| One rating per completed booking | |
| Utilization analytics for the owner | |
| A booked venue linked into the event's prep workflow | |

Claimed and unclaimed: a directory venue can be unclaimed. Unclaimed venues are
listed but cannot be booked and have no availability. Claiming sits behind the
`venue_claims` flag, which is off by default, so no page tells anyone they can
claim a listing. The only call to action for owners is "List your venue".

No fee, pricing, commission, "free to list" or "escrow" copy anywhere in this
section (same decision as vendors).

## Goals, non-goals, anti-goals

Goals
- A venue owner understands what they get and can start in one tap.
- An organizer can shortlist by place, size and bookable-or-not, and see taken
  dates before asking.
- Every claim is true today or marked "Coming soon".

Non-goals
- No booking or contact form on the website (bookings need a portal session).
- No claiming flow, no sessions, no maps, no photo gallery (the API has no
  coordinates or photos).
- No payment, deposit or pricing copy.

Anti-goals: a directory that looks broken while empty; implying an unclaimed
listing can be booked; copy that sounds like payments are protected.

## Shared decisions

- Same visual language, mobile first at 390px, 44px targets, accessibility
  floor, errors that say what to do, filters in the URL, links through
  `safeHttpUrl`, invented data only in development behind `MOCKS_ENABLED`
  (loaded by dynamic import so production leaves it out), pages that never fail
  when the API is down, ids that are not UUIDs answer a real 404.
- The venues header shows **Sign in** and **List your venue** (portal
  `/login` and `/register`) and the nav entry **Directory**.
- One portal serves all three roles, so the address variable becomes
  `VITE_PORTAL_URL` (default `http://localhost:5173`). `VITE_VENDOR_PORTAL_URL`
  keeps working as a fallback so nothing breaks.

## Routes

| URL | Page |
|---|---|
| `/venues` | Landing |
| `/venues/directory` | Venue directory |
| `/venues/$venueId` | Venue page |

`/venues` exists as a shell page. Static routes win over `$venueId`.

## 1. Landing (`/venues`)

- **Hero:** "Get your venue seen, and every booking in one place." Line:
  "List your venue so organizers can find it, see which dates are taken, and
  send booking requests." Buttons: **List your venue**, **Browse venues**.
- **Two audiences:** "Venue owners" and "Organizers" cards, each with one real
  situation and what exists today.
- **Venues on Event OS:** up to three listed venues, or the honest empty state
  ("No venues listed yet. List yours and be one of the first.").
- **What you get today:** public profile, a calendar that cannot double-book,
  a contract and invoice for every booking, utilization analytics and ratings.
- **Coming soon** (dashed box): payment protection, add-on rentals, request-for-
  proposal tools.
- **How to start:** 1 Create your profile. 2 Get reviewed. 3 Receive booking
  requests. These are a real sequence.
- **FAQ,** then a closing **List your venue** panel.

## 2. Directory (`/venues/directory`)

- Cards: name, city and country, capacity, and a **Bookable** or **Listing
  only** chip (claimed or not). No photos: a gradient header.
- Filters in the URL: city, country, minimum capacity (Any, 100+, 300+,
  1000+), and "Bookable only". Category appears only when the API starts
  returning it on entries. Bookable venues sort first, then by name.
- Empty states: none listed, none match the filters. Load more.

## 3. Venue page (`/venues/$venueId`)

- Name, a Bookable or Listing only chip, category and city, capacity, rating
  ("4.6 (12 ratings)" when there are ratings), description, amenities as
  chips, website and social links (only http(s)).
- **Held dates:** for a claimed venue, the date ranges already held over the
  next 90 days, or "No held dates in the next 90 days". For an unclaimed one:
  "This listing hasn't been claimed yet, so availability and booking aren't
  open." (The availability call answers 409 for it; that is not an error.)
- **Sign in to request a booking** goes to the portal login.
- A malformed or unknown id is a real 404.

## Backend dependencies (added to the backend request doc)

- Directory entries: `category`, a short description and a photo URL.
- Venue profile: photos and coordinates (for a map).
- Server-side city and capacity filters.
- Real venues: none exist, so the pages show honest empty states until the
  directory is seeded (a data job); invented venues appear only in development.

## My calls (not decided with you)

- Venue owners and organizers share one landing page (the shell said "marketing
  and list page").
- "Bookable" and "Listing only" as the plain-language names for claimed and
  unclaimed.
- Capacity steps 100+, 300+, 1000+; a 90-day window for held dates.
- Bookable venues first in the directory.
- Renaming the portal address variable to `VITE_PORTAL_URL` with the old name
  as a fallback.
- "Coming soon" items taken from the product research: payment protection,
  add-on rentals, request-for-proposal tools.
- The owner scenarios and FAQ wording are drafts for review.
- "Sign in to request a booking" links to the portal login (a guess about
  where booking requests are made).

## Verification

Each page renders on the server with a unique title, works with the API down,
and a production build shows only real data (honest empty states today). Tests
cover the pure logic: normalisers, filters, sorting, held-date formatting,
the URL validator and the copy guard. A 390px browser pass is still needed.
