# Attendee pages design: events, event details, checkout, blog, contact

Status: draft for review. Nothing here is built yet.

## Intent

The landing page is built and shows what's on. The next five pages turn that
interest into tickets and keep attendees supported: browse every event, decide
on one, pay for it on a phone, read the blog, and reach support. Most
attendees will be on a phone, so every page is designed phone-first and
scaled up to desktop, not the other way round.

Visual language is already set by the landing page and is reused as is: ink,
violet and flame palette; Bricolage Grotesque for display and Figtree for
text; the ticket-stub event card with its perforated tear line; and the
"stub" date block. These pages must not introduce a second visual style.

## Goals

- A visitor can find an event, see everything needed to decide, pick tickets
  and pay without leaving a phone-sized screen.
- Checkout is as short as the data allows, and never surprises the buyer with
  a price, a stock change or a payment outcome they were not told about.
- Every page works with the API slow or down: it shows a clear message,
  never a blank page.
- Pages are server-rendered with real titles, descriptions and shareable
  URLs, so search engines and link previews work.

## Non-goals

- No reviews, ratings or testimonials (there is no real data, and none will
  be invented).
- No account area, order history or sign-in UI beyond an optional "Sign in"
  link in checkout.
- No countdown timers or fake scarcity. Carts last 7 days and do not hold
  stock, so a timer would be untrue.
- No vendor or venue pages (separate work).

## Anti-goals

Failures even if everything technically works: a checkout that needs sideways
scrolling or pinch-zoom on a phone; an error that says "something went wrong"
without saying what to do; a price that changes between the summary and the
payment screen without the buyer seeing it; invented data reaching a
production build.

## Shared decisions

- **Mobile first.** Design at 390px wide. Touch targets at least 44px (inputs
  and buttons in checkout at least 48px). Bottom-pinned action bars and bottom
  sheets for primary actions on mobile.
- **Filters and state live in the URL** where a page can be shared (events
  list filters, blog category). Preferences (city, saved events) stay in the
  existing zustand store.
- **Invented data stays behind `VITE_ENABLE_MOCKS`** (on in dev, off in
  production builds). Real API values always win. Any new field below that
  the backend lacks gets a mock in `src/features/mocks` and an entry in the
  backend request at `event-os-backend/docs/specs/website-landing-api.md`.
- **Availability is a level, not a count.** The backend spec forbids raw
  stock on anonymous endpoints. The existing landing page uses a
  `ticketsLeft` count and an "Only N left" badge; change it to the
  `availability` enum (`available`, `low`, `sold_out`) with a "Selling fast"
  badge as the first task of this work.
- **Money** is formatted from minor units with the event's currency
  (`formatPrice`). Free is shown as "Free".
- **Accessibility floor:** visible keyboard focus, labelled controls, dialogs
  that trap focus and close on Esc, form errors announced to screen readers,
  reduced-motion respected.
- Errors name what went wrong and what to do. Empty states invite an action.
- Copy is sentence case, plain verbs, and the same name for an action
  throughout ("Get tickets" stays "Get tickets").

## Routes

| URL | Page |
|---|---|
| `/events` | All events |
| `/events/$eventId` | Event details |
| `/events/$eventId/checkout` | Checkout |
| `/checkout/return` | Payment return (Paystack callback) |
| `/blog` | Blog list |
| `/blog/$slug` | Article |
| `/contact` | Contact |

`/events/$eventId`, `/events/$eventId/checkout`, `/blog` and `/blog/$slug`
exist already as shell pages. `/checkout/return` is new; its exact path and
query (for example `?reference=`) follow whatever Paystack callback the
backend configures, so that is the builder's call.

## 1. All events (`/events`)

Layout: filter sidebar with a grid or list of results.

**Desktop**
- Left sidebar: search box, then City, When (Tonight, This weekend, Next 7
  days, Pick dates), Price (Free, Under ₦10k, ₦10k to ₦25k, Over ₦25k),
  Category and Format (in person, online, hybrid). Each option shows a count.
  The price bands are placeholders; set them to typical ticket prices.
- Results header: "14 events in Lagos", a sort menu (Soonest, Newest, Price
  low to high) and a Grid / List toggle.
- Active filters appear above the results as removable chips with one "Clear
  all" link.
- Grid uses the landing page ticket-stub card. List view is a compact row: date
  stub, small image, title, time, venue and city, category and availability,
  price and a button. Sold-out rows say "Join waitlist".
- "Load more events" button (not infinite scroll, so the footer stays
  reachable).

**Mobile**
- Search box, a "Filters" button with a badge for the number of active
  filters, and a sort control. The button opens a bottom sheet with the same
  filters and a "Show 14 events" button.
- Active filters as removable chips below the header. Results are full-width
  cards.

**Empty state:** "No events match these filters", with "Clear all filters"
and "Notify me" (opens the alerts signup).

**Data:** filters work on the loaded events now (the first 60) and move
server-side when the backend adds filtering (backend request section 2).
Price filter and counts need `priceFromMinor`; they use mock prices in dev.

## 2. Event details (`/events/$eventId`)

Layout: details column plus a sticky ticket panel on desktop; a pinned bottom
bar and a ticket bottom sheet on mobile.

**Content, top to bottom**
- Banner image using the organizer's hero image and accent colour (gradient
  fallback), with the category chip, a Save heart and a Share button.
- Key facts: title; date and time with timezone and an "Add to calendar"
  link; venue and city with a "Map" link; format (in person, online, hybrid).
- About (collapsed after about six lines with "Read more").
- Good to know: doors time, age limit, refund rules, organizer. Shown only for
  fields that exist.
- Sponsors: logos grouped by tier.
- More events like this: three cards, same category or city.

**Ticket panel (desktop, about 400px wide, sticky)**
- One card per ticket type: name, one-line description, price, quantity
  stepper limited to the type's per-order minimum and maximum, and a
  "Details" control. Generous padding; steppers at least 44px.
- Only buyable types are shown by default. A collapsed "Other tickets (N)"
  section lists sold out, not yet on sale and ended types.
- Footer: line items, "Fees and tax shown at checkout", and a "Get tickets
  · ₦16,000" button. A "Support this event" link appears when donations are
  enabled.
- Free events show "RSVP · Free" instead.

**Ticket card details**
- **Description:** one short line under the name, always visible. "Details"
  (an info icon with the label "About General ticket") opens a dialog with
  the bullet list of what is included. On mobile the details expand inline
  inside the sheet instead of opening a dialog on top of a sheet.
- **Selling fast** badge when availability is `low`.
- **Volume discount** hint ("Buying 4 saves you 10%: -₦3,200") appears only
  once the quantity qualifies.
- **Bundles** are labelled, for example "Couple pass, admits 2".
- **Sold out:** "Sold out" with "Join waitlist", which opens a phone or email
  field only when tapped.
- **Not on sale yet:** "On sale Mon 10 Nov, 9:00 AM". **Sale ended:** greyed.

**Mobile:** the page scrolls normally; a bar pinned to the bottom shows
"From ₦8,000" and "Get tickets". The bar opens a bottom sheet with the same
ticket cards and a sticky "Get tickets" button that goes to checkout.

**Data:** event and ticket types from `GET /events/{eventId}`. Ticket
`description` and `includes`, venue address, doors, age, refund text and
organizer are not in the API; see the backend request (sections 1b and the
contact/config section) and mock them in dev.

## 3. Checkout (`/events/$eventId/checkout`)

Layout: one page of stacked sections with a pinned Pay bar (mobile) or a
sticky summary card (desktop). Designed phone-first.

**Sections**
1. Header: back arrow to the event, and an event card with title, date, venue
   and the chosen tickets with an "Edit" link.
2. **Your details:** phone number and optional email (at least one is
   required), "Send my tickets by" SMS or email (defaults to whichever was
   entered), and an optional "Sign in" link.
3. **A few questions:** only when the event has a questionnaire. The field
   matches each question type (short and long text, single and multi select,
   yes/no, date). A waiver is an explicit checkbox with the text visible.
4. **Billing country:** only when a virtual ticket needs it for tax; a
   dropdown, preselected from the saved city.
5. **Summary:** tickets, volume discount, fees and tax, and the total. A "Have
   a coupon?" link is hidden until tapped (the cart API does not document
   coupons, so this depends on the backend; omit it if unsupported).
6. **Pay bar:** pinned on mobile, shows the total and "Pay with Paystack".
   Free orders say "Get free tickets" and skip payment.

**Rules**
- No countdown timer.
- Inputs at least 48px tall, with the right mobile keyboard (phone, email).
- Fees and tax are visible before paying.

**When something changes** (HTTP 409 and 422 from checkout)
- Price or stock changed (`requoteRequired`, insufficient inventory): a notice
  at the top says exactly what changed ("Only 1 General ticket is left. We
  updated your order from 2 to 1"), the summary updates, and the pay button
  becomes "Confirm to pay" until the buyer acknowledges.
- Questionnaire changed (`questionnaireStale`): show the new questions and
  scroll to them.
- Unsupported location (422 `unsupported_jurisdiction`): "We can't sell
  tickets to this location yet" with a "Contact us" link.

**After payment (`/checkout/return`)**
- Paid: "You're going!" with order number, total, a ticket stub with QR, where
  it was sent, "Add to calendar" and "Find my tickets".
- Pending: "Confirming your payment…", keeps checking, and says a text will
  arrive when it clears and the page can be closed.
- Failed: "Payment didn't go through. You haven't been charged. Your tickets
  are still in your cart." with "Try again" and "Contact us". The cart is
  kept.

**Data and API:** carts (`POST /carts`, line and contact updates, `POST
/carts/{id}/checkout`). The cart token is also set as an `eos_cart` cookie.
Send an idempotency key with checkout so a double tap cannot create two
orders. The checkout result carries `status` (`paid` or `pending`) and
`authorization_url` for the Paystack redirect.

## 4. Blog list (`/blog`) and article (`/blog/$slug`)

**List layout: magazine.** A large featured post card on top (newest, or
flagged featured), then category chips filtering a three-column grid of post
cards, then "Load more posts". One column on mobile; the chips scroll
sideways.

**Article (my proposal, not yet reviewed in detail)**
- One comfortable reading column of about 65 characters on desktop, and 18px
  body text on mobile.
- Back link, category, title, date, reading time and author; cover image;
  body with subheadings, pull quotes and images.
- After the body: a "Happening soon" strip of matching events (shown only when
  relevant), "Share" and "Copy link", then "Keep reading" with three related
  posts and the vendor and venue strip from the landing page.

**Data:** blog endpoints are proposed (backend request section 4), including
an optional `author`. Mock posts exist for the list; the article body format
is undecided (the backend spec leaves it open). Until then, render plain
paragraphs.

## 5. Contact (`/contact`)

**Layout (desktop):** page title and "We usually reply within one working
day"; a "Need a quick answer first?" strip; below it a two-column area with
the message form on the left and "Other ways to reach us" and "Not an
attendee?" on the right.

- **Quick answers:** links to ticket self help (Find my tickets), the FAQs and
  refunds and orders. These come first because many questions are already
  answered there.
- **Message form:** topic (My tickets or an order, Refunds, Vendors, Venues,
  Organizing events, Other), name, email or phone, optional order number, and
  a message (limit 2000 characters). After sending: "Message sent. We'll reply
  to the email or phone number you gave us, usually within one working day.
  Your reference: #C-10482."
- **Reach us now:** WhatsApp, phone and email. On mobile these are one-tap
  buttons that open the app.
- **Hours:** "Mon to Fri, 9 AM to 6 PM". Outside those hours the page says
  "Back Monday at 9 AM". The form works at all hours.
- **Not an attendee?** Links for vendors, venues and organizers to their own
  sections.

**Mobile:** title, quick answers, the three contact buttons, then the form.

**Data:** the support email and phone come from `GET /api/config`. WhatsApp
number, hours and the form endpoint are not available yet (backend request
section 6). The WhatsApp number defaults to the support phone number and the
hours default to a constant, both flagged as my calls below.

## What is left to the builder

Component structure, filter and form implementation, the exact URL scheme for
filters and the return page, loading and skeleton states, copy beyond what is
written here, and the test plan. Reuse the landing page components
(`EventCard`, `EventRow`, `StatBand`-style cards, `PartnerStrip`,
`AlertsSignup`) and the data layer in `src/features`.

## My calls (check these)

These were not decided in conversation; I filled them in.
- The price bands in the All events filter.
- Next 7 days and Pick dates in the "When" filter.
- "Load more" instead of infinite scroll.
- Ticket details open as a dialog on desktop and inline on mobile.
- Good to know fields (doors, age, refunds, organizer) shown only when they
  exist.
- Coupon link in checkout, shown only if the backend supports coupons on
  carts.
- The path and query of `/checkout/return`.
- Support hours in West Africa Time, configurable.
- WhatsApp uses the support phone number until a separate one exists.
- The article page layout.

## Backend dependencies

All collected in `event-os-backend/docs/specs/website-landing-api.md`: event
card fields (price, venue, city, availability), server-side filtering,
banners, blog posts (with author) and article body, ticket `description` and
`includes`, the alerts signup, the contact form and support details, and the
CORS origin for the website.

## Verification

Each page needs: a check at 390px wide (no horizontal scroll, targets at least
44px); keyboard-only use; behaviour with the API down; and tests for the pure
logic (filters, price formatting, checkout state changes). Checkout needs an
end-to-end run against the gateway with Paystack test mode, including the
paid, pending and failed returns, an out-of-stock change and a free order.
