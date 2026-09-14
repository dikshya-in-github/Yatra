# WIZARD DESIGN UNIFICATION — SESSION HANDOFF (✅ COMPLETE — Session 7, 2026-09-14)

All sections A–F below were finished and verified (18/18 JS OK, 17/17 CSS
balanced, no missing assets). Kept for reference.

Goal: searchFlight → booking → payment → eticket all use the shared design
system (homeLogged.css), same dark wizard band + stepper, slim ©-only footer,
11-link mobile menu, back-to-top. Decisions confirmed by author:
- Footer on wizard pages = © line only (`wizard-footer`), NO full footer.
- Stepper = dark band style (`.wizard-band`) on ALL 4 pages.
- Full unification: shared homeLogged.css first, page CSS = page styles only.

## ALREADY DONE (verified edits applied)
1. `assets/css/homeLogged.css` — added shared wizard block at the end:
   `.wizard-band`, `.steps`+`.stepper`, `.step`, `.step-num`/`.step-circle`,
   `.step-line`, active/done/completed states, `.timer-bar` (+warning/danger,
   `timerPulse` keyframes), `.wizard-footer`, 768px stepper rules,
   reduced-motion `.timer-bar.danger` fix.
2. `searchFlight.html` — homeLogged.css link added; 11-link mobile menu w/
   icons; footer replaced with `.wizard-footer`; back-to-top added.
3. `assets/css/searchFlight.css` — removed :root, reset, navbar, mobile menu,
   .btn block, .reveal, wizard band/stepper, full footer block, footer
   responsive rules + reduced-motion block. CLEAN (grep verified).
4. `booking.html` — homeLogged.css link; logo fixed
   (`yatra-logo-white.png` → `Yatra-logo-all-white.png`, was BROKEN before);
   11-link menu w/ icons; `.booking-header` → `.wizard-band`; `.wizard-footer`.
5. `assets/css/booking.css` — tokens/navbar/menu/stepper/timer/footer/
   back-to-top/reveal/reduced-motion all removed; `.booking-main` now
   `padding: 2.5rem 0 4rem`. CLEAN (grep verified).
6. `payment.html` — same treatment as booking.html (link, logo fix, menu,
   wizard-band, wizard-footer).
7. `assets/css/payment.css` — header→tokens/navbar/menu/stepper/timer/footer/
   back-to-top/reveal removed; `.booking-main` padding updated.

## REMAINING (do in this order)

### A. assets/css/payment.css — final tail cleanup (5 min)
File is ~583 lines now. In the `@media (max-width: 768px)` block REMOVE:
- `.booking-header { padding-top: 110px; }` (class no longer exists)
- `.step-line { width: 30px; }` and `.step-label { font-size: 0.7rem; }`
  (shared rules handle this now)
- `.partners-logos { gap: 0.75rem; }` and `.partner-badge { ... }`
  (partner badges no longer on this page)
KEEP: `.payment-options`, `.wallet-grid`, `.form-card`, `.container` rules.
Then DELETE the whole `/* Reduced motion */ @media (prefers-reduced-motion...)`
block at the end (shared file covers reveal + back-to-top + timer now).

### B. eticket.html (10 min)
- Add `<link rel="stylesheet" href="assets/css/homeLogged.css">` BEFORE
  `assets/css/eticket.css` (eticket.html line ~17).
- Mobile menu (lines ~43-48): replace the 4-link mini menu with the standard
  11-link icon menu — copy the exact block from booking.html (Home/About/
  Careers/Press/Blog/HelpCenter/ContactUs/RefundPolicy/TicketStatus +
  `.mobile-user-name` Dikshya Ghising + Log Out, all with `<i>` icons).
- Footer (lines ~166-224): replace ENTIRE `<footer class="footer">...</footer>`
  with the slim footer:
  `<footer class="wizard-footer"><div class="container"><p>&copy; 2026 Yatra
  2.0. All rights reserved. Academic Project by Dikshya Ghising.</p></div></footer>`
- Add before `<script src="assets/js/eticket.js">`:
  `<button class="back-to-top" id="backToTop" aria-label="Back to top"><i class="fa-solid fa-plane"></i></button>`

### C. assets/css/eticket.css (10 min) — remove duplicated blocks
- Header comment + `:root` (lines ~1-17) and reset/body/`.container`
  (~19-63) → replace with a comment like booking.css got ("tokens... come
  from homeLogged.css"). NOTE: eticket.css also has `img`, `a`, `ul/ol`,
  `h1-h4` rules in the reset — those exist in shared too (shared `a` has
  color inherit? VERIFY: homeLogged.css `a` — only `.status-link` sets
  text-decoration; shared has no bare `a` or `ul` reset… actually shared
  `*` reset + `.mobile-menu a` exist; check `h1,h2,h3,h4{color:var(--dark)}`
  exists only here → MOVE those small base rules (img/a/ul/h1-h4) into the
  kept part of eticket.css instead of deleting, to be safe.
- Remove `.btn`/`.btn-primary`/`.btn-outline` (~64-97) — BUT shared
  `.btn-outline` is transparent/white-text (navbar variant). eticket uses
  `btn-outline` on LIGHT background (Print / My Tickets buttons) → add a
  page-scoped rule in eticket.css instead:
  `.et-actions .btn-outline { background: var(--white); border-color:
  var(--primary); color: var(--primary-dark); }
  .et-actions .btn-outline:hover { background: var(--primary-light); }`
- Remove `.reveal`/`.reveal.active` (~98-106).
- Remove navbar block: from `/* ---------- Navbar (same as homeLogged) */`
  (~line 111) through `.mobile-menu a:hover` (~237). Includes `.nav-link`
  (shared uses `.status-link`; eticket markup has BOTH `nav-link
  status-link` classes → shared `.status-link` styles apply fine).
- Remove wizard band/stepper block (~240-283) — shared version covers it
  (`.step.done .step-num` green check style included).
- Remove footer block (~574-690): `.footer` through `.footer-bottom p`.
- `@media print` (~711): keep, but ADD `.wizard-footer` to the hide list.
- `@media (max-width: 768px)` (~737): remove `.mobile-menu-btn`,
  `.nav-actions .nav-link/.auth-buttons`, `.step + .step::before`,
  `.step-label` rules, `.footer-grid` rule; KEEP success-banner/t-head/
  t-route/t-grid/t-pay/t-stub rules.

### D. JS back-to-top wiring (2 min each)
- `assets/js/searchFlight.js` (~line 318-335 section): add the same
  back-to-top block used in booking.js (~line 227):
  `const backToTop = document.getElementById('backToTop'); if (backToTop) {
  const toggleBackToTop = () => backToTop.classList.toggle('show',
  window.scrollY > 500); window.addEventListener('scroll', toggleBackToTop);
  backToTop.addEventListener('click', () =>
  window.scrollTo({top:0,behavior:'smooth'})); }`
  (match the exact pattern already in booking.js)
- `assets/js/eticket.js` (~line 113-130 section): same addition.
- booking.js / payment.js already have it — no change needed.

### E. Verification (5 min) — run the project.md §6 checklist
```bash
for f in assets/js/*.js; do node --check "$f" >/dev/null 2>&1 && echo "OK   $f" || echo "FAIL $f"; done
for f in assets/css/*.css; do o=$(grep -o "{" "$f" | wc -l); c=$(grep -o "}" "$f" | wc -l); [ "$o" = "$c" ] && echo "OK   $f" || echo "MISMATCH $f ($o/$c)"; done
```
Plus broken-link + missing-asset greps (see project.md §6). Then eyeball all
4 pages in browser: wizard band/stepper look identical, slim footer on all 4,
logo shows on booking/payment, mobile menu = 11 links, back-to-top works.

### F. Trackers (5 min)
- project.md: §2 note that wizard pages now consume the shared system;
  §3 file-map rows updated; §5 remove "gateway pages" note only if accurate
  (esewa pages still self-styled — DO NOT touch those); Session 7 log entry.
- requirements.md: progress-log entry (newest first) + bump last-updated.

## NOTES / GOTCHAS
- Only remaining off-brand greens after this: eticket `--primary-dark:
  #087f5b` token disappears with its :root — shared #086936 takes over. ✔
- searchFlight/eticket had `--off-white: #f8fafc` → now site `#e8ecef`.
- `.btn-modify` on searchFlight used `.btn-outline` (light bg) → if it looks
  wrong after switching to shared `.btn-outline`, give searchFlight the same
  scoped fix as eticket's `.et-actions .btn-outline` (apply to `.btn-modify`).
- esewa* pages are INTENTIONALLY self-styled (mock gateway look) — leave them.
- admin.html remains protected.
