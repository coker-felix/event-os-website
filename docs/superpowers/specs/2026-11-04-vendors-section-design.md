# Vendors section design: landing, callouts, directory, profile

Status: draft for review. Nothing here is built yet.

## Intent

Vendors (caterers, sound engineers, stage builders and so on) should be able
to land on the website, see real work they could win, and start. The vendor
portal (`event-os-ui`, at `/login`, `/register`, `/vendor/dashboard`) already
exists, so this section does not rebuild it. Its job is to persuade, to show
real open callouts and vendors, and to hand people to the portal.

The people it speaks to, from the product research:

- **The solo operator** (freelance sound engineer or DJ): works from a car
  and a WhatsApp group, chases payments, double-books, struggles to find work
  beyond their circle.
- **The mid-size caterer**: small team, a kitchen, overwhelmed by logistics
  and last-minute changes.
- **The boutique production house** (stage and set builder): 5 to 15 people,
  spends hours on quotes it may lose, has painful cash flow.

The research says a vendor who opens the portal and sees no work closes the
tab. So the page leads with leads (open callouts) and lets a vendor start
without paperwork.

## The honesty rule

This section promises only what the platform does today. Checked against the
backend specs:

| Real today (may be promised) | Not real yet ("Coming soon", never promised) |
|---|---|
| Open callouts from organizers; apply, get selected | Payment protection: organizer deposits first, vendor paid the day after |
| Apply and be selected before KYC; payout held until KYC clears | Headcount lock and final F&B guarantee |
| One calendar: accepted bookings block those dates | Request-for-proposal tools and budget filters |
| A contract and a draft invoice for every accepted booking; one rating per completed booking | Venue add-on bundles (chairs, tables) |
| Verified and partnered tiers, assigned by an admin | |
| A public directory and a public vendor page | |

Escrow exists for ticket and donation money, not for vendor bookings, so no
copy may say or imply guaranteed or protected vendor payment.

## Goals, non-goals, anti-goals

Goals
- A first-time vendor sees real open work within the first screen.
- A vendor can reach sign-up in one tap from any page of the section.
- Every claim on the page is true today or is marked "Coming soon".

Non-goals
- No applying to a callout on this website (needs a vendor session; the
  portal has no apply screen yet, which is portal work).
- No sign-in, accounts or vendor sessions on the website.
- No pricing, commission or fee copy (not known; see "Needs your input").
- No budgets, RFP tools or payment protection.

Anti-goals: a "Sign up" that goes nowhere; a callouts page that looks broken
when there are none; a page that sounds like escrow exists.

## Shared decisions

- Same visual language and components as the rest of the site (palette, type,
  ticket-stub cards, mobile first at 390px, 44px targets, accessibility floor,
  errors that say what to do). The vendors product keeps its own header and
  nav (Callouts, Directory) and adds **Sign in** and **Create profile**
  buttons that go to the portal.
- **Portal links** use `VITE_VENDOR_PORTAL_URL` (default
  `http://localhost:5173`): Create profile is `/register`, Sign in is
  `/login`. These paths and the dev port are my guesses from the portal's
  routes.
- Invented data stays behind `MOCKS_ENABLED`, off in production; every invented
  field is added to the backend request doc.
- Pages load on the server and never fail when the API is down.
- URL carries filters; all external links come through `safeHttpUrl`.

## Routes

| URL | Page |
|---|---|
| `/vendors` | Landing |
| `/vendors/callouts` | Open callouts |
| `/vendors/directory` | Vendor directory |
| `/vendors/$vendorId` | Public vendor page |

`/vendors` and `/vendors/callouts` exist as shell pages. There is no callout
detail page: the API cannot fetch a single callout, so a card links to its
event page instead.

## 1. Landing (`/vendors`), leads first

- **Hero:** "Get booked at events near you". Line under it: "Organizers post
  what they need. You apply, get selected, and keep one calendar of every
  gig." Buttons: **See open callouts**, **Create your profile**.
- **Open now:** "Open now: N callouts" and the three newest as callout cards.
  With none open: "No open callouts right now. Create your profile and
  you'll be ready when one opens." with the Create profile button. No invented
  callouts in production.
- **Who it's for:** three scenario cards (solo operator, caterer, production
  house). Each pairs one frustration with what exists today and, where
  relevant, a "Coming soon" tag. Draft copy below.
- **What you get today:** one calendar; a contract and invoice for every
  booking; a verified badge an admin can grant; start without KYC (you can
  apply and be selected first, and your payout is held until KYC clears).
- **Coming soon** (dashed box, visibly not live): payment protection,
  headcount lock, request-for-proposal tools.
- **How to start:** 1 Create your profile. 2 Apply to a callout. 3 Get
  selected. These are a real sequence, so numbers carry meaning.
- **FAQ,** then a closing **Create your profile** panel.

Scenario copy (draft, review before shipping):
- Solo operator: "Two clients asked for the same Saturday. One calendar
  blocks the dates you've accepted, so you can't double-book. A verified badge
  helps clients trust you."
- Caterer: "Every accepted booking gets a contract and a draft invoice that
  state what was agreed. Headcount lock: coming soon."
- Production house: "A public page shows your past work to organizers who
  don't know you yet. Request-for-proposal tools and payment protection:
  coming soon."

FAQ (draft, real facts only): How do I get started? Do I need KYC to start?
How does the calendar work? What do I get with a booking? What is the
verified badge? When do I get paid? (Answer: "Payment protection is coming
soon. For callout bookings, your payout is held until KYC clears. Agree
payment terms in your contract.")

## 2. Callouts (`/vendors/callouts`)

- One card per open callout. The API gives only `category`, `serviceKinds`,
  `opensAt`, `closesAt` and `eventId`, so the page joins each callout to its
  event from the events list to show the event name, date, place and image.
  If the event is not found, the card shows "Open callout · {category}" and
  the service kinds, with no event details.
- Card: event name, date and place, category chip, the service kinds wanted
  (readable, "Check in assistance"), "Closes in N days" (or "Closes today",
  "Closed"), a **View event** link, and **Sign in to apply** (portal login).
- Filters in the URL: category (server filter) and place (from the event's
  city, applied in the browser). "Clear filters".
- Empty states: none open (same honest message as the landing); none match the
  filters ("No callouts match. Clear filters").
- Load more as the page grows.

## 3. Directory (`/vendors/directory`)

- Active vendors with a tier badge (Verified, Partnered; none for normal).
  Filters in the URL: category and city (the API supports `category`,
  `country`, `region`, `locality`).
- The list returns only name and tier, so cards are thin until the backend adds
  category, city, summary and a photo (backend request). Cards show whatever
  is present.
- Load more; empty and error states as elsewhere.

## 4. Vendor page (`/vendors/$vendorId`)

- Business name, tier badge, category and city, description, and the service
  catalog (name and, when present, a price shown with `formatPrice`).
- A **Sign in to book** link to the portal (organizers book vendors there; my
  guess at the link).
- Unknown or malformed ids return a real 404 (ids are UUIDs).

## Backend dependencies (added to the backend request doc)

- Callouts: add a title, a short description and the event's name, date and
  city to each callout (today the website joins them itself); a way to fetch
  one callout; a place filter.
- Directory entries: category, city, summary and a photo.
- Open callouts exist in the real data (it has none today); seeding partner or
  demo callouts is a data job.

## What is left to the builder

Component structure, the callout-to-event join and its caching, URL schemes
for filters, loading and skeleton states, copy beyond what is written, and the
tests. Reuse `EventCard`-style cards, the filter patterns from All events and
the data layer in `src/features`.

## My calls (check these)

- Portal links and dev port (`/register`, `/login`, `http://localhost:5173`).
- No callout detail page.
- A callout with no matching event still shows, as "Open callout · category".
- Place filter on callouts is applied in the browser from the event's city.
- The three scenario cards and the FAQ wording above.
- "Sign in to book" on the vendor page.

## Decisions from review

- **No fee or commission copy** anywhere in the section for now. No pricing
  page, no "free to join", no commission wording.
- **The word "escrow" does not appear** on any vendors page. The section stays
  strictly about vendors; the only mention of payments is "Payment
  protection: coming soon" and the FAQ answer to "When do I get paid?".

## Verification

Each page: renders on the server with a unique title; works with the API down;
no horizontal scroll at 390px and targets at least 44px (browser pass still
needed); tests for the pure logic (callout and event join, closing labels,
filters, service-kind labels, portal links). The production build must contain
no invented callouts or vendors.
