# Attendee Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the All events, Event details, Checkout (with payment return), Blog (list and article) and Contact pages on top of the existing landing page.

**Architecture:** Each page is a TanStack Start route backed by a feature module in `src/features/<name>` that holds the API calls, types and the pure logic (filtering, ticket rules, checkout state, hours). UI components live in `src/components/<page>` and call only those modules. Pure logic gets vitest tests; UI is checked by typecheck, lint, build, server-rendered output and a 390px manual pass.

**Tech Stack:** TanStack Start/Router/Query, React 19, Tailwind v4, shadcn, zustand, vitest. Package manager pnpm.

**Spec:** `docs/superpowers/specs/2026-11-04-attendee-pages-design.md`. Backend asks: `event-os-backend/docs/specs/website-landing-api.md`.

## Global Constraints

- Mobile first: design at 390px wide; touch targets at least 44px; inputs and buttons in checkout at least 48px.
- Filters and shareable state live in the URL; city and saved events stay in the zustand store `usePreferences`.
- Invented data only behind `MOCKS_ENABLED` (`src/lib/mocks.ts`; on in dev, off in production builds). Real API values always win. Every mocked field must also be in the backend request doc.
- Availability is a level (`available | low | sold_out`), never a raw count, on the events list.
- Money: minor units formatted by `formatPrice(minor, currency)`; free is "Free".
- No countdown timers, fake scarcity, reviews or testimonials. No invented data in production.
- Accessibility: visible keyboard focus, labelled controls, dialogs trap focus and close on Esc, form errors announced to screen readers, reduced motion respected.
- Errors say what went wrong and what to do. Copy is sentence case; an action keeps one name throughout ("Get tickets", "Join waitlist", "Pay with Paystack", "Get free tickets").
- Every page works with the API slow or down (clear message, never blank) and sets its own `<title>` and description.
- Visual language is the landing page's: ink `#15122e`, paper `#f6f5fb`, violet `#5b3df5`, flame `#ff5a36`, line `#e2dff0`, mist `#6b6784`; Bricolage Grotesque display, Figtree body; ticket-stub card. No second style.
- Commit directly to `main` (project rule), one commit per task, no Claude attribution trailer.

Routes: `/events`, `/events/$eventId`, `/events/$eventId/checkout`, `/checkout/return`, `/blog`, `/blog/$slug`, `/contact`.

## Review Focus

Inputs the spec implies but its tests would not exercise; each is pinned by a test in the named task.

1. An event with no ticket types, or a cancelled one: show "Tickets aren't on sale" and no panel, never an empty panel (Task 4).
2. Double tap on Pay: one order, because the same Idempotency-Key is reused for the same cart state (Task 5).
3. Stored cart token expired or the cart gone (404): start a fresh cart and tell the buyer, never crash (Task 5).
4. Garbage in the events URL (`?prices=abc&cats=1,x&page=-3`): ignored, page renders (Task 2).
5. Return page opened with a missing or unknown reference: "We can't find that payment" with a Contact link (Task 8).

## Prerequisites

- API gateway running on `:8080` with `APP_ENV=local`.
- **Backend repo, one line:** add `"X-Cart-Token"` to `allowedHeaders` at `services/api-gateway/cmd/server/cors.go:44` (spec says `X-Cart-Token`; the list has `X-Cart-Tokens`) and extend its test. Without it the browser blocks every cart call. Also add this to the backend request doc.

## File structure

- `src/features/events/`: `availability.ts`, `list-search.ts`, `calendar.ts` (+ tests); modify `types.ts`, `enrich.ts`.
- `src/features/tickets/`: `types.ts`, `state.ts`, `queries.ts`, `mocks.ts` (+ tests).
- `src/features/checkout/`: `types.ts`, `api.ts`, `errors.ts`, `attempt.ts`, `validation.ts`, `start.ts`, `order-status.ts` (+ tests); `src/stores/carts.ts`.
- `src/features/blog/` (extend), `src/features/contact/`: `hours.ts`, `form.ts`, `config.ts` (+ tests).
- `src/components/{events,event-details,checkout,blog,contact}/` and the seven route files.

---

### Task 1: Availability level on event cards

**Files:** Create `src/features/events/availability.ts`, `availability.test.ts`. Modify `src/features/events/types.ts`, `enrich.ts`, `filters.test.ts`, `src/components/landing/event-card.tsx`.

**Interfaces:**
- Produces: `type Availability = 'available' | 'low' | 'sold_out'`; `availabilityBadge(a: Availability | undefined): 'Sold out' | 'Selling fast' | null`. `PublicEvent.availability?: Availability` replaces `ticketsLeft` and `soldOut`.

- [ ] **Step 1: Failing tests** in `availability.test.ts`: `availabilityBadge('sold_out')` is `'Sold out'`; `'low'` is `'Selling fast'`; `'available'` and `undefined` are `null`. In `filters.test.ts`, replace the `soldOut` expectation with: `withEventExtras` keeps a real `availability: 'low'` and, for a fixed id, returns the same `availability` twice.
- [ ] **Step 2:** `pnpm exec vitest run src/features/events` fails (module missing).
- [ ] **Step 3:** Implement `availability.ts`; in `types.ts` remove `ticketsLeft`/`soldOut` and add `availability`; in `enrich.ts` mock it from the hash (`h % 7 === 0` sold_out, `h % 5 === 0` low, else available); in `event-card.tsx` use `availabilityBadge` for the badge and show "Join waitlist" when `sold_out`; drop `LOW_STOCK` and the "Only N left" text.
- [ ] **Step 4:** `pnpm exec vitest run && pnpm exec tsc --noEmit && pnpm exec eslint src` pass.
- [ ] **Step 5:** `git add -A && git commit -m "Show availability level instead of ticket counts on event cards"`.

### Task 2: Events search model (URL state, filtering, facets)

**Files:** Create `src/features/events/list-search.ts`, `list-search.test.ts`. Modify `types.ts` (add `createdAt?: number | string`).

**Interfaces:**
- Produces:
  - `PRICE_BANDS`: `{id:'free'|'u10'|'10-25'|'o25', label, min, max}[]` in minor units (free 0..0; u10 1..999_999; 10-25 1_000_000..2_500_000; o25 2_500_001..Infinity).
  - `interface EventsSearch { q?: string; cities?: string[]; when?: 'tonight'|'weekend'|'week'|'range'; from?: string; to?: string; prices?: PriceBandId[]; cats?: number[]; formats?: ('in_person'|'virtual'|'hybrid')[]; sort?: 'soonest'|'newest'|'price'; view?: 'grid'|'list'; page?: number }` (`from`/`to` are `YYYY-MM-DD`).
  - `validateEventsSearch(raw: Record<string, unknown>): EventsSearch` (accepts arrays or comma-separated strings; drops anything invalid).
  - `applyEventsSearch(events: PublicEvent[], s: EventsSearch, names: Map<number,string>, now: number): PublicEvent[]` (filter then sort; default sort soonest; price sort puts unknown price last).
  - `facetCounts(events, s, names, now)` returning counts per option, each computed from events matching every filter except that option's own facet.
  - `activeFilterChips(s, names): {key: string; label: string; remove: (s: EventsSearch) => EventsSearch}[]`.
  - `PAGE_SIZE = 12`; `paginate<T>(items: T[], page?: number): { items: T[]; hasMore: boolean }`.
- Consumes: `matchesQuick`, `matchesQuery`, `citiesOf` from `filters.ts`; `toDate`, `zone` from `format.ts`.

- [ ] **Step 1: Failing tests** in `list-search.test.ts`: `validateEventsSearch({ prices: 'abc', cats: '1,x', page: -3, sort: 'nope' })` returns `{}` plus `cats: [1]`; arrays and comma strings both parse; `applyEventsSearch` filters by city list, price band (unknown price never matches a band), format, category and `range` dates inclusive in the event's timezone; sorts `price` ascending with unknown last; `facetCounts` for cities ignores the city filter but respects the category filter; `activeFilterChips` removes one value without touching others; `paginate` returns 12 items and `hasMore` for page 1 of 30.
- [ ] **Step 2:** run the file; fails.
- [ ] **Step 3:** Implement. Reuse `filters.ts` helpers rather than duplicating them.
- [ ] **Step 4:** `pnpm exec vitest run src/features/events` passes.
- [ ] **Step 5:** commit `Add events list search model`.

### Task 3: All events page

**Files:** Create `src/components/events/{filter-panel,filter-sheet,active-filters,results-header,event-list-row}.tsx`. Modify `src/routes/_attendee/events/index.tsx`. Add shadcn `sheet` and `checkbox` (`pnpm dlx shadcn@latest add sheet checkbox`).

**Interfaces:**
- Consumes: Task 2 exports; `eventsQuery`, `categoriesQuery`; `EventCard`; `usePreferences` (default city).
- Produces: route `/events` with `validateSearch: validateEventsSearch` and a loader that warms `eventsQuery`/`categoriesQuery` with `Promise.allSettled`.

- [ ] **Step 1:** `FilterPanel({ search, onChange, counts, categories, cities })` renders City, When (Tonight, This weekend, Next 7 days, Pick dates), Price, Category, Format as checkbox groups with counts; used inside both the desktop sidebar and `FilterSheet` (bottom sheet, "Show N events" button, "Clear all").
- [ ] **Step 2:** Route: desktop sidebar plus results; mobile search box, "Filters" button with active-count badge, sort control; `ActiveFilters` chips and "Clear all"; `ResultsHeader` ("14 events in Lagos", sort menu, Grid/List toggle); grid of `EventCard` or `EventListRow`; "Load more events" button increments `page` in the URL; empty state with "Clear all filters" and "Notify me" (links to `/#alerts`, add `id="alerts"` to the landing `AlertsSignup`); API-failure state with "Try again".
- [ ] **Step 3:** Set `head` title "All events | Event OS" and a description.
- [ ] **Step 4:** Verify: `pnpm exec tsc --noEmit && pnpm exec eslint src && pnpm build`; start `pnpm dev` and `curl -s localhost:3000/events` contains "events" heading and a filter label; `curl "localhost:3000/events?prices=abc&page=-3"` returns 200 or a 307 to a clean URL; at 390px no horizontal scroll and every control at least 44px.
- [ ] **Step 5:** commit `Build all events page`.

### Task 4: Ticket model and rules

**Files:** Create `src/features/tickets/{types,state,queries,mocks}.ts`, `state.test.ts`.

**Interfaces:**
- Produces:
  - `PublicTicketType` per `components.schemas.PublicTicketType` plus `description?: string` and `includes?: string[]`; `VolumeTier` per `components.schemas.VolumeTier`; `PublicEventPage { event: PublicEvent; ticketTypes: PublicTicketType[]; sponsors: EventSponsor[]; questionnaire?: PublicQuestionnaire }` (types read from `docs/api/website.openapi.yaml` in the backend repo).
  - `ticketStatus(t, nowSec): 'buyable'|'sold_out'|'upcoming'|'ended'` (`available <= 0` is sold_out; before `saleStartAt` upcoming; after `saleEndAt` ended).
  - `qtyBounds(t): {min:number; max:number}`; `clampQty(t, qty): number` (0 allowed, otherwise within bounds; max is the smallest of `maxPerOrder`, `maxPerBuyer`, `available`, ignoring zeros meaning unlimited).
  - `volumeHint(t, qty, currency): string | null` (only once a tier applies, for example "Buying 4 saves you 10%: -₦3,200").
  - `isLow(t): boolean` (`available` at or below 20, a named constant).
  - `eventSaleState(page, nowSec): 'on_sale'|'free'|'not_on_sale'|'cancelled'`.
  - `selectedLines(qtys: Record<string, number>): {ticketTypeId: string; qty: number}[]`; `subtotalMinor(types, qtys): number`.
  - `eventPageQuery(eventId: string)` (`GET /api/v1/events/{eventId}`, applies `withTicketExtras`); `withTicketExtras(t): PublicTicketType` in `mocks.ts` adds a stable description and `includes` when missing and mocks are enabled, and `mockTicketTypes(eventId)` supplies General, Couple pass (admits 2), VIP sold out and Early bird upcoming when a published event has none.
- Consumes: `formatPrice`, `MOCKS_ENABLED`, `hash`.

- [ ] **Step 1: Failing tests** in `state.test.ts`: status for each of the four cases; `clampQty` respects `minPerOrder`, `maxPerOrder`, `available` and returns 0 for 0; `volumeHint` is null below the tier and text at it; `eventSaleState` returns `not_on_sale` for an empty `ticketTypes` array, `cancelled` for event status cancelled, `free` when every buyable type is price 0 (**pins Review Focus 1**); `selectedLines` drops zero quantities.
- [ ] **Step 2:** run; fails.
- [ ] **Step 3:** Implement `types.ts`, `state.ts`, `queries.ts`, `mocks.ts`.
- [ ] **Step 4:** `pnpm exec vitest run src/features/tickets && pnpm exec tsc --noEmit` pass.
- [ ] **Step 5:** commit `Add ticket model and selection rules`.

### Task 5: Checkout data layer

**Files:** Modify `src/lib/api.ts`. Create `src/features/checkout/{types,api,errors,attempt,validation,start}.ts` with tests for `errors`, `attempt`, `validation`; `src/stores/carts.ts`.

**Interfaces:**
- Produces:
  - `apiRequest<T>(method: 'GET'|'POST'|'PUT'|'PATCH'|'DELETE', path, opts?: { body?: unknown; headers?: Record<string,string>; signal?; timeoutMs? }): Promise<T>`; `ApiError` gains `body: unknown`. `apiGet`/`apiPost` become thin wrappers.
  - `useCarts` (persisted zustand, skipHydration like `usePreferences`): `byEvent: Record<string, { cartId: string; token: string }>`, `setCart(eventId, cart)`, `clearCart(eventId)`.
  - `Cart`, `CartQuoteLine`, `CheckoutResult` (`order_id`, `total`, `currency`, `status: 'paid'|'pending'`, `authorization_url?`, `paystack_ref?`) per the OpenAPI schemas.
  - `createCart(eventId, lines, contact?)`, `getCart(cartId, token)`, `setCartLine(cartId, token, ticketTypeId, qty, expectedRevision?)`, `updateContact(cartId, token, contact)`, `checkoutCart(cartId, token, body, idempotencyKey)`; all send `X-Cart-Token`.
  - `startCheckout(eventId, lines): Promise<{ cartId: string }>` creates a cart, stores the token, returns the id.
  - `type CheckoutIssue = {kind:'requote'} | {kind:'inventory'; message:string} | {kind:'questionnaire_stale'; questionnaire: unknown} | {kind:'unsupported_location'; reason:string} | {kind:'cart_missing'} | {kind:'network'} | {kind:'unknown'}`; `classifyCheckoutError(err: unknown): CheckoutIssue`.
  - `createAttemptTracker(): { keyFor(fingerprint: string): string }`: same fingerprint returns the same key; a new fingerprint returns a new key.
  - `validateContact({phone,email}): {ok:true} | {ok:false; errors: {contact?: string}}` (at least one, valid format, reuse `parseContact`); `validateAnswers(questions, answers): Record<string,string>` (required, waiver must be accepted).

- [ ] **Step 1: Failing tests:** `classifyCheckoutError` maps 409 `{requoteRequired:true}` to requote, 409 `{questionnaireStale:true, ...}` to questionnaire_stale, 409 other to inventory, 422 `{error:'unsupported_jurisdiction'}` to unsupported_location, 404 to cart_missing (**pins Review Focus 3**), a thrown `TypeError` to network; `createAttemptTracker` returns an equal key for two calls with one fingerprint and a different key after the fingerprint changes (**pins Review Focus 2**); `validateContact` rejects empty, accepts phone only and email only; `validateAnswers` flags a missing required answer and an unaccepted waiver.
- [ ] **Step 2:** run; fails.
- [ ] **Step 3:** Implement. Mock nothing here: payments run against the real gateway.
- [ ] **Step 4:** `pnpm exec vitest run && pnpm exec tsc --noEmit && pnpm exec eslint src` pass.
- [ ] **Step 5:** commit `Add checkout data layer`.

### Task 6: Event details page

**Files:** Create `src/features/events/calendar.ts`, `calendar.test.ts`; `src/components/event-details/{event-hero,key-facts,ticket-panel,ticket-card,ticket-details,ticket-sheet,mobile-buy-bar,sponsors,similar-events}.tsx`. Modify `src/routes/_attendee/events/$eventId/index.tsx`. Add shadcn `dialog`.

**Interfaces:**
- Produces: `calendarLinks(event: PublicEvent, venue?: string): { google: string; ics: string }` (`ics` is a `data:` URL).
- Consumes: Task 4 (`eventPageQuery`, `ticketStatus`, `qtyBounds`, `clampQty`, `volumeHint`, `isLow`, `eventSaleState`, `selectedLines`, `subtotalMinor`) and Task 5 (`startCheckout`).

- [ ] **Step 1: Failing test:** `calendarLinks` for a fixed event returns a Google URL with start and end in UTC `YYYYMMDDTHHMMSSZ` and an ICS containing `BEGIN:VEVENT`, `SUMMARY:<title>` and `DTSTART`.
- [ ] **Step 2:** run; fails. **Step 3:** implement `calendar.ts`.
- [ ] **Step 4:** Build the page per the spec section 2: hero (organizer image and accent, category chip, Save heart using `usePreferences`, Share via `navigator.share` with copy-link fallback); key facts with calendar link and Map link; About with "Read more"; Good to know (only existing fields); sponsors by tier; similar events (same category, three cards). `TicketPanel` is sticky on desktop (about 400px), one `TicketCard` per buyable type with description line, price, 44px stepper, "Selling fast" via `isLow`, volume hint, bundle label, and a "Details" button (info icon, `aria-label="About {name}"`) that opens a `Dialog` on desktop and expands inline inside the sheet on mobile; "Other tickets (N)" section for sold out (with "Join waitlist" opening a phone or email field that posts to `/api/v1/waitlist`), upcoming and ended types; footer total and "Get tickets · ₦x", which calls `startCheckout` and navigates to `/events/$eventId/checkout`; free events show "RSVP · Free"; "Support this event" link when donations are enabled. `eventSaleState` of `not_on_sale` or `cancelled` shows "Tickets aren't on sale" instead of the panel. `MobileBuyBar` is pinned at the bottom and opens `TicketSheet`.
- [ ] **Step 5:** Verify: `pnpm exec vitest run && pnpm exec tsc --noEmit && pnpm exec eslint src && pnpm build`; with the dev server running, `curl localhost:3000/events/<real id>` is 200 and contains the title; 404 for an unknown id shows a not-found message; at 390px the bar and sheet work and nothing scrolls sideways.
- [ ] **Step 6:** commit `Build event details page`.

### Task 7: Checkout page

**Files:** Create `src/components/checkout/{contact-section,questions-section,billing-section,summary,pay-bar,change-notice}.tsx`. Modify `src/routes/_attendee/events/$eventId/checkout.tsx`.

**Interfaces:** Consumes Task 5 (`getCart`, `updateContact`, `checkoutCart`, `classifyCheckoutError`, `createAttemptTracker`, `validateContact`, `validateAnswers`, `useCarts`) and Task 4 (`eventPageQuery` for the questionnaire and event card).

- [ ] **Step 1:** Route loads the stored cart for the event; no stored cart or a 404 redirects to `/events/$eventId` with a visible notice "Your cart expired. Pick your tickets again." Show the event card with tickets and an "Edit" link back.
- [ ] **Step 2:** Sections in order: Your details (phone, email, "Send my tickets by" SMS or email defaulting to what was entered, optional "Sign in" link), A few questions (only when a questionnaire exists; one field per question type; waiver checkbox with visible text), Billing country (only when a virtual line needs it; dropdown from the countries query), Summary (tickets, volume discount, fees and tax, total from the cart quote; no coupon link, because the cart API documents no coupons: add it only when the backend supports them). Inputs at least 48px with `inputmode`/`autocomplete` set.
- [ ] **Step 3:** `PayBar` pinned on mobile with the total and "Pay with Paystack" ("Get free tickets" when total is 0); desktop summary is a sticky card. On submit: validate, then `checkoutCart` with `tracker.keyFor(cart.quoteRevision + contact)` as the key; disable the button while pending. `authorization_url` goes to `window.location.assign`; `status: 'paid'` goes to `/checkout/return?order=<id>`.
- [ ] **Step 4:** `ChangeNotice` renders each `CheckoutIssue`: requote and inventory show what changed, refresh the cart and make the button "Confirm to pay" until acknowledged; questionnaire_stale shows the new questions and scrolls to them; unsupported_location shows "We can't sell tickets to this location yet" with a Contact link; network shows "Check your connection and try again" with a retry.
- [ ] **Step 5:** Verify: typecheck, lint, build; against the gateway in Paystack test mode, run a paid order, a free order, a double tap (one order only), a changed-stock notice and an expired cart; at 390px every input is at least 48px and the pay bar never covers a field.
- [ ] **Step 6:** commit `Build checkout page`.

### Task 8: Payment return page

**Files:** Create `src/features/checkout/order-status.ts`, `order-status.test.ts`, `src/routes/_attendee/checkout/return.tsx`. Modify `src/features/checkout/types.ts`.

**Interfaces:**
- Produces: `parseReturnParams(search: Record<string, unknown>): { reference?: string; order?: string; outcome?: 'paid'|'pending'|'failed' }` (`outcome` honoured only when `MOCKS_ENABLED`); `type OrderStatus = { status: 'paid'|'pending'|'failed'; orderId: string; total: number; currency: string; deliveredTo?: string }`; `orderStatusQuery(ref: {reference?: string; order?: string})` (`GET /api/v1/orders/status?reference=` with the cart token; proposed endpoint); `nextPollDelay(attempt: number): number | null` (2s, 3s, 5s, then every 10s, `null` after 3 minutes).
- Consumes: `useCarts`, `apiRequest`.

- [ ] **Step 1: Failing tests:** `parseReturnParams({})` has no reference or order (**pins Review Focus 5**); `parseReturnParams({outcome:'paid'})` ignores `outcome` when mocks are off; `nextPollDelay(0)` is 2000 and returns `null` once total waiting passes 180 seconds.
- [ ] **Step 2:** run; fails. **Step 3:** implement.
- [ ] **Step 4:** Page: paid shows "You're going!", order number, total, ticket stub with QR, where it was sent, "Add to calendar" and "Find my tickets"; pending shows "Confirming your payment…", polls with `nextPollDelay`, and says a text arrives when it clears and the page can be closed; failed shows "Payment didn't go through. You haven't been charged. Your tickets are still in your cart." with "Try again" (back to checkout, cart kept) and "Contact us"; missing or unknown reference shows "We can't find that payment" with a Contact link. With mocks on and the endpoint missing, use `outcome` from the URL.
- [ ] **Step 5:** Add the order-status endpoint and the Paystack callback URL (must point at `/checkout/return`) to `event-os-backend/docs/specs/website-landing-api.md`.
- [ ] **Step 6:** `pnpm exec vitest run && pnpm exec tsc --noEmit && pnpm exec eslint src && pnpm build` pass; commit `Build payment return page`.

### Task 9: Blog list

**Files:** Modify `src/features/blog/types.ts` (add `author?: string`), `queries.ts`, `src/features/mocks/posts.ts`, `src/routes/_attendee/blog/index.tsx`. Create `src/features/blog/utils.ts`, `utils.test.ts`, `src/components/blog/{featured-post,post-card,category-chips}.tsx`.

**Interfaces:**
- Produces: `postsQuery(params: { category?: string; page: number })` (`GET /api/v1/blog/posts?category=&limit=12&offset=`, falls back to `mockPosts()` in dev, which now returns nine posts); `categoriesOfPosts(posts): string[]` (distinct, in first-seen order); `splitFeatured(posts): { featured?: BlogPost; rest: BlogPost[] }` (first post is featured).
- Consumes: `PostCard` reused from the landing `FeaturedPosts` (move it to `src/components/blog/post-card.tsx` and import it there).

- [ ] **Step 1: Failing tests:** `categoriesOfPosts` order and dedupe; `splitFeatured([])` has no featured; `splitFeatured` of three posts returns the first as featured and two in `rest`.
- [ ] **Step 2:** run; fails. **Step 3:** implement; extend `mockPosts` to nine posts across Guides, Vendors, Venues, News.
- [ ] **Step 4:** Route: featured card on top, category chips (scroll sideways on mobile, filter via `?category=`), three-column grid (one column on mobile), "Load more posts"; API failure shows a retry message; `head` title "Blog | Event OS".
- [ ] **Step 5:** `pnpm exec vitest run && pnpm exec tsc --noEmit && pnpm exec eslint src && pnpm build` pass; `curl localhost:3000/blog` is 200; commit `Build blog list page`.

### Task 10: Blog article

**Files:** Modify `src/features/blog/{types,queries,utils}.ts`, `utils.test.ts`, `src/features/mocks/posts.ts`, `src/routes/_attendee/blog/$slug.tsx`. Create `src/components/blog/article-body.tsx`.

**Interfaces:**
- Produces: `type BlogArticle = BlogPost & { body: string }`; `articleQuery(slug)` (`GET /api/v1/blog/posts/{slug}`, mock fallback `mockArticle(slug)`); `articleParagraphs(body: string): string[]` (split on blank lines, trimmed, empties dropped); `relatedPosts(posts: BlogPost[], current: BlogPost, n = 3): BlogPost[]` (same category first, never the current post).
- Consumes: `postsQuery`, `eventsQuery`, `EventCard`, `PartnerStrip`.

- [ ] **Step 1: Failing tests:** `articleParagraphs('a\n\n\n b \n\nc')` is `['a','b','c']`; `relatedPosts` excludes the current post, prefers the same category and returns at most `n`.
- [ ] **Step 2:** run; fails. **Step 3:** implement.
- [ ] **Step 4:** Page: back link, category, title, date, reading time, author, cover; body rendered as paragraphs (text only, never raw HTML) in a 65-character column at 18px on mobile; after the body, the next three upcoming events when any exist, Share and Copy link, "Keep reading" with `relatedPosts`, and the `PartnerStrip`; unknown slug shows a not-found message with a link to the blog; `head` sets the post title and excerpt.
- [ ] **Step 5:** verify as Task 9 plus `curl localhost:3000/blog/<mock slug>` contains the title; commit `Build blog article page`.

### Task 11: Contact page

**Files:** Create `src/features/contact/{hours,form,config}.ts`, `hours.test.ts`, `form.test.ts`, `src/components/contact/{quick-answers,contact-form,reach-us,not-an-attendee}.tsx`. Modify `src/routes/_attendee/contact.tsx`.

**Interfaces:**
- Produces:
  - `SUPPORT_HOURS = { days: [1,2,3,4,5], open: '09:00', close: '18:00', timeZone: 'Africa/Lagos' }`; `supportStatus(now: Date, hours = SUPPORT_HOURS): { open: boolean; label: string }` (labels: "We're online now"; "Back Monday at 9 AM" style for the next opening).
  - `CONTACT_TOPICS`: `tickets_orders | refunds | vendor | venue | organizer | other` with labels; `validateContactForm(input): { ok: true; value: ContactInput } | { ok: false; errors: Partial<Record<'topic'|'name'|'contact'|'message', string>> }` (message required and at most 2000 characters; contact is an email or phone via `parseContact`); `submitContact(value): Promise<{ reference: string }>` (`POST /api/v1/contact`; in dev with mocks and no endpoint, returns `C-` plus five digits from `hash`).
  - `siteConfigQuery` (`GET /api/config`, fields `supportEmail`, `supportPhone`, optional `supportWhatsapp`); `whatsappLink(number)` (`https://wa.me/<digits>`), `telLink(number)`, `mailtoLink(email)`. WhatsApp falls back to `supportPhone`.
- Consumes: `parseContact` from `features/alerts/subscribe.ts`.

- [ ] **Step 1: Failing tests:** `supportStatus`: Monday 08:59 Lagos is closed "Back today at 9 AM"; Wednesday 12:00 is open; Friday 18:01 is closed "Back Monday at 9 AM"; Saturday 10:00 is closed "Back Monday at 9 AM". `validateContactForm`: empty message, a 2001-character message, and `contact: 'abc'` each fail with that field's error; a valid input passes. Link builders: `whatsappLink('+234 801 234 5678')` is `https://wa.me/2348012345678`; `telLink` keeps the leading plus.
- [ ] **Step 2:** run; fails. **Step 3:** implement.
- [ ] **Step 4:** Page per spec section 5: "We usually reply within one working day" plus the live status from `supportStatus`; quick answers (Find my tickets → `/tickets/help`, FAQs → `/#faqs` with `id="faqs"` added to the landing `FaqSection`, Refunds and orders → the FAQ entry); form with `aria-live` field errors and a success state showing the reference; WhatsApp, phone and email buttons (one tap on mobile); "Not an attendee?" links to `/vendors`, `/venues` and the organizer entry; `head` title "Contact us | Event OS". Add the contact endpoint and config fields to the backend request (already written; confirm it matches).
- [ ] **Step 5:** `pnpm exec vitest run && pnpm exec tsc --noEmit && pnpm exec eslint src && pnpm build` pass; `curl localhost:3000/contact` is 200 and contains "Contact us"; at 390px the contact buttons are at least 44px; commit `Build contact page`.

### Task 12: Whole-site verification

**Files:** Modify `README.md` (replace the starter text with project setup, env vars `VITE_API_URL` and `VITE_ENABLE_MOCKS`, scripts, and the backend prerequisites).

- [ ] **Step 1:** Run `pnpm exec vitest run && pnpm exec tsc --noEmit && pnpm exec eslint src && pnpm build`; all pass.
- [ ] **Step 2:** With the gateway and dev server running, `curl` each of the seven routes and confirm 200 and a unique `<title>`; repeat with the gateway stopped and confirm every route still returns 200 with a clear message.
- [ ] **Step 3:** At 390px walk the full path (landing, events with filters, an event, ticket sheet, checkout, return page), checking no horizontal scroll, targets at least 44px, keyboard-only reach of every control, and Esc closing every dialog.
- [ ] **Step 4:** Confirm a production build contains no mock data: `VITE_ENABLE_MOCKS` unset, `pnpm build`, then `grep -r "Rooftop Sunset" dist` returns nothing.
- [ ] **Step 5:** commit `Document setup and verify attendee pages`.
