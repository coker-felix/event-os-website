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
| `VITE_ENABLE_MOCKS` | unset | Set to `true` to keep invented data in a production build |

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

## Structure

```
src/routes/            file-based routes (/, /events, /events/$eventId,
                       /events/$eventId/checkout, /checkout/return,
                       /blog, /blog/$slug, /contact, vendors, venues)
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
