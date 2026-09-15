# YATRA 2.0 — PROJECT REQUIREMENTS & PROGRESS TRACKER

> **Master document** — single source of truth. Contains the full project
> specification (§1–45), the progress tracker, the frontend conventions &
> file map (§46–50), and the complete session log (§52).
>
> **AGENT INSTRUCTION — KEEPING THIS FILE CURRENT:**
> After ANY task is completed, update this file in the same session:
>   1. Tick the checkbox in the **Priority Task Checklist**
>   2. Update the **Phase Status / Booking Wizard progress** numbers
>   3. Add a dated line at the TOP of the **Progress Log** (newest first)
>   4. Append a detailed entry to the **Session Log** (§52, newest first)
>   5. Update the `Last progress update:` date at the bottom
> Never mark something complete that has not actually been built and verified.

- **Saved:** 2026-09-13 (Session 4) — from the author's complete project specification
- **Last progress update:** 2026-09-14 (Session 11)
- **Note (2026-09-14):** `project.md` (session log + frontend conventions) was
  merged into this file as §46–52 and deleted — this is now the ONLY tracker
  to read/update. Companion planning docs (read-only, do not modify here):
  `Yatra_2.0_Master_Plan.md` (admin panel + backend plan) and
  `Yatra_2.0_Backend_Roadmap.md` (phase-by-phase backend build order).

---

## ⭐ PROGRESS TRACKER

### Phase status

| Phase | Scope | Status |
|---|---|---|
| Phase 1 — Frontend | HTML/CSS/vanilla JS, mock data | **IN PROGRESS (~75%)** |
| Phase 2 — Backend | Java + Spring MVC + Hibernate + MySQL (N-tier) | NOT STARTED (blocked until frontend booking workflow is stable) |
| Phase 3 — Integration | Connect frontend to live Spring API, CORS, Postman | NOT STARTED |

### Booking wizard progress (the core requirement)

| Step | Page | Status |
|---|---|---|
| 0. Home + Search | home.html / homeLogged.html | ✅ DONE |
| 1. Select Flights | searchFlight.html *(author's page — replaces the spec's flightListing.html)* | ✅ DONE |
| 2. Passenger Details | booking.html | ✅ DONE (renders N Adult/Child forms from the search split; contact + every passenger validated; sidebar + `bookingData.flight` read `yatra_selected_flight`; timer persisted for payment.html) |
| 3. Payment Method | payment.html | ✅ DONE (eSewa → mock gateway is the only integrated path; other methods intentionally blocked for now) |
| 4. E-ticket | eticket.html | ✅ DONE (reached via the eSewa path; all data flows from the gateway transaction) |

### Completed frontend pages (Phase 1)

- [x] home.html (logged-out home)
- [x] homeLogged.html (logged-in home, 3-tab search, passenger modal, trip toggle, swap)
- [x] destinations.html (15 cards, Load More, stats, hero sky animation)
- [x] ticketStatus.html (self-contained, mock PNR/ticket lookup)
- [x] aboutUs.html (inline styles)
- [x] blog.html (filters, load more, newsletter)
- [x] careers.html (job filters, apply modal)
- [x] press.html (newsroom, media kit)
- [x] helpCenter.html (live search, accordion, votes)
- [x] contactUs.html (channels, hours, mock form)
- [x] refundPolicy.html (FAQ accordion, fee estimator)
- [x] login.html / signup.html (standalone, mock submit)
- [x] Shared design system: homeLogged.css + homeLogged.js (navbar, menu, footer, reveal, hero-sky, back-to-top, reduced-motion)
- [x] searchFlight.html/css/js — flight listing (author-built; date strip, fare classes, policy modal, select → booking.html)
- [x] booking.html/css/js — passenger details (contact + passenger forms, validation, SSR toggle, 15-min timer)
- [x] payment.html/css/js — payment method (card/bank options + eSewa, promo field, timer resumes from sessionStorage)
- [x] eticket.html/css/js — e-ticket (route/PNR/ticket no., fare breakdown, barcodes, print)
- [x] eSewa gateway mock: esewaLogin → esewaOtp → esewaBalance → esewaConfirm (captcha, OTP, wallet balance, txn saved)
- [ ] admin.html — ❌ intentionally unfinished (raw JSP placeholder, rework later)

### Protected files (current)

- [ ] admin.html — do not touch (user reworks later)

~~flightListing.html~~ — restriction removed 2026-09-14: the author built
`searchFlight.html` themselves, so it is the flight-listing page now. Only
`admin.html` remains protected.

### Priority Task Checklist (spec §43, in order)

> **Note (2026-09-14):** the author built the flight listing themselves as
> `searchFlight.*`, which supersedes spec items 1–3 and 5–7 in one page (filtering
> is done via the date strip + fare-class pills instead of spec-style filters/
pagination). Names differ from the spec (booking.html not passenger-details.html,
eticket.html not e-ticket.html) — treat the built pages as the reference.

- [x] 1. ~~Build flightListing.html~~ → built by author as searchFlight.html
- [x] 2. ~~Build mock flight data~~ → inline in searchFlight.js (schedules, fares, airlines)
- [x] 3. ~~Build `flights.js`~~ → logic lives in searchFlight.js
- [x] 4. Connect homeLogged search → flight listing *(redirect fixed 2026-09-14: homeLogged.js now maps `flightSearchData` to `./searchFlight.html?from=&to=&date=&pax=`)*
- [x] 5. Implement filtering → date strip (±3 days) + fare-class pills + price/refund live updates
- [x] 5b. Show airline on flight cards (logo images from Wikimedia in `assets/imgs/airline-*` with IATA-code-badge fallback, 5 real Nepali carriers: Buddha U4, Yeti YT, Shree S3, Sita ST, Summit RM); airline flows through `yatra_selected_flight` → eticket "Operated by" (done 2026-09-14)
- [x] 6. ~~Implement pagination~~ → N/A as built (4–6 flights per day, date strip browses days)
- [x] 7. Implement select flight → saves `yatra_selected_flight` to sessionStorage → passengerDetails (booking.html)
- [x] 8. ~~Build passenger-details.html~~ → built as booking.html
- [x] 9. ~~Build `booking.js`~~ → assets/js/booking.js
- [x] 10. Build payment.html
- [x] 11. Build `payment.js` (assets/js/payment.js)
- [x] 12. ~~Build e-ticket.html~~ → built as eticket.html
- [x] 13. ~~Build `ticket.js`~~ → assets/js/eticket.js
- [ ] 14. Build my-bookings.html
- [ ] 15. Build/rework admin.html
- [ ] 16. Complete mock API architecture (`config.js`, `mock-data.js`, `api.js`, `validation.js`, `auth.js`, `flights.js`, `booking.js`, `payment.js`, `ticket.js`)
- [ ] 17. Test entire frontend
- [ ] 18. Only then start Spring MVC backend

### Open decisions / notes for next sessions

- **Scope (confirmed by the author, 2026-09-14):** Yatra is a booking platform
  for browsing flights of Nepali airlines — Buddha Air, Yeti Airlines, etc. —
  and is **domestic-only for now** (international may come later). Keep mock
  data, airport codes, schedules, and airline names Nepali-domestic; this also
  aligns with the spec's §33 mock route list (KTM↔PKR, BIR, BHR, BWA, KEP…).
- **Dynamic-readiness (author instruction, 2026-09-14):** the frontend is static
  for now but MUST become dynamic when the Java backend starts, with minimal
  changes (spec §2/§41). Practical consequences for every page going forward:
  - all data flows through `api.js` (`apiGet`/`apiPost`) with the
    `USE_MOCK_DATA` / `API_BASE_URL` switch from `config.js` — never call
    `fetch` or branch on mock/real inside page JS (spec Rule 7);
  - mock responses must match the §36 API contract exactly so the Spring API can
    return the same shapes later;
  - sessionStorage keys (`flightSearchData`, `yatra_selected_flight`,
    `bookingData`, `paymentData`, `yatra_transaction`) mirror future API
    resources; a pending `bookingId` gets created in the mock layer per §31.2
    and passed by key — never invent new one-off keys;
  - no hardcoded flights/prices/passenger data in page JS — that belongs in
    `mock-data.js` so the same render functions consume API responses later
    (currently violated by `booking.js`'s hardcoded flight block);
  - pages render from data, not from markup assumptions, so a swapped data
    source can't break them.
- **Resolved (2026-09-14):** the flight-listing decision is settled — the author's
  `searchFlight.html` IS the flight listing. The only protected file left is
  `admin.html`. `flightListing.html` will never be created.
- **Resolved (2026-09-14, later in the day):** the full booking-wizard chain is
  now linked end-to-end: homeLogged search → `searchFlight.html?from=&to=&date=&pax=`
  → Select Departure Flight → `booking.html` → Continue → `payment.html` →
  (eSewa only) → `esewaLogin.html` → `esewaOtp.html` → `esewaBalance.html` →
  `esewaConfirm.html` → PAY (wallet or bank) → `eticket.html`. Card/bank/Khalti
  options on payment.html are intentionally blocked with an alert until their
  gateways are built (author decision: eSewa only for now).
- Remaining booking-flow gaps (still open):
  - booking.html's terms link points to `terms.html` (not created).
  - Infants (INF) are counted in the search but render no form and pay nothing (lap infants) — real fare rules for infants are a future step. Passengers data also has no per-pax DOB/gender fields yet.
  - `esewaOtpm.js` + `esewaOtpm.html` look like an older eSewa-OTP prototype
    (fixed NPR 8299.99, next page `esewaPayment.html` which doesn't exist) — no
    page references the JS; candidate for deletion if the author confirms.
- Spec §23 mentions a future "Hotel/stay" nav item — current navbar does not
  have it. Treat spec as target state; reconcile only when the author asks.
- Spec adds `--secondary: #f78383` to the palette (not currently used in CSS).

### Progress Log (newest first)

- **2026-09-14 — Session 11:** Tracker consolidation — `project.md` (agent
  session log + frontend conventions) merged into this file as §46–52
  (Project Context, Conventions, File Map, Do-Not-Touch, Open Items,
  Verification Checklist, Session Log) and deleted. Header updated: this is
  now the single master document + tracker (companion read-only planning
  docs: Yatra_2.0_Master_Plan.md + Yatra_2.0_Backend_Roadmap.md). Historical
  references to project.md's own §5/§6/§7 numbering renumbered 50/51/52;
  old log entries mentioning project.md left as history. No page code
  changed.
- **2026-09-14 — Session 10:** Airline display added to searchFlight cards
  (logo chip + name; 5 real Nepali carriers with correct IATA codes: Buddha U4,
  Yeti YT, Shree S3, Sita ST, Summit RM; per-date carrier mix; flight numbers
  match the operating carrier). Airline now flows through
  `yatra_selected_flight` → e-ticket "Operated by …" and the eSewa login
  flight-reference line. Real logo files fetched from Wikimedia/Wikipedia into
  `assets/imgs/airline-*` with an automatic code-badge fallback when a logo is
  missing/failed (fixed a lazy-loading bug that would have kept the fallback
  showing forever). Full project read + §6 verification: 18/18 JS OK, 19/19 CSS
  balanced, 0 missing assets, only terms.html still broken (pre-existing).
  Trackers synced: eSewa gateway pages documented on their V2 redesign CSS
  (esewaLoginV2.css / esewaV2.css); legacy gateway CSS (esewaOtp.css,
  esewaLogin.css, esewaBalance.css, esewaConfirm.css) verified unreferenced by
  any page — recorded as deletion candidates (kept as documented swap-back
  path). Open gaps unchanged: booking.js hardcoded flight + 1 passenger form,
  terms.html missing, esewaOtpm.js orphaned, my-bookings.html + mock API files
  not started. **Continued (same session): booking.js wired to the wizard —**
  renders N passenger forms (Adults + Children from `flightSearchData.passengers`,
  fallback to `yatra_selected_flight.passengers`; infants = lap, no form/fare),
  sidebar (route/time/date/pax/price/refund tag/breakdown) now comes from the
  selected flight (total = per-pax price × paying travellers, deterministic
  breakdown split), validation covers every passenger, `bookingData` saves the
  real flight object (airline/class/refundable/per-pax price/totalPrice),
  `bookingTimeLeft` is persisted so payment.html resumes the 15-min countdown.
  booking.html's static Passenger-1 card replaced by `#passengerForms` render
  target + sidebar IDs. Verified: node --check OK. Remaining gap: payment.html
  booking-details card is still static mock data.
- **2026-09-14 — Session 9:** eSewa gateway pages aligned with the site design
  system while keeping their intentional mock-gateway look: site font guaranteed
  on all form controls (button/input/select/textarea inherit Plus Jakarta
  Sans), neutral text/radius/transition tokens aliased from homeLogged.css in
  esewaOtp.css + esewaLogin.css (gateway `--esw-*` palette untouched). Also
  fixed a real regression: esewaBalance/esewaConfirm had lost the gateway
  chrome styles (top bar, card panel, buttons) when esewaPayment.css was
  dropped in Session 6 — both pages now link esewaOtp.css + esewaLogin.css
  before their own CSS. Also restored booking.html's right-hand Booking
  Details sidebar (base `.booking-grid` columns rule was lost in the Session 7
  dedup). Tracker accuracy: stale esewaOtpm.html file-map row
  removed (page doesn't exist; only orphan esewaOtpm.js). Verified: 18/18 JS
  OK, 17/17 CSS balanced, no missing assets; terms.html still the only broken
  link.
- **2026-09-14 — Session 8:** Design-consistency sweep (author flagged a
  different back-to-top button vs homeLogged). Audit showed palette, font and
  animations already unified site-wide; fixed the real drift: back-to-top icon
  unified to `fa-plane-up` on all 15 pages (was 3 variants: arrow-up on
  booking/payment, plane on searchFlight/eticket); Font Awesome CDN unified to
  6.7.2 everywhere (booking/payment/esewaOtp were on 6.5.1); scoped
  light-background fix for searchFlight `.btn-modify` (shared transparent
  `.btn-outline` was white-on-light). Verified: CSS balanced, no missing
  assets, only terms.html link still broken (pre-existing).
- **2026-09-14 — Session 7:** Wizard design unification completed (continuation
  of TODO-wizard-unification.md): all four booking-wizard pages
  (searchFlight/booking/payment/eticket) now run on the shared homeLogged.css
  system — dark `.wizard-band` + stepper, 15-min timer pill, slim ©-only
  `.wizard-footer`, 11-link icon mobile menus, back-to-top. Page CSS stripped of
  duplicated tokens/navbar/menu/buttons/reveal/stepper/footer/reduced-motion
  blocks (eticket.css 815 → 424 lines, payment.css 583 → 550); eticket keeps a
  scoped light-background `.et-actions .btn-outline` override; base img/a/ul/h
  rules kept page-side. Fixed broken booking.html logo
  (`yatra-logo-white.png` → `Yatra-logo-all-white.png`). Back-to-top JS wired in
  searchFlight.js + eticket.js. Verified: 18/18 JS `node --check` OK, 17/17 CSS
  brace-balanced, no missing assets; only broken link left is terms.html
  (pre-existing). esewa* gateway pages intentionally left self-styled.
- **2026-09-14 — Session 6:** Linked the whole booking-wizard chain (the
  author's main scope): homeLogged search now redirects to
  `./searchFlight.html?from=&to=&date=&pax=` (homeLogged.js); Select Departure
  Flight → `./booking.html` (searchFlight.js); booking continue → payment.html
  (already worked) and booking.js now also writes `yatra_passenger`; payment.js
  routes eSewa → `./esewaLogin.html` and blocks other methods with an alert
  (author decision: eSewa only for now); esewaLogin.js creates
  `yatra_pending_payment` and goes to esewaOtp (no txn until final pay);
  esewaBalance.js was written from scratch (amounts, user details, mock balance
  26.35, promos YATRA10/YATRA500, CONTINUE → esewaConfirm, CANCEL → search);
  esewaOtp → esewaBalance and esewaConfirm PAY → eticket already worked. Removed
  dead `esewaPayment.css` links from esewaBalance.html/esewaConfirm.html (base
  tokens come from esewaOtp.css). Verified: 18/18 JS `node --check` OK, CSS
  balanced, no missing assets; only broken link left is terms.html.
- **2026-09-14 — Session 5:** Tracker-sync only, no code changed. The author
  also confirmed the product scope: domestic-only flights on Nepali airlines
  (Buddha Air, Yeti Airlines, …); saved to both tracker files. The author
  built the whole booking wizard themselves: searchFlight.html (listing),
  booking.html (passenger details), payment.html, eticket.html, plus a 4-page
  mock eSewa gateway (login/captcha → OTP → balance → confirm). All 18 JS files
  pass `node --check`; all 17 CSS files brace-balanced. Checklist items 1–13
  marked complete (6 = N/A as built); flightListing restriction removed — the
  only protected file is now admin.html. Known gaps recorded in Open decisions:
  homeLogged→searchFlight redirect, passengerDetails.html vs booking.html
  handoff, missing terms.html, hardcoded flight in booking.js, missing
  esewaPayment.css, esewaBalance.js empty.
- **2026-09-13 — Session 4:** Saved the author's full project specification as
  this `requirements.md` (master spec + progress tracker). A temporary
  `work-completed.txt` summary was created the same session and later merged
  into `project.md` (user-journey flow) and deleted. No page code changed this
  session.
- **2026-09-13 — Session 3:** Removed one-off scroll-progress bar; promoted
  clouds+plane hero to shared `.hero-sky` on all 11 content pages; promoted
  back-to-top to shared CSS/JS on all pages; slimmed `destinations.js` to
  page-only logic; fixed `K+` count-up suffix; site-wide reduced-motion handling.
- **2026-09-13 — Session 2:** Full 14-page audit (JS syntax, CSS balance, links,
  assets all pass); fixed `homeLoggeds.js` script typo in homeLogged.html;
  created `project.md`.
- **2026-09-13 — Session 1:** Destinations page rescued: corrupted HTML/CSS fixed,
  `destinations.css` + `destinations.js` rewritten, header/footer aligned with site.

---

# FULL REQUIREMENTS (verbatim from the author's project specification)

## 1. PROJECT OVERVIEW

I am developing a university academic project called **Yatra 2.0**, a Nepali
flight booking platform. The project follows a strict **frontend-first,
multi-phase development approach**.

### Technology stack

### Phase 1 — Frontend

* Visual Studio Code
* HTML5
* CSS3
* Vanilla JavaScript
* No React
* No Vue
* No Angular
* No frontend framework
* No build step required
* Live Server for local development

### Phase 2 — Backend

* IntelliJ IDEA
* Java
* Maven
* Spring MVC
* Hibernate / JPA
* MySQL
* Mandatory N-Tier architecture:
  * Controller
  * Service
  * Repository

### Phase 3 — Integration

* Frontend connects to live Spring API
* CORS configured
* Postman used for API testing
* Final Postman collection exported as JSON

---

## 2. VERY IMPORTANT DEVELOPMENT APPROACH

The frontend must be completed and tested before implementing the backend.
The frontend should first work using **mock/dummy data**.
The final architecture should allow the frontend to switch from mock data to
the real backend with minimal changes.

The intended structure is:

```
Frontend pages
  ↓
JavaScript
  ↓
api.js
  ↓
Mock API OR Real API
```

For Phase 1:

```
USE_MOCK_DATA = true
```

For Phase 3:

```
USE_MOCK_DATA = false
```

The frontend should use the same JavaScript functions and data structures in
both cases.

DO NOT redesign the frontend when connecting the backend unless absolutely
necessary.

---

## 3. ORIGINAL REQUIRED BOOKING WORKFLOW

The main booking workflow is:

```
Home
 ↓
Flight Search
 ↓
Flight Results
 ↓
Select Flight
 ↓
Passenger Details
 ↓
Payment Method
 ↓
E-ticket Confirmation
```

This is the most important workflow in the project.

The complete four-step booking wizard is:

1. Select Flights
2. Passenger Details
3. Payment Method
4. E-ticket

---

## 4. CURRENT PROJECT STATUS

A significant amount of the frontend has already been completed.

DO NOT unnecessarily recreate, replace, or redesign completed pages.

Before modifying existing files, inspect the existing code and preserve the
current design system and functionality.

---

## 5. CURRENT FILES / PAGES COMPLETED

The current frontend contains these pages:

```text
homeLogged.html
home.html
destinations.html
ticketStatus.html
aboutUs.html
blog.html
careers.html
press.html
helpCenter.html
contactUs.html
refundPolicy.html
login.html
signup.html
admin.html
```

The completed pages and functionality are documented below.

---

## 6. home.html

This is the logged-out home page.

It provides:

* Main Yatra landing page
* Login action
* Sign Up action
* Same general visual style as the logged-in home
* Flight search presentation

The user can enter the authentication flow from here.

---

## 7. homeLogged.html

This is the main logged-in home page.

It contains a unified flight search box with three tabs:

### Tab 1 — Book a Flight

This is the main booking flow.

The user can:

* Select origin
* Select destination
* Swap origin and destination
* Select travel date
* Select one-way or round-trip
* Select passenger count
* Enter promo information if applicable
* Submit flight search

When the search form is submitted, the search information is saved into:

```text
sessionStorage
```

under:

```text
flightSearchData
```

Then the user is redirected toward the flight listing page.

### Tab 2 — Group Booking

This provides a group quote request flow.

It is currently a frontend/mock interaction.

### Tab 3 — Flight Status

This provides an entry point to flight/ticket status lookup.

---

## 8. PASSENGER SELECTOR

The logged-in home page contains a passenger selector modal.

It supports:

* Adults
* Children
* Infants

The existing JavaScript handles passenger counters and related UI behavior.
Do not break this functionality.

---

## 9. ONE-WAY / ROUND-TRIP

The flight search currently supports:

* One-way
* Round-trip

The existing implementation handles the UI without causing unnecessary layout
shifts. There is also a route swap button.

---

## 10. DESTINATIONS PAGE

File:

```text
destinations.html
```

Completed features:

* Hero section
* Ken Burns background animation
* Breadcrumb
* Scroll hint
* 15 destination cards
* Only 6 initially visible
* Load More functionality
* Loading spinner
* Staggered card animation
* Image hover zoom
* Tagline reveal
* Arrow animation
* Statistics section
* Count-up numbers
* CTA section
* Gradient fallback if images are unavailable
* Shared hero sky animation

Current statistics include examples such as:

```text
15 destinations
1,200+ flights
98%
50K+
```

Some destination cards intentionally reuse available images.

DO NOT create an `assets/imgs/dest/` folder unless specifically required.

---

## 11. TICKET STATUS PAGE

File:

```text
ticketStatus.html
```

This page is intentionally self-contained.

It supports:

* PNR lookup
* Ticket number lookup
* Loading state
* Not-found state
* Passenger fare breakdown

Current mock data includes:

```text
PNR: YTRA2X
Ticket: YTR-2026-001234
```

This is currently mock functionality.
Real API integration will happen later.

---

## 12. ABOUT US PAGE

File:

```text
aboutUs.html
```

Completed:

* Story section
* Values
* Timeline
* Team grid

It currently uses page-specific inline styles.

---

## 13. BLOG PAGE

File:

```text
blog.html
```

Completed:

* Travel stories
* Category filters
* Filter chips
* Load More
* Newsletter mock functionality

---

## 14. CAREERS PAGE

File:

```text
careers.html
```

Completed:

* Job listing cards
* Filters
* Apply modal
* Benefits section
* Floating badges / visual elements

---

## 15. PRESS PAGE

File:

```text
press.html
```

Completed:

* Press releases
* Media coverage
* Media kit downloads/mock functionality

---

## 16. HELP CENTER

File:

```text
helpCenter.html
```

Completed:

* Searchable FAQ
* Search clear button
* Popular search chips
* FAQ categories
* FAQ accordion
* Helpful votes

---

## 17. CONTACT US

File:

```text
contactUs.html
```

Completed:

* Contact channels
* Office hours
* Contact form
* Mock submission

---

## 18. REFUND POLICY

File:

```text
refundPolicy.html
```

Completed:

* Key facts
* Refund FAQ
* Accordion
* Refund fee estimator

---

## 19. LOGIN AND SIGNUP

Files:

```text
login.html
signup.html
```

These are standalone authentication pages.

They currently use:

* Same Yatra color palette
* Self-contained CSS
* Self-contained JavaScript
* No main site navbar/footer

Their current submission behavior is mock/frontend-only.

Later they should connect to:

```text
POST /api/auth/login
POST /api/auth/register
```

---

## 20. ADMIN PAGE

File:

```text
admin.html
```

CURRENT STATUS:

This is intentionally unfinished.
It currently contains a raw JSP placeholder.

Do NOT assume the admin page is complete.
It will need to be converted/reworked later.

The intended purpose is:

```text
Admin
 ↓
Manage Flights
```

---

## 21. SHARED DESIGN SYSTEM

The main shared stylesheet is:

```text
assets/css/homeLogged.css
```

It is the shared design system.

It contains:

* CSS variables
* Colors
* Border radii
* Shadows
* Transitions
* CSS reset
* Base typography
* Buttons
* Navbar
* Mobile menu
* Footer
* Payment partner section
* Reveal animations
* Hero sky
* Back-to-top button
* User chip/avatar
* Search box
* Search tabs

---

## 22. DESIGN COLORS

Current brand palette:

```css
primary: #0ea371
primary-dark: #086936
dark: #0f172a
off-white: #e8ecef
secondary: #f78383
```

The design generally uses:

* Green as the main Yatra brand color
* Dark navy/black for navbar/footer
* Rounded/pill-shaped buttons
* Glass/dark-glass navbar
* Modern travel website aesthetic
* Responsive layout

DO NOT randomly change the existing color system.

---

## 23. SHARED NAVBAR

The current navbar includes:

* Yatra logo
* Flight navigation
* Hotel/stay navigation
* Login/signup or logged-in user information
* Mobile hamburger menu

The mobile menu is full-screen.

The current navigation contains approximately 11 links.

The current page should be highlighted.

---

## 24. SHARED FOOTER

The footer is dark-themed.

It includes payment partner badges such as:

* eSewa
* Khalti
* ConnectIPS
* Nabil
* Visa

The footer is shared across the content pages.

---

## 25. SHARED ANIMATIONS

The website currently has:

### Navbar

* Darkens/deepens on scroll

### Mobile menu

* Hamburger → X icon transition

### Scroll reveal

Uses classes such as:

```text
.reveal
.delay-1
.delay-2
.delay-3
.delay-4
.delay-5
```

### Hero sky

Shared across content pages:

* Clouds drifting
* Plane flying through the hero

### Back-to-top

A floating plane button appears after approximately 500px scrolling.

### Count-up

Statistics animate from zero to their target value.

The implementation supports:

* Percentages
* K+ suffixes

### Reduced motion

The site respects:

```text
prefers-reduced-motion
```

and disables motion where appropriate.

DO NOT remove these features unless necessary.

---

## 26. CURRENT JAVASCRIPT STRUCTURE

Current shared JavaScript:

```text
assets/js/homeLogged.js
```

It handles:

1. Navbar scroll state
2. Mobile menu
3. Tab switching
4. Round-trip toggles
5. Route swapping
6. Passenger modal
7. Scroll reveal
8. Count-up statistics
9. Date picker minimum-date logic
10. Flight search submission
11. Group booking progressive disclosure
12. Back-to-top behavior
13. Destination slider

---

## 27. CURRENT PAGE-SPECIFIC JAVASCRIPT

Current JS files include:

```text
homeLogged.js
destinations.js
blog.js
careers.js
press.js
helpCenter.js
contactUs.js
refundPolicy.js
ticketStatus.js
```

`ticketStatus.js` is intentionally self-contained.

---

## 28. CURRENT CSS STRUCTURE

Current CSS files:

```text
assets/css/homeLogged.css
assets/css/destinations.css
assets/css/ticketStatus.css
assets/css/careers.css
assets/css/press.css
assets/css/blog.css
assets/css/helpCenter.css
assets/css/contactUs.css
assets/css/refundPolicy.css
```

`aboutUs.html`, `login.html`, and `signup.html` currently contain their own
styles.

---

## 29. ASSETS

Current image assets include:

```text
assets/imgs/
```

Important files include:

```text
Yatra-logo-all-white.png
Yatra-logo-black.png
header-top-image.jpg
mountainview.jpg
pokhara.jpg
bhairahawa.jpeg
nepalgunj.jpeg
biratnagar.png
esewa.webp
khalti.jpg
connectisp.avif
nabil.jpg
visa.jpg
```

There is currently no:

```text
assets/imgs/dest/
```

folder.

Several destination cards intentionally reuse existing images.

---

## 30. QUALITY CHECKS ALREADY COMPLETED

The project has already passed these checks:

### JavaScript

All current page scripts pass syntax checking.

Example:

```text
node --check
```

### CSS

Stylesheets are brace-balanced.

### Internal links

No broken internal `.html` links were found.

### Assets

No missing referenced assets were found.

### Structure

Navbar, mobile menu and footer are consistent across content pages.

DO NOT break these working areas while adding new functionality.

---

## 31. IMPORTANT CURRENT OPEN ITEMS

These are the main unfinished parts:

### 1. Flight Listing Page

This is the biggest current missing piece.

The search already stores:

```text
flightSearchData
```

but the actual flight listing page still needs to be built.

The intended page should:

* Read flight search information
* Display matching flights
* Use mock Nepali domestic flight data
* Support filtering
* Support pagination
* Allow selecting a flight
* Save the selected flight information in sessionStorage
* Continue to passenger details

### 2. Passenger Details Page

Needs to be built.

It should:

* Read selected flight
* Read passenger count
* Generate passenger forms
* Validate passenger information
* Submit/save passenger details
* Create/store a pending booking ID in mock mode
* Continue to payment

### 3. Payment Page

Needs to be built.

It should:

* Read booking ID
* Display booking/payment information
* Allow selecting payment method
* Support mock payment
* Initiate payment
* Verify mock payment
* Continue to e-ticket

### 4. E-ticket Page

Needs to be built.

It should:

* Read booking ID
* Display booking confirmation
* Display passenger information
* Display flight information
* Display PNR/ticket number
* Show fare/payment information
* Provide print functionality

### 5. Mock API architecture

The original project specification requires these files:

```text
config.js
mock-data.js
api.js
validation.js
auth.js
flights.js
booking.js
payment.js
ticket.js
```

These need to be implemented as the booking workflow is developed.

### 6. My Bookings

Required page:

```text
my-bookings.html
```

It should eventually show the user's booking history.

### 7. Admin

The current `admin.html` needs to be reworked later for flight management.

---

## 32. REQUIRED FINAL FRONTEND STRUCTURE

The target structure should eventually look approximately like this:

```text
yatra-frontend/
│
├── home.html
├── homeLogged.html
├── flightListing.html
├── passenger-details.html
├── payment.html
├── e-ticket.html
├── login.html
├── signup.html
├── my-bookings.html
├── admin.html
├── destinations.html
├── ticketStatus.html
├── aboutUs.html
├── blog.html
├── careers.html
├── press.html
├── helpCenter.html
├── contactUs.html
├── refundPolicy.html
│
├── assets/
│   ├── css/
│   │   ├── homeLogged.css
│   │   ├── destinations.css
│   │   ├── ticketStatus.css
│   │   ├── careers.css
│   │   ├── press.css
│   │   ├── blog.css
│   │   ├── helpCenter.css
│   │   ├── contactUs.css
│   │   └── refundPolicy.css
│   │
│   ├── js/
│   │   ├── homeLogged.js
│   │   ├── config.js
│   │   ├── mock-data.js
│   │   ├── api.js
│   │   ├── validation.js
│   │   ├── auth.js
│   │   ├── flights.js
│   │   ├── booking.js
│   │   ├── payment.js
│   │   ├── ticket.js
│   │   └── existing page-specific JS files
│   │
│   └── imgs/
│
└── README/project documentation
```

Do not rename existing files unnecessarily.

---

## 33. MOCK FLIGHT DATA

The project is for a Nepali airline booking platform.

Use realistic-looking **dummy domestic flights**.

Example routes:

```text
Kathmandu → Pokhara
Kathmandu → Biratnagar
Kathmandu → Bharatpur
Kathmandu → Bhairahawa
Kathmandu → Nepalgunj
Pokhara → Kathmandu
Biratnagar → Kathmandu
Bhairahawa → Kathmandu
Nepalgunj → Kathmandu
```

Example airlines:

```text
Buddha Air
Yeti Airlines
Shree Airlines
```

These are mock/demo flights.

Do not imply that the mock data represents real-time availability.

---

## 34. SESSION STORAGE

The booking wizard should use:

```text
sessionStorage
```

to pass information between static HTML pages.

At minimum:

### Step 1

Store:

```text
selectedFlightId
passengerCount
```

and/or the existing:

```text
flightSearchData
```

### Step 2

Store:

```text
bookingId
```

after creating the pending booking.

### Step 3 and Step 4

Read:

```text
bookingId
```

Do not introduce a frontend framework just to manage state.

---

## 35. REQUIRED JAVASCRIPT FUNCTIONS

The original specification expects these functions.

### config.js

```text
USE_MOCK_DATA
API_BASE_URL
```

Purpose:
One setting switches between mock and real API.

### api.js

```text
apiGet(path)
apiPost(path, body)
```

Purpose:
Single API/fetch wrapper.

It should handle:

* JSON headers
* Error handling
* Mock/real switching

Example conceptual behavior:

```js
async function apiGet(path) {
    if (USE_MOCK_DATA) {
        return mockGet(path);
    }

    const response = await fetch(API_BASE_URL + path);
    return response.json();
}
```

Use the same pattern for POST.

### validation.js

Required functions:

```text
validateSearchForm()
validatePassengerForm()
validateRegistration()
validateLoginForm()
```

All forms must perform client-side validation before submission.

### flights.js

Required functions:

```text
searchFlights()
renderFlightCards()
applyFilters()
changePage(n)
selectFlight(id)
```

The selected flight must eventually be stored in sessionStorage.

### booking.js

Required functions:

```text
renderPassengerForms(count)
submitPassengerDetails()
```

### payment.js

Required functions:

```text
initiatePayment(bookingId)
handlePaymentResult()
```

### ticket.js

Required functions:

```text
loadETicket(bookingId)
printTicket()
```

### auth.js

Required functions:

```text
register()
login()
logout()
```

---

## 36. FRONTEND API CONTRACT

The mock layer must be designed around these eventual real backend endpoints.

```text
GET  /api/flights/search?origin=&destination=&date=&passengers=&page=

POST /api/bookings

POST /api/payments/initiate

POST /api/payments/verify

GET  /api/bookings/{id}/ticket

GET  /api/users/me/bookings

POST /api/auth/register

POST /api/auth/login
```

The mock responses should be designed so that the backend can later return
the same structure.

IMPORTANT:

Do not create arbitrary response formats that would make backend integration
difficult.

---

## 37. BACKEND ARCHITECTURE — FUTURE PHASE

Do NOT start backend implementation until the frontend booking workflow is
stable.

The backend must use:

```text
Controller
 ↓
Service
 ↓
Repository
 ↓
Hibernate/JPA
 ↓
MySQL
```

This is mandatory.

Avoid putting business logic directly inside controllers.

---

## 38. FUTURE BACKEND COMPONENTS

Expected general structure:

```text
controller/
service/
repository/
model/entity/
```

The backend will eventually contain entities for things such as:

* Users
* Flights
* Bookings
* Passengers
* Payments
* Tickets

The exact entity relationships should be designed to match the final
frontend/API requirements.

---

## 39. FUTURE DATABASE

Database:

```text
MySQL
```

Persistence:

```text
Hibernate / JPA
```

The database should support the booking system and relationships between:

* User
* Flight
* Booking
* Passenger
* Payment
* Ticket

Do not build database tables prematurely before the API contract is stable.

---

## 40. FUTURE API TESTING

Every backend endpoint must be tested in Postman.

The final Postman collection must be exported as:

```text
JSON
```

---

## 41. PHASE 3 INTEGRATION

Once the backend is complete:

Change the frontend configuration from:

```text
USE_MOCK_DATA = true
```

to:

```text
USE_MOCK_DATA = false
```

and configure:

```text
API_BASE_URL
```

Then:

```
Frontend
 ↓
Spring API
 ↓
Service
 ↓
Repository
 ↓
Hibernate
 ↓
MySQL
```

CORS must be configured so the frontend can communicate with the backend.

---

## 42. IMPORTANT RULES FOR GLM

You are assisting me with an existing academic project.

Follow these rules:

### Rule 1 — Inspect before changing

Do not blindly rewrite existing files.
First understand the existing structure and code.

### Rule 2 — Preserve completed work

Do not unnecessarily change:

* Existing design
* Colors
* Navbar
* Footer
* Animations
* Existing working pages
* Existing navigation
* Existing interactions

### Rule 3 — No unnecessary frameworks

Use:

```text
HTML
CSS
Vanilla JavaScript
```

for the frontend.

Do not introduce:

```text
React
Vue
Angular
Bootstrap
Tailwind
jQuery
```

unless I explicitly request it.

### Rule 4 — Keep pages static

Each page should remain a normal `.html` file.

### Rule 5 — Use sessionStorage

Do not introduce a complicated state-management library.

### Rule 6 — Mock first

The booking workflow must work without a backend.

### Rule 7 — API abstraction

Pages should communicate through:

```text
apiGet()
apiPost()
```

rather than directly calling fetch everywhere.

### Rule 8 — Match the API contract

The mock API must be designed around the eventual Spring API.

### Rule 9 — Do not fabricate completion

If something is unfinished, clearly state that it is unfinished.

### Rule 10 — Avoid unnecessary changes

If a feature already works, do not rewrite it just because you can.

---

## 43. CURRENT PRIORITY

The current highest-priority task is NOT the backend.

The next work should be:

```text
1. Build flightListing.html
2. Build mock flight data
3. Build flights.js
4. Connect homeLogged search → flight listing
5. Implement filtering
6. Implement pagination
7. Implement select flight
8. Build passenger-details.html
9. Build booking.js
10. Build payment.html
11. Build payment.js
12. Build e-ticket.html
13. Build ticket.js
14. Build my-bookings.html
15. Build/rework admin.html
16. Complete mock API architecture
17. Test entire frontend
18. Only then start Spring MVC backend
```

---

## 44. FIRST TASK TO WORK ON

When starting development, focus on:

## FLIGHT LISTING PAGE

Create:

```text
flightListing.html
assets/js/flights.js
assets/js/mock-data.js
assets/js/api.js
assets/js/config.js
```

The page should receive:

```text
flightSearchData
```

from sessionStorage.

Then:

1. Read origin
2. Read destination
3. Read date
4. Read passenger count
5. Search mock flights
6. Display flight cards
7. Allow filtering
8. Allow pagination
9. Allow flight selection
10. Save selected flight
11. Continue to passenger details

The page must visually match the existing Yatra design.

Do not create a completely different visual style.

---

## 45. FINAL GOAL

The finished Yatra 2.0 frontend should allow a user to demonstrate this
complete process without any backend:

```
Login
 ↓
Logged-in Home
 ↓
Search Flight
 ↓
Flight Listing
 ↓
Filter/Search
 ↓
Select Flight
 ↓
Passenger Details
 ↓
Payment Method
 ↓
Mock Payment
 ↓
E-ticket
 ↓
Booking History
```

After that, the exact same frontend should be capable of being connected to
the Spring MVC backend by switching the API configuration.

The ultimate backend flow will be:

```
HTML/CSS/JS Frontend
        ↓
      REST API
        ↓
Spring Controller
        ↓
     Service
        ↓
   Repository
        ↓
 Hibernate/JPA
        ↓
      MySQL
```

This is an academic project, so prioritize:

* Correct architecture
* Clear code
* Understandable implementation
* Maintainability
* Requirement compliance
* Working demonstrations
* Simple technologies
* No unnecessary complexity

END OF REQUIREMENTS

---

*Tracker maintained by the author + agent. Update the Progress Tracker at the
top of this file after every completed task and append session details to
§52 Session Log. Last updated: Session 11 — 2026-09-14.*

---

# MERGED FROM project.md (2026-09-14)

*The former `project.md` (agent session log + site/user-journey notes) was
merged into this file and deleted. Sections 46–52 below are carried over
verbatim; keep maintaining them here. Historical session-log entries may
reference the former project.md's own numbering (§5 = Known Open Items,
§6 = Verification Checklist, §7 = Session Log) — renumbered 50/51/52 here.*

## 46. PROJECT CONTEXT

**Yatra 2.0** — a static frontend for a Nepali flight booking platform
(academic project by Dikshya Ghising). Pure HTML/CSS/vanilla JS, no build
step, no framework. Open pages directly or via a simple static server.

**Scope (confirmed by the author, 2026-09-14):** Yatra is a booking platform
for browsing flights of Nepali airlines — Buddha Air, Yeti Airlines, etc. —
and is **domestic-only for now** (international may come later). Mock data,
airport codes, schedules, and airline names should stay Nepali-domestic.

- **Author:** Dikshya Ghising
- **Font:** Plus Jakarta Sans (Google Fonts)
- **Icons:** Font Awesome 6.7.2 (CDN)
- **Brand palette:** primary green `#0ea371`, primary-dark `#086936`, dark
  `#0f172a`, off-white `#e8ecef`
- **Look & feel:** dark-glass navbar (translucent → deepens on scroll), dark
  footer, rounded pill buttons, reveal-on-scroll animations, count-up stats

### User journey (site flow)
- **Entry:** `home.html` (logged-out) → Log In (`login.html`) / Sign Up
  (`signup.html`) → `homeLogged.html`
- **Booking (built by the author):** homeLogged search (`flightSearchData`) →
  `searchFlight.html?from=&to=&date=&pax=` (URL params, date strip, fare
  classes) → select saves `yatra_selected_flight` → `booking.html` passenger
  details (`bookingData` + `yatra_passenger`) → `payment.html`
  (`paymentData`, 15-min timer) → **eSewa only for now** (author decision):
  `esewaLogin` (creates `yatra_pending_payment`) → `esewaOtp` →
  `esewaBalance` (mock wallet balance, promos) → `esewaConfirm` (wallet/bank;
  wallet shows Insufficient Balance at NPR 26.35, PAY VIA BANK always
  succeeds) → saves `yatra_transaction` → `eticket.html` (PNR/ticket,
  barcodes, print).
- **Explore:** destinations, blog, aboutUs, careers, press
- **Support:** ticketStatus (PNR/ticket lookup), helpCenter, contactUs,
  refundPolicy
- **Cross-links:** every page shares the fixed navbar + 11-link mobile menu +
  dark footer with payment badges

## 47. FRONTEND ARCHITECTURE / CONVENTIONS

### Shared design system
- **`assets/css/homeLogged.css`** = the single source of truth for: tokens
  (`:root` variables), navbar, mobile menu, footer, payment partners band,
  `.btn` styles, `.reveal` / `.delay-*` animation system, user chip, log-out
  button, **`.hero-sky` layer** (drifting clouds + flying plane — drop the
  markup into any hero), **`.back-to-top`** button, and a site-wide
  `prefers-reduced-motion` block.
- **Wizard band (2026-09-14):** `.wizard-band` + stepper
  (`.steps`/`.stepper`, `.step`, `.step-num`/`.step-circle`, `.step-line`),
  `.timer-bar` (warning/danger states) and the slim `.wizard-footer`
  (© line only) live in `homeLogged.css`; the four booking-wizard pages
  (searchFlight, booking, payment, eticket) use them — page CSS carries page
  styles only.
- **Every content page** links `homeLogged.css` FIRST, then its own page CSS
  (which must contain page-specific styles only — no navbar/footer/token
  duplication).
- **`assets/js/homeLogged.js`** = shared JS: navbar scroll state, mobile menu
  (bars↔xmark icon swap), scroll reveal, count-up counters. Content pages load
  it, then their own page JS.
- **Exceptions (intentional):**
  - `home.html` — logged-out variant (Log In / Sign Up instead of user chip)
  - `login.html`, `signup.html` — standalone auth pages, self-contained
    `<style>`/`<script>`, same color tokens, no site navbar/footer
  - `ticketStatus.html` — skips shared JS; `ticketStatus.js` is self-contained
    (handles navbar/menu/reveal itself)

### Navbar (copy from homeLogged.html when creating pages)
- Fixed, `id="navbar"`, logo `Yatra-logo-all-white.png`, Ticket Status link,
  user chip + Log Out (logged-in pages), mobile menu button.
- Mobile menu: `id="mobileMenu"`, full-screen white overlay, 11 links,
  **current page highlighted with inline `style="color: var(--primary);"`**.

### Footer (copy from homeLogged.html)
- `.footer` → brand col, Company col, Support col, Contact col →
  `.payment-partners-section` (eSewa, Khalti, ConnectIPS, Nabil, Visa) →
  `.footer-bottom`.

### JS style
- Vanilla, one file per page in `assets/js/`, `DOMContentLoaded` wrapper,
  null-safe element guards, `IntersectionObserver` for reveal/counters.

### Dynamic-readiness rule (author instruction, 2026-09-14)
The frontend is static/mock for now but MUST become dynamic when the Java
backend (Phase 2/3) lands, with minimal changes. Every page therefore:
- renders from data, never from markup assumptions — pages must keep working
  when the data source changes;
- must move ALL data acquisition through `api.js` (`apiGet`/`apiPost`, see
  §35) with the `USE_MOCK_DATA` / `API_BASE_URL` switch in `config.js` — no
  `fetch` and no mock branching inside page JS;
- keeps sessionStorage keys as the mirror of future API resources (search,
  selected flight, booking, payment, ticket) — do not invent new one-off keys;
- a pending `bookingId` must be created in the mock layer (§31.2) and passed
  by key, not by page order;
- no hardcoded flights/prices/passenger data in page JS — that data belongs in
  `mock-data.js` so the same render functions consume API responses later.

Current state vs this rule: page JS still reads/writes sessionStorage directly
and `booking.js` hardcodes a flight — acceptable for now, but wiring through
`api.js`/`mock-data.js` is item 16 of the priority checklist and the main
refactor before Phase 2.

## 48. FILE MAP

| Page | Page CSS | Page JS | Notes |
|---|---|---|---|
| homeLogged.html (logged-in home, search box w/ 3 tabs) | homeLogged.css (shared) | homeLogged.js | search redirects → `searchFlight.html?from=&to=&date=&pax=` |
| home.html (logged-out home) | homeLogged.css (shared) | homeLogged.js | Log In/Sign Up variant |
| destinations.html | destinations.css | destinations.js + homeLogged.js | grid, Load More; hero sky layer + back-to-top come from shared files |
| ticketStatus.html | ticketStatus.css | ticketStatus.js | mock booking data (PNR `YTRA2X`, ticket `YTR-2026-001234`) |
| aboutUs.html | aboutUs.css* | homeLogged.js | *uses shared for nav/footer |
| blog.html | blog.css | blog.js + homeLogged.js | filters + load more |
| careers.html | careers.css | careers.js + homeLogged.js | job filters + apply modal |
| press.html | press.css | press.js + homeLogged.js | |
| helpCenter.html | helpCenter.css | helpCenter.js + homeLogged.js | search, accordion, votes |
| contactUs.html | contactUs.css | contactUs.js + homeLogged.js | |
| refundPolicy.html | refundPolicy.css | refundPolicy.js + homeLogged.js | FAQ accordion + fee estimator |
| login.html | (inline) | (inline) | standalone |
| signup.html | (inline) | (inline) | standalone |
| searchFlight.html (flight listing — author-built) | homeLogged.css (shared) + searchFlight.css | searchFlight.js | URL params `?from=&to=&date=&pax=`; date strip ±3 days; 6 fare classes (E/C/D/B/A/Y); airline logo+name on cards (Buddha U4, Yeti YT, Shree S3, Sita ST, Summit RM — logos in `assets/imgs/airline-*`, code-badge fallback; flows in `yatra_selected_flight` → eticket "Operated by"); policy modal; select → saves `yatra_selected_flight` → booking.html; on shared wizard band + slim wizard-footer |
| booking.html (passenger details) | homeLogged.css (shared) + booking.css | booking.js | contact + passenger forms, validation, "I'm a passenger" auto-fill, SSR toggle, 15-min countdown → saves `bookingData` + `yatra_passenger` → payment.html; wizard band stepper + timer + wizard-footer from shared |
| payment.html (payment method) | homeLogged.css (shared) + payment.css | payment.js | eSewa radio → esewaLogin.html; other methods blocked w/ alert (eSewa-only decision); promo field (cosmetic), timer resumes from `bookingTimeLeft` → saves `paymentData`; wizard band stepper + timer + wizard-footer from shared |
| eticket.html (e-ticket) | homeLogged.css (shared) + eticket.css | eticket.js | reads `yatra_transaction` + `yatra_selected_flight`; PNR/ticket no., fare breakdown, fake barcodes, print; shared wizard band + wizard-footer |
| esewaLogin.html (mock eSewa gateway — login) | esewaLoginV2.css (V2 redesign) | esewaLogin.js | amount from selected flight (incl. airline name), fake captcha; login creates `yatra_pending_payment` → esewaOtp.html |
| esewaOtp.html (eSewa OTP step) | esewaV2.css (V2 redesign) | esewaOtp.js | 01:34 countdown, any 6-digit code passes, sets `yatra_otp_verified` → esewaBalance.html |
| esewaBalance.html (eSewa wallet) | esewaV2.css (V2 redesign) + inline `<style>` for `.narrow` | esewaBalance.js | reads `yatra_pending_payment`; amounts/promos (YATRA10, YATRA500), mock balance 26.35, refresh; CONTINUE → esewaConfirm.html; CANCEL → searchFlight.html |
| esewaConfirm.html (eSewa confirm) | esewaV2.css (V2 redesign) | esewaConfirm.js | wallet (insufficient at 26.35 → modal) / bank (always succeeds); deducts wallet on success, saves `yatra_transaction` → eticket.html |
| — (no page) | esewaOtp.css, esewaLogin.css, esewaBalance.css, esewaConfirm.css | — | LEGACY gateway styles, superseded by the V2 redesign; NO page links them anymore (verified 2026-09-14) — deletion candidates once the author confirms they won't "swap back" |
| — (no esewaOtpm.html) | — | esewaOtpm.js (orphan) | older eSewa OTP prototype script; no page references it; candidate for deletion if the author confirms |

**Assets:** `assets/imgs/` — airline logos added 2026-09-14 (from
Wikimedia/Wikipedia, used by searchFlight cards): `airline-buddha.jpg`,
`airline-yeti.jpg`, `airline-shree.svg`, `airline-sita.jpeg`. NOTE: there is
NO `assets/imgs/dest/` folder. Available destination photos: `pokhara.jpg`,
`bhairahawa.jpeg`, `nepalgunj.jpeg`, `biratnagar.png`, `mountainview.jpg`,
`header-top-image.jpg` (several destination cards intentionally reuse these
as placeholders; JS has a gradient fallback for broken images).

**Other:** `admin.html` (see §49), payment logos (`esewa.webp`, `khalti.jpg`,
`connectisp.avif`, `nabil.jpg`, `visa.jpg`), logos
(`Yatra-logo-all-white.png`, `Yatra-logo-black.png`).

## 49. DO NOT TOUCH (user's explicit instruction)

- **`admin.html`** — user will work on this LATER. It is currently a raw Java
  JSP file (server-side scriptlets) and will look broken if opened directly.
  That is expected. **Do not modify, fix, or "clean up" it.** This is now the
  ONLY protected file.
- ~~`flightListing.html`~~ — restriction removed 2026-09-14: the user built
  the flight listing themselves as **`searchFlight.html`**. Never create
  `flightListing.html`.
- **Booking-wizard pages** (`searchFlight.*`, `booking.*`, `payment.*`,
  `eticket.*`, `esewa*.*`) — the user wrote these themselves; inspect and
  preserve their structure. Ask before restructuring.

## 50. KNOWN OPEN ITEMS / FUTURE WORK

### Booking-flow gaps (updated 2026-09-14 after the wizard was linked end-to-end)
- `booking.html` links `terms.html` (not created).
- ~~`booking.js` hardcodes the flight block (`KTM→BWA`, 07:15, NPR 6300) in
  `bookingData` instead of reading `yatra_selected_flight`, and renders only 1
  passenger form regardless of passenger count~~ **FIXED (Session 10):**
  booking.js now renders N Adult/Child forms from `flightSearchData.passengers`
  (fallback: `yatra_selected_flight.passengers`; infants are lap infants — no
  form, no fare), reads the selected flight for the sidebar and `bookingData`,
  validates every passenger, and persists `bookingTimeLeft` for payment.html.
  Remaining: payment.html's booking-details card is still static mock data.
- Payment methods other than eSewa are intentionally blocked with an alert on
  payment.html — build their flows when the author says so.
- `esewaOtpm.js` + `esewaOtpm.html` look like an older eSewa-OTP prototype
  (fixed NPR 8299.99, next page `esewaPayment.html` which doesn't exist) — no
  page references the JS; candidate for deletion if the author confirms.
- Gateway pages (`esewa*`) are intentionally self-styled — they mimic the real
  ePay/eSewa look. Since Session 9 they share the site font (Plus Jakarta Sans).
- **V2 redesign (2026-09-14, author-made):** all 4 gateway pages now use the
  light-card "ePay" UI — `esewaLoginV2.css` (login) and `esewaV2.css`
  (OTP/balance/confirm; `.epay2-*` classes, shared steps rail, toasts, modals).
  esewaBalance.html also carries a small inline `<style>` for its narrow
  layout. Every class the V2 pages use is defined in those two files
  (verified) — the legacy gateway CSS (`esewaOtp.css`, `esewaLogin.css`,
  `esewaBalance.css`, `esewaConfirm.css`) is no longer linked by any page
  (kept on disk as the documented "swap back" path via the comment in
  esewaLogin.html).

### Older items
- Several destination cards reuse placeholder photos — dedicated per-city
  images would be nice (missing images auto-fallback to a themed gradient via
  `destinations.js`).
- `ticketStatus.js` uses mock booking data — real API integration later.
- All forms are mock/frontend-only (search, contact, newsletter, job apply,
  etc.).
- Mock API architecture files (`config.js`, `mock-data.js`, `api.js`,
  `validation.js`, `auth.js`, …) not started — see §31/35.

## 51. VERIFICATION CHECKLIST (run after any change)

```bash
# 1. JS syntax — all page scripts
for f in assets/js/*.js; do node --check "$f" >/dev/null 2>&1 && echo "OK   $f" || echo "FAIL $f"; done

# 2. CSS brace balance
for f in assets/css/*.css; do o=$(grep -o "{" "$f" | wc -l); c=$(grep -o "}" "$f" | wc -l); [ "$o" = "$c" ] && echo "OK   $f" || echo "MISMATCH $f ($o/$c)"; done

# 3. Broken internal links
for f in *.html; do for l in $(grep -oE 'href="\./?[A-Za-z0-9_-]+\.html' "$f" | sed 's/href="//; s|^\./||' | sort -u); do [ -f "$l" ] || echo "BROKEN in $f -> $l"; done; done

# 4. Missing asset references
for f in *.html; do for r in $(grep -oE '(src|href)="assets/[^"]+"' "$f" | sed -E 's/^(src|href)="//; s/"$//' | sort -u); do [ -f "$r" ] || echo "MISSING in $f -> $r"; done; done
```

**Design-consistency rule:** any new/edited page must reuse `homeLogged.css`
tokens, navbar, and footer — never re-declare them.

## 52. SESSION LOG

> **Agent instruction:** after each session, append a new entry below using
> this template, newest first:

```
### Session N — YYYY-MM-DD
**Requested:** <what the user asked for>
**Done:** <files changed + what was fixed>
**Found but not fixed:** <issues discovered, deliberately left>
**Next up:** <natural continuation points>
```

### Session 11 — 2026-09-14
**Requested:** "do this — fold project.md's conventions into the tracker
(requirements.md) for a leaner 3-file setup."
**Done:**
- Merged the former `project.md` (422 lines) into this file verbatim as
  §46–52: Project Context, Frontend Architecture/Conventions, File Map,
  Do-Not-Touch, Known Open Items, Verification Checklist, Session Log.
- Deleted `project.md`. This file is now the single master document +
  tracker; header + footer updated accordingly.
- Fixed live cross-references (header note, §32-file-map pointers,
  Session-5 entry renumbering); historical log mentions left as-is.
**Found but not fixed:** nothing new — pre-existing open items unchanged
(see §50).
**Next up:** mock API files (config/api/mock-data) per item 16; terms.html.

### Session 10 — 2026-09-14
**Requested:** "in my searchFlight page, it does not shows airline" (Yatra
books domestic Nepali airlines); then "is code badge better than logo?" →
"cant you access images from google"; a follow-up "now update search flights"
(clarified = the airline logo work); then "now read all whole project" (full
audit); finally tracker sync.
**Done:**
- **Airline display on searchFlight:** flight data already carried an airline
  object but the card renderer never showed it. Added a 7th grid column with a
  logo chip + airline name (Buddha U4, Yeti YT, Shree S3, Sita ST, Summit RM —
  real IATA codes), airline mixed per date; flight numbers now match the
  operating carrier; expanded panel shows "✈ YT 958 · Yeti Airlines".
- **Airline end-to-end:** `yatra_selected_flight` now saves `airline`, so the
  e-ticket renders "Operated by <real airline>" (eticket.js already read it —
  was falling back to "Yatra Air"); esewaLogin flight-reference line includes
  the airline name; responsive rules added (baggage hidden ≤1024px, stack
  ≤768px).
- **Real logos fetched from Wikimedia/Wikipedia** into `assets/imgs/airline-*`
  (buddha .jpg, yeti .png, shree .svg from en.wikipedia, sita .png,
  summit .png from en.wikipedia — Commons 404'd for non-free Summit logo).
  Cards show logo on white chip with automatic IATA-code-badge fallback
  (`load` listener in capture phase + `onerror` remove; CSS shows code until
  the image confirms loaded).
- **Fixed a real bug in the first logo attempt:** `loading="lazy"` +
  `display:none`-until-load meant browsers never fetched the images — logos
  would have stayed badges forever. Lazy attr removed.
- **Full project read (25,354 lines, 59 files):** docs, all 21 pages, all page
  JS, CSS section maps; ran the §6 verification suite: 18/18 JS OK, 19/19 CSS
  balanced, 0 missing assets (incl. the new airline-* files), only broken link
  remains terms.html (pre-existing).
- **Tracker sync (this session):** file-map rows for the 4 eSewa gateway pages
  updated to the V2 redesign CSS; legacy gateway CSS documented as unreferenced
  (deletion candidates, swap-back path noted); assets section lists the
  airline logos; §5 gateway note rewritten for V2.
**Found but not fixed:** booking.js still hardcodes flight + 1 passenger form;
terms.html missing; `esewaOtpm.js` orphaned; legacy esewa CSS files unreferenced
(awaiting author confirmation before deletion); group-booking tab offers
DEL/DXB (international) though scope is domestic-only; booking p1Nationality
readonly "Nepal" while home form collects nationality; login console.logs the
password payload (demo-only).
**Next up:** booking.js → `yatra_selected_flight` + N passenger forms;
terms.html; mock API files (config/api/mock-data); optionally delete legacy
esewa CSS + esewaOtpm.js once confirmed.

### Session 9 — 2026-09-14
**Requested:** "Give esewa gateway pages the site font and tokens while keeping
their mock-gateway look."
**Done:**
- `esewaOtp.css` + `esewaLogin.css` (shared gateway bases): documented that the
  mock-gateway look is intentional; added site design-system aliases to their
  `:root` (`--dark`, `--slate`, `--slate-light`, radius scale,
  `--radius-full`) so shared/interop styles match homeLogged.css; transition
  easing aligned to the site curve (`all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`).
  Gateway palette (`--esw-*`, eSewa green/orange) untouched.
- Bulletproof site font: extended the `button { font-family: inherit }` rule
  to `button, input, select, textarea` in both bases (inputs don't inherit by
  default).
- **Restored lost styles on esewaBalance/esewaConfirm:** their markup uses the
  login page's gateway chrome (`.esw-top`, `.esw-card`, `.esw-left/right`,
  `.login-btn`, `.lang`, `.field-err`, `.cancel-pay`, `.esw-foot`) but the
  esewaLogin.css link had been dropped in Session 6 when esewaPayment.css was
  removed — top bar/card panel/buttons rendered as browser defaults on those
  pages. Both pages now link `esewaOtp.css` + `esewaLogin.css` before their
  own CSS; the unlinked `body` rule also means they regain the Plus Jakarta
  Sans background/color defaults.
- booking.html: Booking Details sidebar was stacking BELOW the forms — the
  base `.booking-grid { grid-template-columns: 1fr 380px }` rule had been
  stripped from booking.css during Session 7's dedup (only the ≤1024px
  single-column override survived). Rule restored; sidebar sits right again,
  matching payment.html.
- Verified no class collisions between esewaLogin.css and the component CSS;
  18/18 JS OK, 17/17 CSS balanced, no missing assets; only terms.html still
  broken (pre-existing).
- File-map accuracy: removed the stale `esewaOtpm.html` row (the page does
  not exist; only the orphan `esewaOtpm.js` remains) and updated the
  balance/confirm CSS columns.
**Found but not fixed:** `esewaOtpm.js` still orphaned (deletion candidate);
terms.html missing.
**Next up:** booking.js → `yatra_selected_flight` + N passenger forms;
terms.html; mock API files. **Session 10 addendum:** booking.js now wired to
`yatra_selected_flight` + renders N passenger forms (see §5).

### Session 8 — 2026-09-14
**Requested:** "Let's focus on the design… some files have different design
(different go-to-top button than homeLogged). Fix all that. I want all pages
to have same color palette, similar font, same design, animations."
**Done:**
- Site-wide design audit: palette/font/animations were already unified (all 21
  pages load Plus Jakarta Sans @ 400–800; content pages share homeLogged.css
  tokens/navbar/footer; wizard band shared on the 4 wizard pages). The real
  drift was in small shared components:
- **Back-to-top unified to ONE design:** three icon variants had crept in —
  `fa-plane-up` (homeLogged standard, 11 pages), `fa-arrow-up` (booking,
  payment), `fa-plane` (searchFlight/eticket). All 15 buttons now use
  `fa-plane-up` + `aria-label="Back to top"`; styles + JS stay shared
  (homeLogged.css + homeLogged.js; wizard pages keep their equivalent wiring).
- **Font Awesome CDN unified:** booking/payment/esewaOtp were on 6.5.1 while
  the other 18 pages used 6.7.2 → all 21 pages now load 6.7.2 (icons render
  identically everywhere).
- **searchFlight `.btn-modify` light-bg fix** (Session 7 watch-item): scoped
  `.btn-modify.btn-outline` override (white bg, green border/text) matching
  eticket's `.et-actions` treatment — shared `.btn-outline` is the transparent
  navbar variant and rendered white-on-light.
- Verification: 17/17 CSS brace-balanced, no missing assets, 15/15
  back-to-top icons identical; only broken link remains terms.html
  (pre-existing).
**Found but not fixed:** esewa* gateway pages, login/signup (standalone) and
admin.html are intentionally outside the shared system per author decisions;
terms.html still missing.
**Next up:** booking.js → `yatra_selected_flight` + N passenger forms;
terms.html; mock API files (config/api/mock-data) per the dynamic-readiness
rule.

### Session 7 — 2026-09-14
**Requested:** "Continue from TODO-wizard-unification.md" — finish the wizard
design unification (searchFlight → booking → payment → eticket on the shared
homeLogged.css system: dark wizard band + stepper, slim ©-only footer,
11-link mobile menu, back-to-top).
**Done:**
- `assets/css/homeLogged.css` (start of session): gained the shared wizard
  block — `.wizard-band`, `.steps`/`.stepper` + `.step` variants (covers both
  the `<ol class="steps">` and `.stepper` markups), `.timer-bar`
  (warning/danger + pulse), `.wizard-footer`, 768px stepper rules,
  reduced-motion fixes.
- `searchFlight/booking/payment` .html+.css (start of session): shared link
  added first, 11-link icon menus, `.wizard-band`, slim `.wizard-footer`,
  back-to-top; page CSS stripped of duplicated tokens/navbar/menu/buttons/
  reveal/stepper/footer/reduced-motion blocks; booking.html logo fixed
  (`yatra-logo-white.png` → `Yatra-logo-all-white.png`, was broken before).
- `assets/css/payment.css`: removed dead 768px rules (`.booking-header`,
  `.step-line`, `.step-label`, `.partners-logos`, `.partner-badge`) and the
  local reduced-motion block (583 → 550 lines).
- `eticket.html`: links homeLogged.css first; 4-link mini menu replaced with
  the standard 11-link icon menu; full footer replaced by `.wizard-footer`;
  back-to-top button added.
- `assets/css/eticket.css` (815 → 424 lines): removed `:root` tokens, reset,
  `.btn` trio, `.reveal`, navbar, mobile menu, wizard band/stepper and full
  footer blocks. Kept page-scoped: base img/a/ul/h1–h4 rules, light-background
  `.et-actions .btn-outline` override (shared `.btn-outline` is the
  transparent navbar variant), ticket/stub/print styles; print hide-list now
  hides `.wizard-footer`.
- `searchFlight.js` + `eticket.js`: back-to-top wiring added (booking.js
  pattern: passive scroll toggle + reduced-motion-aware smooth scroll).
- Verification: 18/18 JS `node --check` OK; 17/17 CSS brace-balanced; no
  missing asset refs.
**Found but not fixed:** booking.html → terms.html still 404s (pre-existing);
`.btn-modify` on searchFlight rides the shared transparent `.btn-outline` —
if it looks off on the light card, give searchFlight the same scoped fix as
`.et-actions .btn-outline`; esewa* gateway pages intentionally self-styled
(untouched); admin.html protected.
**Next up:** eyeball the 4 wizard pages in a browser (band/stepper identical,
slim footers, logos on booking/payment, 11-link menus, back-to-top,
`.btn-modify` look); then booking.js → `yatra_selected_flight` + N passenger
forms + terms.html (Session 6 next-ups); mock API files after that.

### Session 6 — 2026-09-14
**Requested:** "Link all the pages" — homeLogged search → searchFlight; Select
Departure Flight → booking page; booking continue → payment; payment (eSewa
only) → esewaLogin → esewaOtp → esewaBalance → esewaConfirm; low wallet balance
and PAY VIA BANK → eticket. Author called this "the main scope of my project".
**Done:**
- `homeLogged.js`: search submit now maps `flightSearchData` to URL params and
  redirects to `./searchFlight.html?from=&to=&date=&pax=` (was the 404ing
  `flightListing.html`).
- `searchFlight.js`: Select Departure Flight now goes to `./booking.html`
  (was the non-existent `passengerDetails.html`).
- `booking.js`: also saves `yatra_passenger` (name/phone/email) so eticket.js
  and esewaOtp.js resolve the real passenger; continue → payment.html already
  worked.
- `payment.js`: eSewa selected → `./esewaLogin.html`; other methods blocked
  with an alert (author decision: eSewa only for now).
- `esewaLogin.js`: successful gateway login creates `yatra_pending_payment`
  (amount, user details from `yatra_passenger`, flight ref) →
  `./esewaOtp.html`. Transaction is now only recorded after the final PAY
  step.
- `esewaBalance.js` (was empty): fills amounts/user details from
  `yatra_pending_payment`, mock wallet balance 26.35 + refresh spinner, promo
  codes YATRA10/YATRA500, CONTINUE → `./esewaConfirm.html`, CANCEL → search.
- `esewaOtp.js` → esewaBalance and `esewaConfirm.js` PAY (bank path with low
  balance) → eticket already worked; no change needed.
- Removed dead `assets/css/esewaPayment.css` links from esewaBalance.html and
  esewaConfirm.html (esewaOtp.css provides the shared gateway tokens).
- Verification: 18/18 JS `node --check` OK; CSS brace-balanced; no missing
  asset refs; redirect chain greps clean end-to-end.
**Found but not fixed:** booking.html → terms.html (page doesn't exist);
booking.js still hardcodes the flight block + single passenger form;
non-eSewa methods intentionally blocked; esewaOtpm prototype orphaned.
**Next up:** wire booking.js to `yatra_selected_flight` and render N passenger
forms; create terms.html; then mock API files (config/api/mock-data) per the
dynamic-readiness rule.

### Session 5 — 2026-09-14
**Requested:** "Update trackers. I have already made searchFlight page, so for
now the only protected file is admin page."
**Done:**
- Tracker-sync session — no page code changed.
- Recorded the author's scope clarification (domestic-only; Nepali airlines
  like Buddha Air, Yeti) in §1 and in requirements.md open decisions.
- Recorded the author's dynamic-readiness requirement: static now, but pages
  must become dynamic once the Java backend starts — added a
  "Dynamic-readiness rule" to §2 and mirrored it in requirements.md.
- `requirements.md`: Phase 1 ≈60% → ~75%; wizard table steps 1–4 marked ✅
  (searchFlight/booking/payment/eticket, with the author's filenames);
  checklist items 1–13 ticked (6 pagination = N/A as built — the date strip
  replaces it); protected-files section now lists only admin.html;
  open-decisions rewritten (flightListing decision resolved, 6 concrete flow
  gaps recorded); Session 5 progress-log entry added.
- `project.md` (now §46–52 here): §46 journey rewritten around the real built
  flow; §48 file map gained rows for searchFlight, booking, payment, eticket
  and the 4 eSewa pages (+ esewaOtpm prototype note); §49 reduced to
  admin.html as the sole DO-NOT-TOUCH file; §50 open items replaced with
  verified booking-flow gaps + older items; Session 5 log entry added.
- Verified before writing: all 18 JS files pass `node --check`, all 17 CSS
  files brace-balanced; ran the broken-link / missing-asset checks.
**Found but not fixed:** the flow gaps listed in §50 — homeLogged→flightListing
404 redirect, searchFlight→passengerDetails.html dead redirect (page is
booking.html), booking.js hardcoded flight + single passenger form,
`yatra_passenger` never written, card/bank payment path shows demo e-ticket,
missing `terms.html`, missing `esewaPayment.css` links, empty
`esewaBalance.js`, orphaned esewaOtpm prototype. Also pre-existing:
destination placeholder photos, mock-only forms.
**Next up:** fix the two broken handoffs (homeLogged redirect +
passengerDetails→booking), wire booking.js to `yatra_selected_flight` +
render N passenger forms, then unify the payment paths so every method
produces a consistent e-ticket; mock API files after that.

### Session 3 — 2026-09-13
**Requested:** User flagged that destinations had animations the rest of the
site lacks. Skeptical of the nav scroll-progress bar; liked the clouds+plane
hero and was unsure about the back-to-top plane button. After discussion,
decisions were: remove the progress bar, add clouds+plane to ALL page heroes,
make back-to-top site-wide.
**Done:**
- Removed the scroll-progress bar entirely (destinations.html markup,
  destinations.css styles, destinations.js scroll handler).
- Promoted clouds+plane to a shared **`.hero-sky`** layer in `homeLogged.css`
  (uses proven destinations layering: `z-index:-1`, above bg/overlay, below
  text; mobile font-size tuning; reduced-motion safe) and added the markup to
  the hero of all 11 content pages (home, homeLogged, aboutUs, careers,
  press, blog, helpCenter, contactUs, refundPolicy, ticketStatus banner,
  destinations).
- Promoted back-to-top to shared: styles in `homeLogged.css`, JS in
  `homeLogged.js` (section 12), button markup added to all 11 content pages.
- `ticketStatus.js` is self-contained (no shared JS), so the back-to-top
  handler was wired there too (section 3b).
- `destinations.js` slimmed to page-only logic (Load More + image fallback);
  it now loads shared `homeLogged.js` first like every other page — no
  duplicated navbar/menu/reveal/counter code.
- Fixed `homeLogged.js` count-up suffix logic: `50K+` previously lost its
  `K+` suffix (now renders `%`/`K+` like destinations.js always did).
- `destinations.css` reduced-motion block removed (superseded by the
  site-wide one in `homeLogged.css`).
- Verification checklist passes: all page JS `node --check` OK, all CSS
  brace-balanced, zero broken links, zero missing assets, old classes
  (`scroll-progress`, `plane-fly`, `.clouds`) fully gone.
**Found but not fixed:** `searchFlight.js` (new untracked user WIP for the
flight-listing page) fails `node --check` with an `FDB: ...` placeholder
syntax error at line 40 — left alone per the "user builds flightListing
themselves" rule. `aboutUs.html` still styles its hero in an inline
`<style>` block (no `aboutUs.css` file exists despite the file map listing
one). Destination cards still share placeholder photos.
**Next up:** user finishes flightListing/searchFlight page (sky layer +
back-to-top markup can be reused there); optional per-city destination
images; real API integration later.

### Session 2 — 2026-09-13
**Requested:** Site-wide audit of all 14 pages (after destinations fix in
Session 1); then create a project context/session-log file with "ignore"
rules for admin.html and flightListing.html (in that file, NOT .gitignore).
**Done:**
- Full audit: all 9 JS files pass `node --check` (incl. inline scripts in
  login/signup); all 9 CSS files brace-balanced; zero corruption patterns
  remain; no broken internal links; no missing asset refs; navbar/menu/footer
  structure identical across all 11 content pages.
- Fixed `homeLogged.html`: script src typo `homeLoggeds.js` → `homeLogged.js`
  (its tabs/search/modal/navbar were dead before).
- Created the project context & session log file (merged into this document
  as §46–52 in 2026-09-14).
**Found but not fixed:** `flightListing.html` missing (user will build);
`admin.html` is raw JSP (user will handle); destination cards share
placeholder photos; ticketStatus uses mock data.
**Next up:** user builds flightListing.html; optional per-city destination
images; real API integration later.

### Session 1 — 2026-09-13
**Requested:** Debug destinations.html/css/js; make header/footer match the
rest of the site (same palette, design, animations).
**Done:**
- `destinations.html`: fixed stray text (`footer-col -->`, floating
  `50,000+`, duplicate eSewa badge), double-nested contact-item, dead footer
  links (Careers/Press/HelpCenter/Contact now linked), images repointed from
  non-existent `assets/imgs/dest/` to real assets, mobile menu aligned to
  site pattern (11 links, current-page highlight).
- `destinations.css`: full rewrite — removed dozens of corrupted rules
  (`var--dark`, `font-block: 800`, `var(--start light)`, `flex-wrap: pop`,
  broken keyframes) and removed duplicated navbar/footer/token blocks; page
  now consumes shared `homeLogged.css`; added missing `.breadcrumb` styles;
  fixed hero flex direction (scroll-hint was sitting beside content);
  matched `--primary-dark` to site green.
- `destinations.js`: full rewrite — old file didn't even parse; restored
  navbar scroll, mobile menu w/ icon swap, scroll progress, reveal, Load More
  w/ stagger, count-up (now renders `%`/`K+` suffixes correctly),
  back-to-top, image fallback. `node --check` passes.
