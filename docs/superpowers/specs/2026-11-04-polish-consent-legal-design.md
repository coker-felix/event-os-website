# Dark mode, motion, cookie consent, footer and legal pages

Status: draft. Six requests in one design. You answered one question (draft the
legal pages from what the product does); every other call is a recommendation
and is listed under "My calls".

## Intent

Make the site feel finished and trustworthy: comfortable in the dark, smooth
to move through, honest about what it stores, easy to navigate from the
footer, and clear about the rules. The cookie work is also the first time the
site remembers a person's phone and email, so it has to be careful.

## 1. Cookie consent and what we store

We store almost nothing, and all of it in the browser. Registry (single source
of truth in code; the Cookies page is generated from it):

| Key | Kind | Category | Holds | Written when |
|---|---|---|---|---|
| `eos_consent` | cookie, 1 year, `SameSite=Lax` | Necessary | the choice (accepted or declined), version, date | the visitor chooses |
| `event-os:carts` | localStorage | Necessary | cart id and access token per event | tickets are chosen |
| `event-os:preferences` | localStorage | Preferences | chosen city, saved events | after Accept |
| `event-os:theme` | localStorage | Preferences | light, dark or system | after Accept |
| `event-os:contact` | localStorage | Preferences | phone, email, delivery channel | after Accept, when a checkout is started |

Rules:
- **Necessary** needs no consent (the consent record itself, and the cart so a
  checkout can resume). **Preferences** is written only after **Accept**.
- Before a choice, or after **Decline**, the site works fully but remembers
  nothing: city and saved events live in memory for the visit, the theme
  follows the device.
- **Decline** or **withdraw** deletes every Preferences key at once. Cart and
  consent record stay.
- A banner shows until a choice is made: Accept, Decline, and a link to the
  Cookies page. It does not block the page. **Cookie settings** in the footer
  reopens the choice and has **Forget my details**.
- Consent has a version; bumping it asks again.
- No analytics, advertising or tracking of any kind. The banner and Cookies
  page say so, and it stays true.

Remembered details at checkout: after Accept, starting payment saves phone,
email and delivery channel on that device only (never sent anywhere for this
purpose). Next time the fields are filled in. The checkout says "We'll remember
your phone and email on this device" with a **Forget my details** control.
A cart's own contact details win over remembered ones.

## 2. Dark mode

- Follows the device by default. A header button cycles System, Light, Dark
  (announced to screen readers). The choice is remembered only after Accept.
- No flash: a tiny script in the page head sets the theme before first paint.
- A second token set under `.dark`. The brand ink is used both as text and as
  dark panels, so in dark mode the text colour is a new `--foreground` and the
  panel colour is lifted so panels stay visible. `text-violet` becomes
  `text-violet-ink` everywhere, a lighter violet in dark mode, because the
  brand violet is too dim for small text on a dark page.
- A test reads the dark token values and fails if key pairs drop below WCAG AA
  contrast (4.5:1 for text).

## 3. Smooth scroll and animation

- Smooth scrolling is CSS only (no library): in-page links such as `#faqs`,
  and back to top. It is off when the device asks for reduced motion.
- A `Reveal` wrapper eases sections in as they scroll into view, with a short
  stagger for grids. Content is visible without JavaScript, nothing above the
  fold is hidden, and reduced motion shows everything at once. The hero fades
  up on load with CSS only.
- Sections that get it: landing event rows, stats, how it works, partner strip,
  blog cards, alerts, FAQ; vendors and venues scenarios, benefits, coming soon,
  steps, FAQ, closing panel; the card grids on callouts, directories and
  events; event details sections and similar events; the legal page contents.
  No count-up numbers (they flicker on first paint).

## 4. Footer

Columns: Explore, Vendors, Venues, Organizers (Create an event and Organizer
sign in, both to the portal), Help (ticket help, contact, FAQs), Legal (Terms,
Privacy, Cookies, Cookie settings). Plus a back-to-top link and the year. No
social links (we have none).

## 5. Legal pages

`/terms`, `/privacy` and `/cookies`, each with sections for **attendees,
vendors, event organizers and venue owners** (venue owners added because the
site has a venues section), filterable with `?for=` and linked from the footer,
checkout, the sign-up buttons' neighbours and each other.

Drafting rules, because these are legal documents and I am not a lawyer:
- Written only from what the product actually does: the data it collects
  (contact details at checkout, orders, waitlist and alert sign-ups, support
  messages, vendor and venue profiles and KYC through the portal), that card
  payment happens on Paystack's page, that ticket money is held and released
  after the event, that vendor payouts are held until KYC clears, that ratings
  are public.
- Anything that is a business or legal decision (company name, address,
  governing law, retention periods, refund and cancellation rules, minimum age,
  data-subject contact) is a visible placeholder `[To confirm: ...]`.
- A "Draft, pending legal review" notice shows on every page until
  `VITE_LEGAL_REVIEWED=true`. It does not promise payment protection, escrow
  for vendors or anything the vendors and venues pages mark "Coming soon".

## Non-goals

No analytics or tracking; no server-side storage of remembered details; no
accounts on the website; no real legal advice; no translation.

## My calls

- Consent is stored in a cookie; everything else in localStorage; "Preferences"
  is gated, "Necessary" is not.
- The theme choice counts as Preferences (gated), so before Accept it follows
  the device and resets on reload.
- Remembered details are saved when payment starts, not while typing.
- Header theme button cycles three states; no separate settings screen.
- Smooth scroll is CSS only; animation is a small in-house `Reveal`.
- Footer gets an Organizers column linking to the portal.
- Venue owners get a legal section even though you listed three audiences.
- Legal pages are one document per kind with audience sections, not nine pages.

## Verification

Tests for the pure logic: consent cookie parse and serialise, the gated
storage, the registry against the stores, remembered-details save, load and
clear, the checkout prefill rule, the dark token contrast, the stagger
timing, and the legal content (placeholders present, draft notice logic, no
banned phrases). Pages are checked by type-check, lint, build and rendered
output (every route, light and dark markup, consent states). A real browser
pass for the banner, the theme toggle and the animations is still needed.
