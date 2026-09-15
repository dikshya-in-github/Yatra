/* =========================================
   YATRA ADMIN — DASHBOARD JS
   Rewires the §2.5 stat cards + the recent-
   bookings table to the mock stores:
   - yatra_admin_airlines (admin-airlines.js)
   - yatra_admin_flights  (admin-flights.js)
   - yatra_bookings       (esewaConfirm.js on
     PAY success / admin-bookings.js seeds)

   Honest-numbers policy:
   - Airlines/Flights fall back to their SEED
     sizes (4 / 6) only while those stores are
     empty — those pages self-seed with exactly
     that data on first open.
   - Bookings-family cards are always real
     (0 when nothing is booked yet).
   - Total Users reads yatra_admin_users
     (admin-users.js, self-seeds on first open;
     fallback = seed size while the store is
     empty, matching the airlines/flights rule).
   When the Spring API lands, these store reads
   swap for apiGet() calls (dynamic-readiness
   rule) and the fallbacks disappear.
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
  const $ = (s, c = document) => c.querySelector(s);

  const PAGE_SIZE = 5; // recent-bookings rows per page

  /* ---------- Store readers (mock "repository" layer) ---------- */
  function readStore(key) {
    try {
      const raw = localStorage.getItem(key);
      const data = raw ? JSON.parse(raw) : [];
      return Array.isArray(data) ? data : [];
    } catch (err) {
      return [];
    }
  }

  const readAirlines = () => readStore('yatra_admin_airlines');
  const readFlights = () => readStore('yatra_admin_flights');
  const readBookings = () => readStore('yatra_bookings');
  const readUsers = () => readStore('yatra_admin_users');

  /* ---------- Formatting helpers ---------- */
  function fmtNPR(n) {
    return 'NPR ' + Number(n || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2, maximumFractionDigits: 2
    });
  }

  /* Compact revenue like the original dummy "NPR 42.6L" (lakh/crore) */
  function fmtShortNPR(n) {
    if (n >= 1e7) return 'NPR ' + (n / 1e7).toFixed(1) + 'Cr';
    if (n >= 1e5) return 'NPR ' + (n / 1e5).toFixed(1) + 'L';
    if (n >= 1e3) return 'NPR ' + (n / 1e3).toFixed(1) + 'K';
    return 'NPR ' + Math.round(n);
  }

  function fmtDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso.length > 10 ? iso : iso + 'T00:00:00');
    return isNaN(d) ? iso
      : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
  }

  /* ---------- Stat cards ---------- */
  function renderStats() {
    const airlines = readAirlines();
    const flights = readFlights();
    const bookings = readBookings();
    const users = readUsers();

    const live = bookings.filter((b) => b.status !== 'Cancelled');
    const revenue = live.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
    const todayIso = new Date().toISOString().slice(0, 10);
    const todays = bookings.filter(
      (b) => String(b.createdAt || '').slice(0, 10) === todayIso
    ).length;
    const pending = bookings.filter((b) => b.paymentStatus === 'Pending').length;

    const usersEl = $('#statUsers');
    usersEl.textContent = users.length ? users.length : 10; // 10 = seed size
    if (!users.length) usersEl.title = 'Seed count — open Users to load the store';

    const flightsEl = $('#statFlights');
    flightsEl.textContent = flights.length ? flights.length : 6; // 6 = seed size
    if (!flights.length) flightsEl.title = 'Seed count — open Flights to load the store';

    const airlinesEl = $('#statAirlines');
    airlinesEl.textContent = airlines.length ? airlines.length : 4; // 4 = seed size
    if (!airlines.length) airlinesEl.title = 'Seed count — open Airlines to load the store';

    $('#statBookings').textContent = bookings.length;
    $('#statToday').textContent = todays;
    $('#statRevenue').textContent = fmtShortNPR(revenue);
    $('#statRevenue').title = 'Sum of confirmed (non-cancelled) bookings';
    $('#statPending').textContent = pending;
  }

  /* ---------- Recent bookings (live rows) ---------- */
  let page = 1;

  const totalPages = (rows) => Math.max(1, Math.ceil(rows.length / PAGE_SIZE));

  function renderRecent() {
    const bookings = readBookings()
      .slice()
      .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));

    page = Math.min(Math.max(1, page), totalPages(bookings));
    const start = (page - 1) * PAGE_SIZE;
    const pageRows = bookings.slice(start, start + PAGE_SIZE);

    const tbody = $('#recentBookingsBody');
    tbody.innerHTML = pageRows
      .map((b) => {
        const f = b.flight || {};
        return `
      <tr>
        <td><strong>${escapeHtml(b.pnr || '—')}</strong></td>
        <td>${escapeHtml(b.customer || '—')}</td>
        <td>${escapeHtml(f.flightNo || '—')}</td>
        <td>${f.from && f.to ? `${escapeHtml(f.from)} → ${escapeHtml(f.to)}` : '—'}</td>
        <td>${escapeHtml(fmtDate(f.date))}</td>
        <td><strong>${escapeHtml(fmtNPR(b.amount))}</strong></td>
        <td><span class="badge ${payBadgeClass(b.paymentStatus)}">${escapeHtml(b.paymentStatus || '—')}</span></td>
        <td><span class="badge ${bookingBadgeClass(b.status)}">${escapeHtml(b.status || '—')}</span></td>
      </tr>`;
      })
      .join('');

    $('#recentEmpty').hidden = bookings.length > 0;
    renderRecentPagination(bookings.length);
  }

  /* Same status→color semantics as admin-bookings.html */
  const bookingBadgeClass = (s) =>
    s === 'Confirmed' ? 'badge-success' : s === 'Cancelled' ? 'badge-danger' : 'badge-neutral';
  const payBadgeClass = (s) =>
    s === 'Paid' ? 'badge-success'
      : s === 'Pending' ? 'badge-warning'
        : s === 'Refunded' ? 'badge-info'
          : s === 'Failed' ? 'badge-danger' : 'badge-neutral';

  function renderRecentPagination(totalRows) {
    $('#recentPageInfo').textContent = totalRows
      ? `Showing ${Math.min((page - 1) * PAGE_SIZE + 1, totalRows)}–${Math.min(page * PAGE_SIZE, totalRows)} of ${totalRows} booking${totalRows === 1 ? '' : 's'}`
      : 'No bookings';

    const btns = $('#recentPageBtns');
    btns.innerHTML = '';
    const pages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));
    if (pages <= 1) return;

    const mk = (label, target, opts = {}) => {
      const b = document.createElement('button');
      b.className = 'page-btn' + (opts.active ? ' active' : '');
      b.innerHTML = opts.icon ? `<i class="fa-solid ${opts.icon}"></i>` : label;
      b.setAttribute('aria-label', opts.label || `Page ${label}`);
      b.addEventListener('click', () => {
        page = target;
        renderRecent();
      });
      return b;
    };

    btns.appendChild(mk('', page - 1, { icon: 'fa-chevron-left', label: 'Previous page' }));
    for (let p = 1; p <= pages; p++) btns.appendChild(mk(p, p, { active: p === page }));
    btns.appendChild(mk('', page + 1, { icon: 'fa-chevron-right', label: 'Next page' }));
  }

  /* ---------- Page actions ---------- */
  const addFlightBtn = $('#dashAddFlight');
  if (addFlightBtn) {
    addFlightBtn.addEventListener('click', () => {
      window.location.href = './admin-flights.html';
    });
  }

  /* ---------- First render ---------- */
  renderStats();
  renderRecent();
});
