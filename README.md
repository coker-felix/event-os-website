# Event OS website

The attendee-facing website for Event OS: find events, get tickets, read the
blog, get support, and reach the vendor and venue products. Server-rendered
with TanStack Start (Router, Query), React 19, Tailwind v4, shadcn and zustand.

## Run it

```sh
pnpm install
pnpm dev          # http://localhost:3000
```

| Script | What it does |
|---|---|
| `pnpm dev` | Dev server on port 3000 |
| `pnpm build` | Production build into `dist/` |
| `pnpm test` | Unit tests (vitest) |
| `pnpm lint` | ESLint |

Typecheck with `pnpm exec tsc --noEmit`. Run all four (tests, types, lint,
build) before committing.

## Configuration

Copy `.env.example` to `.env` if you need to change anything.

| Variable | Default | Meaning |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8080` | Base URL of the Event OS API gateway |
| `VITE_PORTAL_URL` | `http://localhost:5173` | Where vendors and venues sign up and sign in (the portal, one app for every role). `VITE_VENDOR_PORTAL_URL` is the older name and still works |
| `VITE_ENABLE_MOCKS` | unset | Set to `true` to keep invented data in a production build |
| `VITE_LEGAL_REVIEWED` | unset | The Terms, Privacy and Cookies pages are drafts and show a "Draft, pending legal review" notice. Set to `true` only after a lawyer has signed them off and every `[To confirm: ...]` is resolved |

### Invented data

The backend does not provide everything the pages show yet (event price,
venue and availability, ticket descriptions, banners, blog posts, support
details, the alerts signup, the contact form, payment status). Until it does,
`src/features/mocks` and the `enrich`/`mocks` modules fill the gaps.

- **On** in `pnpm dev` and in tests. **Off** in a production build, unless
  `VITE_ENABLE_MOCKS=true`. It is a build-time switch (`__MOCKS_ENABLED__` in
  `vite.config.ts`), so with it off no mock is called and none is loaded.
- Real API values always win over invented ones.
- Everything that is invented is listed as a backend request in
  `event-os-backend/docs/specs/website-landing-api.md`.

### Organizers page

`/organizers` is the fourth product (Attendees, Vendors, Venues, Organizers). Its
copy is in `src/content/organizer-landing.ts`; the "Trusted by" brand list is
`src/content/trusted-brands.ts` (empty until you add real partners; hidden while
empty). The attendee landing page carries only a slim "Hosting an event?" band.
Public organizer profiles live at `/organizers/<id>` inside the same layout.
The copy states every organizer feature as available; the backend work that
makes those claims true is `event-os-backend/docs/specs/organizer-platform.md`.

### Cookies and browser storage

Everything the site keeps in the browser is listed in
`src/lib/storage-registry.ts`. The Cookies page is generated from it, and a
test fails if the source uses an `event-os:` key that is not in the registry.

| Key | Category | Holds |
|---|---|---|
| `eos_consent` (cookie, 1 year) | Necessary | the Accept or Decline choice |
| `event-os:carts` | Necessary | cart id and token per event |
| `event-os:preferences` | Preferences | city, saved events |
| `event-os:theme` | Preferences | light, dark or system |
| `event-os:contact` | Preferences | phone, email, delivery channel |

- **Preferences** keys are written only after Accept, through a gated storage
  (`createGatedStorage`). Decline, or "Forget my details", deletes them and
  empties the in-memory copy. On load, any Preferences key found without an
  Accept is deleted.
- Adding a new thing to store: add it to the registry first, then use the gated
  storage if it is a preference.
- To ask everyone again (for example after adding a new Preferences key), raise
  `CONSENT_VERSION` in `src/lib/consent.ts`.
- There is no analytics, advertising or tracking, and the copy says so. If that
  ever changes, the banner, Cookies page and Privacy page must change first.

### Discovery: organizers, past events, reviews, follow

Organizer profiles (`/organizers/<id>`), "Hosted by", past events with photos,
reviews, "Trending organizers", "Relive it" and "For you" read a proposed API
(backend request section 11). In dev, invented data stands in; in production
each section stays hidden until its endpoint answers.

- **Reviews** come only from verified ticket holders through a private link,
  `/review/<token>`. The page is `noindex`.
- **Follow** is an alerts sign-up for one organizer, plus a flag in the existing
  `event-os:preferences` key (written only after Accept).
- **For you** is worked out on the device from saved events and followed
  organizers (`src/features/discovery/recommend.ts`). Nothing is sent anywhere.
- Mock past events link to event ids that do not exist on the real API, so
  clicking one in dev shows a 404. Real ones need completed events to be served.

### Dark mode

Follows the device. The header button cycles System, Light, Dark; the choice is
remembered only after Accept. An inline script in the head sets the theme before
first paint (`themeScript` in `src/lib/theme.ts`). Dark tokens live under `.dark`
in `src/styles.css`; use `text-violet-ink` (not `text-violet`) for violet text.
`src/lib/contrast.test.ts` fails if a key colour pair drops below 4.5:1.

### Legal pages

`/terms`, `/privacy` and `/cookies` are drafts written from what the product
does. Business and legal decisions are `[To confirm: ...]` placeholders (search
`src/content/legal`). Set `VITE_LEGAL_REVIEWED=true` only after a lawyer has
signed them off and every placeholder is resolved.

## Running against the backend

The website calls the API gateway from both the server and the browser.

1. Start the gateway in dev mode so the browser may call it from `:3000`:
   `cd services/api-gateway && APP_ENV=local go run ./cmd/server`
   (or set `CORS_ALLOWED_ORIGINS=http://localhost:3000`).
2. Guest checkout sends the cart token as `X-Cart-Token`. The gateway's CORS
   list must include that header (it listed `X-Cart-Tokens`); see the backend
   request doc.
3. Carts need the organization's `mutable_carts` feature flag. With it off,
   `POST /api/v1/carts` answers 404 and checkout cannot start.
4. The payment return page needs an order-status endpoint and the Paystack
   callback URL set to `/checkout/return` (backend request section 8).
5. The vendors and venues pages send "Sign in", "Create profile" and "List your
   venue" to the portal (`event-os-ui`) at `VITE_PORTAL_URL`, which must be
   running for those links to work. The portal has no screen to apply to a
   callout or to send a venue booking request yet.

## Structure

```
src/routes/            file-based routes (/, /events, /events/$eventId,
                       /events/$eventId/checkout, /checkout/return,
                       /blog, /blog/$slug, /contact, the vendors section:
                       /vendors, /vendors/callouts, /vendors/directory,
                       /vendors/$vendorId, and the venues section: /venues,
                       /venues/directory, /venues/$venueId)
src/features/<name>/   API calls, types and pure logic (tested)
src/components/<name>/ UI for each page
src/stores/            zustand stores (city and saved events, carts)
docs/superpowers/      design spec and implementation plan
```

Routes load their data on the server (`loader`) and never fail the page when
the API is down: they render a clear message instead.

## Tests

`pnpm test` covers the logic that has edge cases: event filtering and URL
state, ticket rules, checkout error handling and idempotency, payment return,
blog helpers, and contact hours and validation. Pages are checked by
type-check, lint, build and rendered output; a browser pass at 390px wide is
still to do.
