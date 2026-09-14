# YATRA 2.0 — PROJECT REQUIREMENTS & PROGRESS TRACKER

> **Master document.** Read together with `project.md` (agent session log
> and site/user-journey notes).
>
> **AGENT INSTRUCTION — KEEPING THIS FILE CURRENT:**
> After ANY task is completed, update this file in the same session:
>   1. Tick the checkbox in the **Priority Task Checklist**
>   2. Update the **Phase Status / Booking Wizard progress** numbers
>   3. Add a dated line at the TOP of the **Progress Log** (newest first)
>   4. Update the `Last progress update:` date at the bottom
> Never mark something complete that has not actually been built and verified.

- **Saved:** 2026-09-13 (Session 4) — from the author's complete project specification
- **Last progress update:** 2026-09-14 (Session 10)

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
top of this file after every completed task; append session details to
`project.md` (§7 Session Log). Last updated: Session 10 — 2026-09-14.*
