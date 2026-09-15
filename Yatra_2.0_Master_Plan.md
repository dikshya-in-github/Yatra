# Yatra 2.0 — Master Project Status, Admin Panel & Backend Plan

*Consolidated reference — merges the original project specification with the admin panel structure and backend kickoff plan developed afterward. This is the single document to work from going forward.*

---

## PART 1 — PROJECT OVERVIEW

**Yatra 2.0** is a university Advanced Java full-stack project: a web-based **domestic flight booking platform for Nepal**. International flights and hotel booking are future scope only — not part of the current build.

### Tech Stack
| Layer | Technology | IDE |
|---|---|---|
| Frontend | HTML, CSS, Vanilla JS, Bootstrap, Font Awesome, responsive design | VS Code |
| Backend | Java, Spring MVC, N-Tier/layered architecture, Hibernate, JPA, MySQL | IntelliJ IDEA |
| API | REST APIs, tested via Postman (exported collection required for submission) | — |
| Email | SMTP via Spring Mail (registration confirmation required; login alerts/password reset optional) | — |
| Images | **Hybrid** — Airline logos: DB BLOB/Base64 · Destination images: Cloudinary (see Part 3, item 5) | — |

### Required Backend Architecture
```
Controller
   ↓
Service           ← business logic lives here, never in controllers
   ↓
Repository / DAO
   ↓
Hibernate / JPA
   ↓
MySQL Database
```

Package structure:
```
controller/  → AuthController, FlightController, BookingController, UserController,
               AirlineController, DestinationController, PaymentController,
               TicketController, AdminController
service/     → matching *Service classes per domain
repository/  → matching *Repository interfaces (Spring Data JPA)
model/       → User, Airline, Flight, Seat, Booking, Passenger, Payment, Ticket, Destination
security/    → JwtUtil, JwtAuthFilter, SecurityConfig
config/      → CloudinaryConfig
exception/   → custom exceptions + GlobalExceptionHandler
```

### Official Assignment Requirements (CPJ119, May 2026 — 60% of final grade)
This project is submitted against Asia e University's CPJ119 Advanced Java Programming assignment brief. Key mandatory points from that official document (separate from the informal project-context spec):
- Frontend: HTML/CSS/JS, responsive, client-side validation, dynamic UI, AJAX/Fetch to backend APIs
- Backend: Spring MVC, mandatory N-Tier (Controller → Service → Repository), all critical logic backend-side
- Database: MySQL or PostgreSQL, Hibernate/JPA mandatory, proper entity relationships (1:1, 1:N, N:N), secure CRUD
- SMTP: registration confirmation email mandatory; credentials via env vars, never hardcoded
- **Images: must NOT be stored as static files — must be stored in the database as BLOB or Base64.** This is stated as mandatory *and* repeated in the final grading criteria ("Proper image handling via the database") — this is why the hybrid image approach below exists
- REST APIs: GET/POST minimum, tested via Postman, exported JSON collection required
- Additional/recommended: Auth & Authorization, RBAC, search/filtering, pagination, logging + global exception handling, dashboard analytics
- Grading also covers: code quality/naming/structure, documentation report quality (see Microsoft Teams for documentation guidelines — not included in this brief)

### Customer-Side Flow (Frontend — Largely Complete)

```
home.html
   ↓
Login / Signup
   ↓
homeLogged.html
   ↓
Search Flight → searchFlight.html   [DONE]
   ↓
Select Flight → booking.html        [DONE — passenger details]
   ↓
payment.html                        [DONE — mock eSewa payment flow]
   ↓
eticket.html                        [DONE — e-ticket generation]
```

Do **not** redesign these completed pages unnecessarily. They use a shared dark wizard band, stepper, 15-minute timer, slim footer, mobile menu, and back-to-top functionality. The eSewa mock pages are intentionally self-styled.

**eSewa payment status:**
- ✅ **Frontend**: mock eSewa payment flow already implemented (`payment.html`)
- ⏳ **Backend**: eSewa payment integration still to be implemented server-side — this needs its own service (`PaymentService`) and will connect to the `Payment` entity/`admin-payments.html` monitoring view. Treat this as a distinct backend task, not something automatically covered by the frontend mock (see Part 3, item 6).

### Airlines Represented
Buddha Air (U4) · Yeti Airlines (YT) · Shree Airlines (S3) · Sita Air (ST)
*(roster trimmed from 5 to 4 on 2026-09-15 — Summit Air RM removed)*
— eventually driven by database/API data rather than hardcoded in the frontend.

### Core Business Rule: Automatic Seat Calculation
Admin sets **Seat Capacity** once (e.g. 70) at flight creation. The backend calculates:
```
Available Seats = Seat Capacity − Booked Seats
```
The admin must **never** manually update the available-seat count — this is a repeated, explicit requirement in the spec and is the top teacher-flagged backend item (Part 3, item 1).

### Remaining Work Outside the Admin Panel
- `my-bookings.html`
- Full backend + REST API implementation
- Frontend/backend integration, CORS configuration
- Postman testing + collection export
- `terms.html` (not yet created)
- Moving booking/payment data currently in `sessionStorage` (`yatra_selected_flight`, `bookingData`, `paymentData`, `yatra_transaction`) to backend/database control

---

## PART 2 — ADMIN PANEL: STRUCTURE & FLOW (Current Focus)

### 2.1 Pages to Build

| # | Page | Purpose |
|---|------|---------|
| 1 | `admin-login.html` | Dedicated admin authentication entry point |
| 2 | `admin-dashboard.html` | Landing page after login — summary cards + analytics |
| 3 | `admin-airlines.html` | Manage airline entities (name, IATA code, logo, status) |
| 4 | `admin-flights.html` | Manage flight schedules/mock inventory |
| 5 | `admin-bookings.html` | View and manage customer bookings |
| 6 | `admin-users.html` | View/manage registered users |
| 7 | `admin-destinations.html` | Manage Nepali cities/airports used in search |
| 8 | `admin-payments.html` | Monitor eSewa payment transactions |
| 9 | `admin-tickets.html` | Search/view generated e-tickets |
| 10 | `admin-profile.html` | Admin's own profile + logout |

*Optional/later:* `admin-content.html`, `admin-logs.html`

### 2.2 Overall Admin Flow

```
Admin opens admin-login.html
        ↓
Enters credentials
        ↓ (backend auth + role check comes later — Part 3, items 3 & 4)
admin-dashboard.html
        ↓
┌─────────────────────────────────────────────┐
│  Sidebar Navigation (persistent, reused      │
│  across every admin page)                    │
│  Dashboard | Flights | Airlines | Bookings   │
│  Users | Destinations | Payments | Tickets   │
│  Profile | Logout                            │
└─────────────────────────────────────────────┘
        ↓
Each sidebar item → its own management page
(table view + search/filter bar + add/edit modal or form)
```

### 2.3 Access Control Flow (enforced later in backend, design frontend to fit it now)

```
User attempts to reach an admin page
        ↓
Backend checks role (JWT + Spring Security — Part 3, items 3 & 4)
        ↓
   Is user ADMIN?
   ┌───────┴───────┐
  YES              NO
   ↓                ↓
Admin Dashboard   Access Denied / Redirect
```
Do not rely only on hiding sidebar links in the frontend — this is enforced at the backend later, but the frontend should be built as if that enforcement already exists (no admin data fetched without a token, etc.).

### 2.4 Per-Page Layout Pattern (apply consistently)

```
┌─────────────────────────────────────────────────────┐
│ YATRA ADMIN                          Admin ▾ Logout  │
├───────────────┬───────────────────────────────────────┤
│ Sidebar        │ Page Title                            │
│ (persistent)   │ Search box   Filter dropdown(s)  [+Add]│
│                │                                        │
│                │ Data Table                             │
│                │  (columns per entity, Edit/Disable     │
│                │   actions per row)                     │
│                │                                        │
│                │ Pagination controls                    │
└───────────────┴───────────────────────────────────────┘
```
- Admin side should look professional, clean, table-based — distinct from the travel-visual customer pages, while still using Yatra branding/colors.
- Every table page needs: search, at least one filter (e.g. status), pagination, and status badges (Active/Inactive, Confirmed/Pending/Cancelled, Success/Pending/Failed/Refunded).
- Build the sidebar once, reuse across all 10 pages.

### 2.5 Dashboard Cards (`admin-dashboard.html`)
Total Users · Total Flights · Total Airlines · Total Bookings · Today's Bookings · Revenue · Pending Payments
(static/dummy numbers for now; wired to real data once backend exists — optional simple chart for bookings/revenue over time)

### 2.6 Key Field Reference

**Airline:** Name, IATA Code, Logo (stored as DB BLOB/Base64 — see Part 3.5), Description, Status
**Flight:** Flight Number, Airline, Origin, Destination, Departure Date/Time, Arrival Time, Aircraft, Fare, Seat Capacity, Status *(Available Seats = calculated, never a manual input field)*
**Booking:** Booking ID, PNR, Customer, Flight, Route, Date, Amount, Payment Status, Booking Status
**User:** User ID, Name, Email, Phone, Role, Registration Date, Status
**Destination:** City Name, Airport Name, Airport Code, Description, Image (Cloudinary URL — see Part 3.5), Status
**Payment:** Transaction ID, Booking ID, Customer, Amount, Method, Date, Status
**Ticket:** Ticket Number, PNR, Passenger, Flight, Route, Departure, Booking, Payment, Status

---

## PART 3 — CRITICAL BACKEND FOCUS AREAS

**Not in the original spec document — flag as top priority the moment backend work begins.** Items 1–4 were explicitly raised by your teacher; items 5–6 are decisions/requirements that directly support them.

### 1. Seat Double-Booking Prevention *(teacher-flagged — top priority)*
**Problem:** two customers booking the same seat at nearly the same moment can both succeed with a naive check-then-book approach, overselling the flight.

**Solution — Option A: Unique Constraint + Transactional Service**
- `Seat` entity: `flight_id`, `seat_number`, `status` (AVAILABLE/BOOKED), `booking_id`
- **Unique constraint** on `(flight_id, seat_number)` at the database level
- Booking logic inside a `@Transactional` service method
- Catch `DataIntegrityViolationException` on conflict → **HTTP 409** with `"Seat already booked"`
- `GET /api/flights/{id}/seats` returns live seat status so the UI can grey out/mark booked seats as "Already Booked"

```
Two requests hit "book seat 14A" near-simultaneously
        ↓                          ↓
   Request 1                  Request 2
        ↓                          ↓
   passes check              passes check (race window)
        ↓                          ↓
   INSERT/UPDATE succeeds    INSERT/UPDATE violates unique constraint
        ↓                          ↓
   200 OK, seat booked       409 Conflict "Seat already booked"
```

### 2. Dummy Data / Seeding API *(teacher-flagged)*
No real GDS/airline API exists, so seed test data via:
- `CommandLineRunner`/`DataLoader` on startup, or
- Admin-only `POST /api/admin/seed` to generate/reset data on demand

This is what lets you demo the double-booking scenario (item 1) in Postman and in your viva.

### 3. JWT Authentication *(teacher-flagged)*
```
POST /api/auth/login
   ↓ validate credentials
   ↓ generate JWT (userId, role, expiry)
   ↓ return token
Client stores token → sends Authorization: Bearer <token> on every request
   ↓
JwtAuthFilter validates signature + expiry, extracts role
   ↓
Spring Security context set → route/method rules apply
```

### 4. Spring Security *(teacher-flagged)*
Enforces item 3 and general endpoint protection:
- `BCryptPasswordEncoder` for password hashing (required by spec)
- Stateless session policy (JWT carries identity, no server session)
- CSRF disabled — correct for stateless JWT APIs, not a shortcut
- Route rules: `/api/auth/**` public · `/api/admin/**` → `hasRole("ADMIN")` · `/api/bookings/**` → `hasAnyRole("USER","ADMIN")`
- `@PreAuthorize("hasRole('ADMIN')")` on individual admin controller methods
- This is what satisfies the spec's "backend must enforce authorization, not just hide frontend links" rule

### 5. Image Storage — Hybrid: BLOB/Base64 (Airlines) + Cloudinary (Destinations)
The official CPJ119 assignment brief mandates DB-stored images (BLOB/Base64) and includes it as a named grading criterion — so pure Cloudinary is not compliant on its own. Decision: split by entity so each storage method has a genuine justification, not an arbitrary split.

**Airline logos → DB BLOB/Base64**
- Small, fixed set (5 airlines), small file size — fits BLOB's use case, satisfies the mandatory requirement directly
- `Airline.logo` as `byte[]` (`@Lob`) or Base64 `String` column
- Upload: `MultipartFile` → bytes → save via `AirlineRepository`
- Retrieval: dedicated endpoint streams bytes back with correct `Content-Type` header (or returns Base64 string for `<img src="data:image/png;base64,...">`)

**Destination images → Cloudinary**
- More images, larger files, benefits from CDN delivery — genuine real-world justification applies here
- Store only `secure_url` + `public_id` in MySQL, not raw bytes
- `CloudinaryConfig` bean + `CloudinaryService` (`upload()` / `delete()`)
- Credentials via environment variables — never hardcoded

**Report/viva line to use:** *"Airline logos use BLOB per the assignment's database-image requirement since there are only a handful and they're small; destination images use Cloudinary for CDN delivery since there are more of them and it reflects production practice."*

**Demo risk:** Cloudinary half needs live internet at presentation time — BLOB half doesn't. Test venue wifi beforehand or have a backup recording of a successful Cloudinary upload.

### 6. eSewa Payment Integration — Backend *(new: frontend already has the mock, backend still needed)*
The frontend's mock eSewa flow (`payment.html`) only simulates the experience client-side. The backend still needs its own integration:
- `PaymentService` handling transaction creation, status updates (SUCCESS/PENDING/FAILED/REFUNDED)
- `Payment` entity linked to `Booking`
- Since this is a **mock** integration for the university project (not real eSewa credentials), the backend should still follow a realistic structure: initiate → simulate gateway response → update payment + booking status → trigger ticket generation
- `admin-payments.html` should reflect real transaction data once this exists, rather than dummy rows
- Do not present the mock as a real production eSewa integration in your report — call it out explicitly as simulated, per the original spec's own caution on this point

```
Booking created (PENDING)
        ↓
Payment initiated → PaymentService
        ↓
Mock eSewa response simulated
        ↓
   SUCCESS?              FAILED?
      ↓                      ↓
Booking → CONFIRMED     Booking stays PENDING/CANCELLED
Ticket generated        Payment marked FAILED
Payment → SUCCESS       Admin sees it in admin-payments.html
```

---

## PART 4 — BACKEND KICKOFF PLAN

### 4.1 Build Order
1. **Project setup** — Spring Boot project in IntelliJ, MySQL connection, `application.properties`
2. **Entities + Repositories** — `User`, `Airline`, `Flight`, `Seat`, `Destination`, `Booking`, `Passenger`, `Payment`, `Ticket`
3. **Auth foundation** — registration + login, password hashing, JWT generation (Part 3.3)
4. **Spring Security wiring** — filter chain, role-based route protection (Part 3.4)
5. **Core CRUD** — Airline and Flight management first (Bookings depend on Flights existing)
6. **Seat booking logic** — double-booking-safe `BookingService` (Part 3.1)
7. **Dummy data seeding** — test items 5 & 6 immediately (Part 3.2)
8. **eSewa backend integration** — `PaymentService` + mock gateway simulation (Part 3.6)
9. **Remaining admin CRUD** — Users, Destinations, Tickets
10. **Image upload — both paths** — Airline logo BLOB/Base64 handling + Cloudinary for destination images (Part 3.5)
11. **Cross-cutting concerns** — global exception handler, logging, input validation
12. **Postman collection** — build test cases as you go, including both image-upload flows; export for submission

### 4.2b Live Demo Checklist (image handling, for presenting to your teacher)
**BLOB/Base64 (Airlines):** Postman `POST` with logo file → 200 response → open MySQL table, show binary/Base64 data in the `logo` column (not a file path) → `GET` and show the image rendering back.
**Cloudinary (Destinations):** Postman `POST` with image → 200 response showing `secure_url` → open Cloudinary dashboard, show the file in the media library → MySQL table shows only the URL string → open the URL in browser to confirm it's live.

### 4.2 Suggested First Milestone
**Airline CRUD + Flight CRUD + JWT login working end-to-end**, tested via Postman, before touching bookings/seats/payments. Mirrors the original spec's own recommended phase order (Auth → Core Admin → Operations) and gives a stable foundation before the trickier concurrency and payment logic.

### 4.2c CRUD Reminder
Every entity (Airline, Flight, Booking, User, Destination, Payment, Ticket) needs standard **Create/Read/Update/Delete** operations through the full Controller → Service → Repository chain — this is explicitly named in the official grading criteria ("Standard CRUD operations implemented securely via Hibernate"). Bookings/Payments/Tickets are mostly Read + status-Update for admin (not free-form edit/delete, since they're financial/booking records). Build Airline CRUD first as the reference pattern — Flight, Destination, etc. largely repeat it.

### 4.3 Conventions to Keep Consistent
- Every write endpoint under `/api/admin/**` behind `@PreAuthorize("hasRole('ADMIN')")`
- Business logic in the **service** layer only; controllers stay thin
- DTOs for request/response bodies — never expose entities directly (especially `User`, to avoid leaking password hashes)
- Pagination + basic filtering on all list endpoints from day one
- Exceptions through the global handler — consistent JSON error shape, e.g. `{ "error": "SEAT_ALREADY_BOOKED", "message": "..." }`
- Seed data realistic enough to demo every admin page (a handful of airlines, ~10–15 flights, some pre-existing bookings/payments)

---

## PART 5 — SUMMARY: WHAT ADMIN SHOULD / SHOULD NOT DO

**SHOULD:** manage airline info · manage flight schedules/mock inventory · view bookings · manage users · manage destinations · monitor payments (incl. eSewa) · view e-tickets · view dashboard analytics · search/filter/paginate everywhere · activate/deactivate records

**SHOULD NOT:** manually enter/update available seats · re-enter airline info per flight · bypass business rules with direct DB edits · depend only on frontend security · treat mock eSewa as a real production gateway · build optional/advanced features before core functionality works

---

*Current stage: Admin panel frontend only. Backend (Parts 3 & 4) begins after admin frontend pages are complete.*
