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

**Yatra 2.0** — a static frontend for a Nepali airline booking platform (academic project by Dikshya Ghising).
Pure HTML/CSS/vanilla JS, no build step, no framework. Open pages directly or via a simple static server.

- **Author:** Dikshya Ghising
- **Font:** Plus Jakarta Sans (Google Fonts)
- **Icons:** Font Awesome 6.7.2 (CDN)
- **Brand palette:** primary green `#0ea371`, primary-dark `#086936`, dark `#0f172a`, off-white `#e8ecef`
- **Look & feel:** dark-glass navbar (translucent → deepens on scroll), dark footer, rounded pill buttons, reveal-on-scroll animations, count-up stats

### User journey (site flow)
- **Entry:** `home.html` (logged-out) → Log In (`login.html`) / Sign Up (`signup.html`) → `homeLogged.html`
- **Booking:** homeLogged 3-tab search → `flightSearchData` in sessionStorage → flightListing (to be built) → passenger-details → payment → e-ticket (all to be built)
- **Explore:** destinations, blog, aboutUs, careers, press
- **Support:** ticketStatus (PNR/ticket lookup), helpCenter, contactUs, refundPolicy
- **Cross-links:** every page shares the fixed navbar + 11-link mobile menu + dark footer with payment badges

---

## 2. Architecture / Conventions

### Shared design system
- **`assets/css/homeLogged.css`** = the single source of truth for: tokens (`:root` variables), navbar, mobile menu, footer, payment partners band, `.btn` styles, `.reveal` / `.delay-*` animation system, user chip, log-out button, **`.hero-sky` layer** (drifting clouds + flying plane — drop the markup into any hero), **`.back-to-top`** button, and a site-wide `prefers-reduced-motion` block.
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

---

## 3. File Map

| Page | Page CSS | Page JS | Notes |
|---|---|---|---|
| homeLogged.html (logged-in home, search box w/ 3 tabs) | homeLogged.css (shared) | homeLogged.js | redirects search → flightListing.html |
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

**Assets:** `assets/imgs/` — NOTE: there is NO `assets/imgs/dest/` folder. Available destination photos: `pokhara.jpg`, `bhairahawa.jpeg`, `nepalgunj.jpeg`, `biratnagar.png`, `mountainview.jpg`, `header-top-image.jpg` (several destination cards intentionally reuse these as placeholders; JS has a gradient fallback for broken images).

**Other:** `admin.html` (see §4), payment logos (`esewa.webp`, `khalti.jpg`, `connectisp.avif`, `nabil.jpg`, `visa.jpg`), logos (`Yatra-logo-all-white.png`, `Yatra-logo-black.png`).

---

## 4. DO NOT TOUCH (user's explicit instruction)

- **`admin.html`** — user will work on this LATER. It is currently a raw Java JSP file (server-side scriptlets) and will look broken if opened directly. That is expected. **Do not modify, fix, or "clean up" it.**
- **`flightListing.html`** — user will build this page THEMSELVES. **Do not create or scaffold it.** Context: `homeLogged.js` flight-search flow saves data to `sessionStorage` (`flightSearchData`) and redirects to `./flightListing.html`, which currently 404s — the user is aware and will handle it.

---

## 5. Known Open Items / Future Work

- Several destination cards reuse placeholder photos — dedicated per-city images would be nice (cards live in `destinations.html`; missing images auto-fallback to a themed gradient via `destinations.js`).
- `ticketStatus.js` uses mock booking data — real API integration later.
- All forms are mock/frontend-only (search, contact, newsletter, job apply, etc.).

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
**Next up:** <natural continuation points>
```

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

*Last updated: Session 3 — 2026-09-13*
