# Yatra 2.0 — Project Context & Session Log

> **Read this file FIRST at the start of every session. Update the Session Log at the END of every session.**
> This file exists so no context is ever lost between sessions.
>
> **Also read `requirements.md`** — the master spec + progress tracker saved in
> Session 4 from the author's full project requirements (phases, booking wizard,
> API contract, coding rules). **After any completed task, tick its checklist
> and add a Progress Log entry there.**

---

## 1. Project Overview

**Yatra 2.0** — a static frontend for a Nepali flight booking platform (academic project by Dikshya Ghising).
Pure HTML/CSS/vanilla JS, no build step, no framework. Open pages directly or via a simple static server.

**Scope (confirmed by the author, 2026-09-14):** Yatra is a booking platform for
browsing flights of Nepali airlines — Buddha Air, Yeti Airlines, etc. — and is
**domestic-only for now** (international may come later). Mock data, airport
codes, schedules, and airline names should stay Nepali-domestic.

- **Author:** Dikshya Ghising
- **Font:** Plus Jakarta Sans (Google Fonts)
- **Icons:** Font Awesome 6.7.2 (CDN)
- **Brand palette:** primary green `#0ea371`, primary-dark `#086936`, dark `#0f172a`, off-white `#e8ecef`
- **Look & feel:** dark-glass navbar (translucent → deepens on scroll), dark footer, rounded pill buttons, reveal-on-scroll animations, count-up stats

### User journey (site flow)
- **Entry:** `home.html` (logged-out) → Log In (`login.html`) / Sign Up (`signup.html`) → `homeLogged.html`
- **Booking (built by the author):** homeLogged search (`flightSearchData`) → `searchFlight.html?from=&to=&date=&pax=` (URL params, date strip, fare classes) → select saves `yatra_selected_flight` → `booking.html` passenger details (`bookingData` + `yatra_passenger`) → `payment.html` (`paymentData`, 15-min timer) → **eSewa only for now** (author decision): `esewaLogin` (creates `yatra_pending_payment`) → `esewaOtp` → `esewaBalance` (mock wallet balance, promos) → `esewaConfirm` (wallet/bank; wallet shows Insufficient Balance at NPR 26.35, PAY VIA BANK always succeeds) → saves `yatra_transaction` → `eticket.html` (PNR/ticket, barcodes, print).
- **Explore:** destinations, blog, aboutUs, careers, press
- **Support:** ticketStatus (PNR/ticket lookup), helpCenter, contactUs, refundPolicy
- **Cross-links:** every page shares the fixed navbar + 11-link mobile menu + dark footer with payment badges

---

## 2. Architecture / Conventions

### Shared design system
- **`assets/css/homeLogged.css`** = the single source of truth for: tokens (`:root` variables), navbar, mobile menu, footer, payment partners band, `.btn` styles, `.reveal` / `.delay-*` animation system, user chip, log-out button, **`.hero-sky` layer** (drifting clouds + flying plane — drop the markup into any hero), **`.back-to-top`** button, and a site-wide `prefers-reduced-motion` block.
- **Wizard band (2026-09-14):** `.wizard-band` + stepper (`.steps`/`.stepper`, `.step`, `.step-num`/`.step-circle`, `.step-line`), `.timer-bar` (warning/danger states) and the slim `.wizard-footer` (© line only) live in `homeLogged.css`; the four booking-wizard pages (searchFlight, booking, payment, eticket) use them — page CSS carries page styles only.
- **Every content page** links `homeLogged.css` FIRST, then its own page CSS (which must contain page-specific styles only — no navbar/footer/token duplication).
- **`assets/js/homeLogged.js`** = shared JS: navbar scroll state, mobile menu (bars↔xmark icon swap), scroll reveal, count-up counters. Content pages load it, then their own page JS.
- **Exceptions (intentional):**
  - `home.html` — logged-out variant (Log In / Sign Up instead of user chip)
  - `login.html`, `signup.html` — standalone auth pages, self-contained `<style>`/`<script>`, same color tokens, no site navbar/footer
  - `ticketStatus.html` — skips shared JS; `ticketStatus.js` is self-contained (handles navbar/menu/reveal itself)

### Navbar (copy from homeLogged.html when creating pages)
- Fixed, `id="navbar"`, logo `Yatra-logo-all-white.png`, Ticket Status link, user chip + Log Out (logged-in pages), mobile menu button.
- Mobile menu: `id="mobileMenu"`, full-screen white overlay, 11 links, **current page highlighted with inline `style="color: var(--primary);"`**.

### Footer (copy from homeLogged.html)
- `.footer` → brand col, Company col, Support col, Contact col → `.payment-partners-section` (eSewa, Khalti, ConnectIPS, Nabil, Visa) → `.footer-bottom`.

### JS style
- Vanilla, one file per page in `assets/js/`, `DOMContentLoaded` wrapper, null-safe element guards, `IntersectionObserver` for reveal/counters.

### Dynamic-readiness rule (author instruction, 2026-09-14)
The frontend is static/mock for now but MUST become dynamic when the Java
backend (Phase 2/3) lands, with minimal changes. Every page therefore:
- renders from data, never from markup assumptions — pages must keep working when the data source changes;
- must move ALL data acquisition through `api.js` (`apiGet`/`apiPost`, see requirements.md §35) with the `USE_MOCK_DATA` / `API_BASE_URL` switch in `config.js` — no `fetch` and no mock branching inside page JS;
- keeps sessionStorage keys as the mirror of future API resources (search, selected flight, booking, payment, ticket) — do not invent new one-off keys;
- a pending `bookingId` must be created in the mock layer (requirements.md §31.2) and passed by key, not by page order;
- no hardcoded flights/prices/passenger data in page JS — that data belongs in `mock-data.js` so the same render functions consume API responses later.

Current state vs this rule: page JS still reads/writes sessionStorage directly
and `booking.js` hardcodes a flight — acceptable for now, but wiring through
`api.js`/`mock-data.js` is item 16 of the priority checklist and the main
refactor before Phase 2.

---

## 3. File Map

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

**Assets:** `assets/imgs/` — airline logos added 2026-09-14 (from Wikimedia/Wikipedia, used by searchFlight cards): `airline-buddha.jpg`, `airline-yeti.jpg`, `airline-shree.svg`, `airline-sita.jpeg`. NOTE: there is NO `assets/imgs/dest/` folder. Available destination photos: `pokhara.jpg`, `bhairahawa.jpeg`, `nepalgunj.jpeg`, `biratnagar.png`, `mountainview.jpg`, `header-top-image.jpg` (several destination cards intentionally reuse these as placeholders; JS has a gradient fallback for broken images).

**Other:** `admin.html` (see §4), payment logos (`esewa.webp`, `khalti.jpg`, `connectisp.avif`, `nabil.jpg`, `visa.jpg`), logos (`Yatra-logo-all-white.png`, `Yatra-logo-black.png`).

---

## 4. DO NOT TOUCH (user's explicit instruction)

- **`admin.html`** — user will work on this LATER. It is currently a raw Java JSP file (server-side scriptlets) and will look broken if opened directly. That is expected. **Do not modify, fix, or "clean up" it.** This is now the ONLY protected file.
- ~~`flightListing.html`~~ — restriction removed 2026-09-14: the user built the flight listing themselves as **`searchFlight.html`**. Never create `flightListing.html`.
- **Booking-wizard pages** (`searchFlight.*`, `booking.*`, `payment.*`, `eticket.*`, `esewa*.*`) — the user wrote these themselves; inspect and preserve their structure. Ask before restructuring.

---

## 5. Known Open Items / Future Work

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
  esewaBalance.html also carries a small inline `<style>` for its narrow layout.
  Every class the V2 pages use is defined in those two files (verified) — the
  legacy gateway CSS (`esewaOtp.css`, `esewaLogin.css`, `esewaBalance.css`,
  `esewaConfirm.css`) is no longer linked by any page (kept on disk as the
  documented "swap back" path via the comment in esewaLogin.html).

### Older items

### Older items
- Several destination cards reuse placeholder photos — dedicated per-city images would be nice (missing images auto-fallback to a themed gradient via `destinations.js`).
- `ticketStatus.js` uses mock booking data — real API integration later.
- All forms are mock/frontend-only (search, contact, newsletter, job apply, etc.).
- Mock API architecture files (`config.js`, `mock-data.js`, `api.js`, `validation.js`, `auth.js`, …) not started — see requirements.md §31/35.

---

## 6. Verification Checklist (run after any change)

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

**Design-consistency rule:** any new/edited page must reuse `homeLogged.css` tokens, navbar, and footer — never re-declare them.

---

## 7. Session Log

> **Agent instruction:** after each session, append a new entry below using this template, newest first:

```
### Session N — YYYY-MM-DD
**Requested:** <what the user asked for>
**Done:** <files changed + what was fixed>
**Found but not fixed:** <issues discovered, deliberately left>
**Next up:** <natural continuation points>```
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
  the airline name; responsive rules added (baggage hidden ≤1024px, stack ≤768px).
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
  (deletion candidates, swap-back path noted); assets section lists the airline
  logos; §5 gateway note rewritten for V2.
**Found but not fixed:** booking.js still hardcodes flight + 1 passenger form;
terms.html missing; `esewaOtpm.js` orphaned; legacy esewa CSS files unreferenced
(awaiting author confirmation before deletion); group-booking tab offers
DEL/DXB (international) though scope is domestic-only; booking p1Nationality
readonly "Nepal" while home form collects nationality; login console.logs the
password payload (demo-only).
**Next up:** booking.js → `yatra_selected_flight` + N passenger forms; terms.html;
mock API files (config/api/mock-data); optionally delete legacy esewa CSS +
esewaOtpm.js once confirmed.

### Session 9 — 2026-09-14
**Requested:** "Give esewa gateway pages the site font and tokens while keeping
their mock-gateway look."
**Done:**
- `esewaOtp.css` + `esewaLogin.css` (shared gateway bases): documented that the
  mock-gateway look is intentional; added site design-system aliases to their
  `:root` (`--dark`, `--slate`, `--slate-light`, radius scale, `--radius-full`)
  so shared/interop styles match homeLogged.css; transition easing aligned to
  the site curve (`all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`). Gateway palette
  (`--esw-*`, eSewa green/orange) untouched.
- Bulletproof site font: extended the `button { font-family: inherit }` rule to
  `button, input, select, textarea` in both bases (inputs don't inherit by
  default).
- **Restored lost styles on esewaBalance/esewaConfirm:** their markup uses the
  login page's gateway chrome (`.esw-top`, `.esw-card`, `.esw-left/right`,
  `.login-btn`, `.lang`, `.field-err`, `.cancel-pay`, `.esw-foot`) but the
  esewaLogin.css link had been dropped in Session 6 when esewaPayment.css was
  removed — top bar/card panel/buttons rendered as browser defaults on those
  pages. Both pages now link `esewaOtp.css` + `esewaLogin.css` + their own CSS;
  the unlinked `body` rule also means they regain the Plus Jakarta Sans
  background/color defaults.
- booking.html: Booking Details sidebar was stacking BELOW the forms — the
  base `.booking-grid { grid-template-columns: 1fr 380px }` rule had been
  stripped from booking.css during Session 7's dedup (only the ≤1024px
  single-column override survived). Rule restored; sidebar sits right again,
  matching payment.html.
- Verified no class collisions between esewaLogin.css and the component CSS;
  18/18 JS OK, 17/17 CSS balanced, no missing assets; only terms.html still
  broken (pre-existing).
- File-map accuracy: removed the stale `esewaOtpm.html` row (the page does not
  exist; only the orphan `esewaOtpm.js` remains) and updated the balance/confirm
  CSS columns.
**Found but not fixed:** `esewaOtpm.js` still orphaned (deletion candidate);
terms.html missing.
**Next up:** booking.js → `yatra_selected_flight` + N passenger forms;  terms.html;
  mock API files. **Session 10 addendum:** booking.js now wired to
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
  payment), `fa-plane` (searchFlight, eticket). All 15 buttons now use
  `fa-plane-up` + `aria-label="Back to top"`; styles + JS stay shared
  (homeLogged.css + homeLogged.js; wizard pages keep their equivalent wiring).
- **Font Awesome CDN unified:** booking/payment/esewaOtp were on 6.5.1 while
  the other 18 pages used 6.7.2 → all 21 pages now load 6.7.2 (icons render
  identically everywhere).
- **searchFlight `.btn-modify` light-bg fix** (Session 7 watch-item): scoped
  `.btn-modify.btn-outline` override (white bg, green border/text) matching
  eticket's `.et-actions` treatment — shared `.btn-outline` is the transparent
  navbar variant and rendered white-on-light.
- Verification: 17/17 CSS brace-balanced, no missing assets, 15/15 back-to-top
  icons identical; only broken link remains terms.html (pre-existing).
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
  (warning/danger + pulse), `.wizard-footer`, 768px stepper rules, reduced-motion fixes.
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
  `.et-actions .btn-outline` override (shared `.btn-outline` is the transparent
  navbar variant), ticket/stub/print styles; print hide-list now hides
  `.wizard-footer`.
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
slim footers, logos on booking/payment, 11-link menus, back-to-top, `.btn-modify`
look); then booking.js → `yatra_selected_flight` + N passenger forms +
terms.html (Session 6 next-ups); mock API files after that.

### Session 6 — 2026-09-14
**Requested:** "Link all the pages" — homeLogged search → searchFlight; Select
Departure Flight → booking page; booking continue → payment; payment (eSewa
only) → esewaLogin → esewaOtp → esewaBalance → esewaConfirm; low wallet balance
and PAY VIA BANK → eticket. Author called this "the main scope of my project".
**Done:**
- `homeLogged.js`: search submit now maps `flightSearchData` to URL params and
  redirects to `./searchFlight.html?from=&to=&date=&pax=` (was the 404ing
  `flightListing.html`).
- `searchFlight.js`: Select Departure Flight now goes to `./booking.html` (was
  the non-existent `passengerDetails.html`).
- `booking.js`: also saves `yatra_passenger` (name/phone/email) so eticket.js
  and esewaOtp.js resolve the real passenger; continue → payment.html already
  worked.
- `payment.js`: eSewa selected → `./esewaLogin.html`; other methods blocked with
  an alert (author decision: eSewa only for now).
- `esewaLogin.js`: successful gateway login creates `yatra_pending_payment`
  (amount, user details from `yatra_passenger`, flight ref) → `./esewaOtp.html`.
  Transaction is now only recorded after the final PAY step.
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
**Requested:** "Update trackers. I have already made searchFlight page, so for now the only protected file is admin page."
**Done:**
- Tracker-sync session — no page code changed.
- Recorded the author's scope clarification (domestic-only; Nepali airlines like
  Buddha Air, Yeti) in §1 and in requirements.md open decisions.
- Recorded the author's dynamic-readiness requirement: static now, but pages
  must become dynamic once the Java backend starts — added a
  "Dynamic-readiness rule" to §2 (api.js abstraction, USE_MOCK_DATA switch,
  sessionStorage keys as future API resources, bookingId in the mock layer,
  no hardcoded data in page JS) and mirrored it in requirements.md.
- `requirements.md`: Phase 1 ≈60% → ~75%; wizard table steps 1–4 marked ✅ (searchFlight/booking/payment/eticket, with the author's filenames); checklist items 1–13 ticked (6 pagination = N/A as built — the date strip replaces it); protected-files section now lists only admin.html; open-decisions rewritten (flightListing decision resolved, 6 concrete flow gaps recorded); Session 5 progress-log entry added.
- `project.md`: §1 journey rewritten around the real built flow; §3 file map gained rows for searchFlight, booking, payment, eticket and the 4 eSewa pages (+ esewaOtpm prototype note); §4 reduced to admin.html as the sole DO-NOT-TOUCH file; §5 open items replaced with verified booking-flow gaps + older items; Session 5 log entry added.
- Verified before writing: all 18 JS files pass `node --check`, all 17 CSS files brace-balanced; ran the broken-link / missing-asset checks.
**Found but not fixed:** the flow gaps listed in §5 — homeLogged→flightListing 404 redirect, searchFlight→passengerDetails.html dead redirect (page is booking.html), booking.js hardcoded flight + single passenger form, `yatra_passenger` never written, card/bank payment path shows demo e-ticket, missing `terms.html`, missing `esewaPayment.css` links, empty `esewaBalance.js`, orphaned esewaOtpm prototype. Also pre-existing: destination placeholder photos, mock-only forms.
**Next up:** fix the two broken handoffs (homeLogged redirect + passengerDetails→booking), wire booking.js to `yatra_selected_flight` + render N passenger forms, then unify the payment paths so every method produces a consistent e-ticket; mock API files after that.

### Session 3 — 2026-09-13
**Requested:** User flagged that destinations had animations the rest of the site lacks. Skeptical of the nav scroll-progress bar; liked the clouds+plane hero and was unsure about the back-to-top plane button. After discussion, decisions were: remove the progress bar, add clouds+plane to ALL page heroes, make back-to-top site-wide.
**Done:**
- Removed the scroll-progress bar entirely (destinations.html markup, destinations.css styles, destinations.js scroll handler).
- Promoted clouds+plane to a shared **`.hero-sky`** layer in `homeLogged.css` (uses proven destinations layering: `z-index:-1`, above bg/overlay, below text; mobile font-size tuning; reduced-motion safe) and added the markup to the hero of all 11 content pages (home, homeLogged, aboutUs, careers, press, blog, helpCenter, contactUs, refundPolicy, ticketStatus banner, destinations).
- Promoted back-to-top to shared: styles in `homeLogged.css`, JS in `homeLogged.js` (section 12), button markup added to all 11 content pages.
- `ticketStatus.js` is self-contained (no shared JS), so the back-to-top handler was wired there too (section 3b).
- `destinations.js` slimmed to page-only logic (Load More + image fallback); it now loads shared `homeLogged.js` first like every other page — no duplicated navbar/menu/reveal/counter code.
- Fixed `homeLogged.js` count-up suffix logic: `50K+` previously lost its `K+` suffix (now renders `%`/`K+` like destinations.js always did).
- `destinations.css` reduced-motion block removed (superseded by the site-wide one in `homeLogged.css`).
- Verification checklist passes: all page JS `node --check` OK, all CSS brace-balanced, zero broken links, zero missing assets, old classes (`scroll-progress`, `plane-fly`, `.clouds`) fully gone.
**Found but not fixed:** `searchFlight.js` (new untracked user WIP for the flight-listing page) fails `node --check` with an `FDB: ...` placeholder syntax error at line 40 — left alone per the "user builds flightListing themselves" rule. `aboutUs.html` still styles its hero in an inline `<style>` block (no `aboutUs.css` file exists despite the file map listing one). Destination cards still share placeholder photos.
**Next up:** user finishes flightListing/searchFlight page (sky layer + back-to-top markup can be reused there); optional per-city destination images; real API integration later.

### Session 2 — 2026-09-13
**Requested:** Site-wide audit of all 14 pages (after destinations fix in Session 1); then create this project.md with "ignore" rules for admin.html and flightListing.html (in this file, NOT .gitignore).
**Done:**
- Full audit: all 9 JS files pass `node --check` (incl. inline scripts in login/signup); all 9 CSS files brace-balanced; zero corruption patterns remain; no broken internal links; no missing asset refs; navbar/menu/footer structure identical across all 11 content pages.
- Fixed `homeLogged.html`: script src typo `homeLoggeds.js` → `homeLogged.js` (its tabs/search/modal/navbar were dead before).
- Created `project.md` (this file) with context, conventions, ignore rules, and this log.
**Found but not fixed:** `flightListing.html` missing (user will build); `admin.html` is raw JSP (user will handle); destination cards share placeholder photos; ticketStatus uses mock data.
**Next up:** user builds flightListing.html; optional per-city destination images; real API integration later.

### Session 1 — 2026-09-13
**Requested:** Debug destinations.html/css/js; make header/footer match the rest of the site (same palette, design, animations).
**Done:**
- `destinations.html`: fixed stray text (`footer-col -->`, floating `50,000+`, duplicate eSewa badge), double-nested contact-item, dead footer links (Careers/Press/HelpCenter/Contact now linked), images repointed from non-existent `assets/imgs/dest/` to real assets, mobile menu aligned to site pattern (11 links, current-page highlight).
- `destinations.css`: full rewrite — removed dozens of corrupted rules (`var--dark`, `font-block: 800`, `var(--start light)`, `flex-wrap: pop`, broken keyframes) and removed duplicated navbar/footer/token blocks; page now consumes shared `homeLogged.css`; added missing `.breadcrumb` styles; fixed hero flex direction (scroll-hint was sitting beside content); matched `--primary-dark` to site green.
- `destinations.js`: full rewrite — old file didn't even parse; restored navbar scroll, mobile menu w/ icon swap, scroll progress, reveal, Load More w/ stagger, count-up (now renders `%`/`K+` suffixes correctly), back-to-top, image fallback. `node --check` passes.

---

*Last updated: Session 10 — 2026-09-14*
