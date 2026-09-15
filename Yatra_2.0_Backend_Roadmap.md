# Yatra 2.0 — Backend Roadmap (Admin-Side Focus)

*Companion to the Master Plan — this is the exact build order: what to do first, what depends on what, and how to know each phase is actually done before moving to the next.*

---

## How to Use This

Each phase has: **what to build**, **why it goes here** (dependency reasoning), and a **checkpoint** — a concrete test that proves the phase works before you move on. Don't skip ahead if a checkpoint fails; almost everything later depends on the earlier phases being solid, especially Auth/Security (Phase 2) since every admin endpoint after it needs to be protected correctly from the start, not retrofitted later.

---

## PHASE 0 — Project Setup
**Build:**
- Spring Boot project in IntelliJ (Spring Initializr: Web, JPA, MySQL Driver, Security, Validation, Mail, Lombok)
- MySQL database created, connection configured in `application.properties`
- Base package structure created: `controller/`, `service/`, `repository/`, `model/`, `security/`, `config/`, `exception/`, `dto/`

**Checkpoint:** App starts with no errors, Hibernate connects to MySQL (check console for `HikariPool` connected / no connection errors).

---

## PHASE 1 — Global Exception Handling (build this before real endpoints exist)
**Why here:** every module you build from Phase 4 onward should throw through this — retrofitting it later means revisiting every controller.

**Build:**
- `GlobalExceptionHandler` (`@RestControllerAdvice`) with a consistent error response shape: `{ "error": "CODE", "message": "..." }`
- A couple of base custom exceptions (`ResourceNotFoundException`, `ValidationException`) you'll reuse everywhere

**Checkpoint:** A deliberately broken test endpoint (e.g. throw `ResourceNotFoundException`) returns your custom JSON shape, not Spring's default whitelabel error page.

---

## PHASE 2 — Entities, Relationships & Repositories
**Build (all core entities, even if some fields are unused until later phases):**
- `User`, `Airline`, `Flight`, `Seat`, `Destination`, `Booking`, `Passenger`, `Payment`, `Ticket`
- JPA relationships: `User 1:N Booking`, `Airline 1:N Flight`, `Flight 1:N Seat`, `Booking 1:N Passenger`, `Booking 1:1 Payment`, `Booking 1:1 Ticket`, `Destination` referenced by `Flight` (origin/destination)
- Matching `*Repository` interfaces (Spring Data JPA)

**Checkpoint:** Hibernate auto-creates all tables correctly on startup (`ddl-auto=update` or review generated schema) — check MySQL Workbench, all foreign keys look right.

---

## PHASE 3 — Auth Foundation + JWT + Spring Security
**Why here, before any CRUD module:** every admin endpoint from Phase 4 onward needs `@PreAuthorize` to actually mean something — build the security skeleton before wrapping real endpoints in it.

**Build (in this order):**
1. `PasswordConfig` — `BCryptPasswordEncoder` bean
2. `POST /api/auth/register` — creates `User`, hashes password, sends SMTP confirmation (Phase can stub email for now, wire real SMTP in Phase 11)
3. `POST /api/auth/login` — validates credentials, returns JWT
4. `JwtUtil` — generate/validate tokens (userId, role, expiry)
5. `JwtAuthFilter` — reads `Authorization: Bearer <token>` header, sets Spring Security context
6. `SecurityConfig` — stateless session, route rules (`/api/auth/**` public, `/api/admin/**` → `ADMIN`, etc.), wires in `JwtAuthFilter`

**Checkpoint (do this in Postman, keep the requests — reuse for your final collection):**
- Register a user → 200, user appears in DB with a hashed (not plaintext) password
- Login → 200, returns a JWT
- Hit any `/api/admin/**` test endpoint with no token → 401/403
- Hit it again with a valid ADMIN-role token → 200

**This is your first real milestone. Don't move to Phase 4 until this checkpoint fully passes.**

---

## PHASE 4 — Airline Module (Reference Pattern + BLOB Image)
**Why first among admin modules:** smallest entity, no dependencies on other modules, and it's where you establish the BLOB upload/retrieval pattern once — Flight, Destination, etc. will follow the shape you build here.

**Build:**
- `AirlineController`, `AirlineService`, `AirlineRepository` (already scaffolded in Phase 2)
- Full CRUD: `POST /api/admin/airlines`, `GET /api/airlines`, `GET /api/airlines/{id}`, `PUT /api/admin/airlines/{id}`, `DELETE`/disable
- Logo stored as **BLOB/Base64** (`@Lob` field on `Airline`) — upload via `MultipartFile`, retrieval endpoint serving bytes with correct `Content-Type`
- All admin write endpoints behind `@PreAuthorize("hasRole('ADMIN')")`
- Basic input validation (`@Valid` + Bean Validation annotations on the DTO)

**Checkpoint:**
- Create an airline with a logo file via Postman → 200
- MySQL `airline` table shows binary/Base64 data in the `logo` column, not a path
- `GET /api/airlines/{id}` returns/renders the image correctly
- Search + pagination work on `GET /api/airlines`

---

## PHASE 5 — Flight Module
**Why here:** depends on Airline existing (Flight references Airline); Bookings/Seats depend on Flight existing.

**Build:**
- Full CRUD for `Flight` (Flight Number, Airline, Origin/Destination, times, Aircraft, Fare, Seat Capacity, Status)
- **No manual "available seats" field** — that's calculated later in Phase 6
- On flight creation: auto-generate the corresponding `Seat` rows (e.g. capacity 70 → 70 `Seat` records, all AVAILABLE)
- Search/filter (by airline, route, date, status) + pagination

**Checkpoint:** Create a flight with capacity 70 → confirm 70 `Seat` rows are created in MySQL, all AVAILABLE.

---

## PHASE 6 — Seat Booking Logic (Double-Booking Prevention)
**Why here:** this is the core logic your teacher flagged — build it once Flight/Seat data actually exists to book against.

**Build:**
- Unique constraint on `(flight_id, seat_number)` already in place from Phase 2's `Seat` entity — confirm it's actually enforced
- `BookingService.bookSeat()` — `@Transactional`, checks seat status, updates to BOOKED, creates `Booking` + `Passenger` records
- Catch `DataIntegrityViolationException` → 409 `"Seat already booked"`
- `GET /api/flights/{id}/seats` — live seat map (AVAILABLE/BOOKED per seat)
- Available-seats count on flight = `capacity − COUNT(booked seats)`, computed, never stored/edited directly

**Checkpoint (the demo-critical one):**
- Fire two booking requests for the *same* seat back-to-back in Postman → one 200, one 409 "Seat already booked"
- `GET /api/flights/{id}/seats` correctly shows the booked seat as unavailable

---

## PHASE 7 — Dummy Data Seeding
**Why here, not earlier:** needs Airline + Flight + Seat + Booking all working to seed something meaningful.

**Build:**
- `CommandLineRunner` (or admin-only `POST /api/admin/seed`) that creates: your 5 airlines, ~10–15 flights across them, a handful of pre-existing bookings/payments
- Should be re-runnable/resettable for repeated demo/testing without manual DB cleanup

**Checkpoint:** Fresh DB → run seeder → all admin list endpoints (airlines, flights, bookings) return realistic non-empty data.

---

## PHASE 8 — Destination Module (Cloudinary)
**Why here:** second image pattern, now that BLOB is proven in Phase 4 — build Cloudinary the same way, side by side, so the contrast is clear for your demo.

**Build:**
- `CloudinaryConfig` bean, `CloudinaryService` (`upload()`/`delete()`)
- Full CRUD for `Destination` — image field stores `secure_url` + `public_id`, not bytes
- Credentials via environment variables, never hardcoded

**Checkpoint:**
- Upload a destination image → Postman shows `secure_url` in response
- Cloudinary dashboard shows the file
- MySQL `destination` table has only the URL string

---

## PHASE 9 — Booking Management (Admin Side)
**Why here:** Bookings already exist from Phase 6/7 — this phase is the admin *view and manage* layer on top.

**Build:**
- `GET /api/admin/bookings` (search/filter by customer, flight, status, date + pagination)
- `GET /api/admin/bookings/{id}` — full detail (passenger, flight, payment, ticket)
- Status update endpoint (CONFIRMED/PENDING/CANCELLED) with backend-enforced business rules (e.g. can't confirm without successful payment)

**Checkpoint:** Admin can list, filter, and view full detail of a booking seeded in Phase 7.

---

## PHASE 10 — Payment (eSewa Mock) Backend
**Why here:** depends on Booking existing; this is the piece your frontend mock doesn't cover.

**Build:**
- `PaymentService`: initiate → simulate mock eSewa response → update `Payment` status (SUCCESS/PENDING/FAILED/REFUNDED) → on SUCCESS, update `Booking` to CONFIRMED and trigger ticket generation (Phase 12 dependency — build `Ticket` creation stub here if Phase 12 isn't done yet)
- `admin-payments.html`-facing endpoints: `GET /api/admin/payments` with search/filter/pagination

**Checkpoint:** Simulate a payment → booking status flips to CONFIRMED, payment shows SUCCESS in admin listing; simulate a failure → booking stays PENDING/CANCELLED, payment shows FAILED.

---

## PHASE 11 — User Management (Admin) + Real SMTP Wiring
**Build:**
- `GET /api/admin/users` (search/filter/pagination), activate/deactivate, view a user's bookings
- Go back to Phase 3's registration endpoint and wire actual Spring Mail SMTP (Gmail app password or similar, via env vars) for the registration confirmation email — this was stubbed earlier

**Checkpoint:** Register a test user → real email arrives in inbox; admin can see/deactivate that user.

---

## PHASE 12 — Ticket Management
**Build:**
- `Ticket` generation tied to successful payment (from Phase 10)
- `GET /api/admin/tickets` — search by PNR/ticket number/customer/flight, view full ticket detail

**Checkpoint:** A fully booked + paid flow (Phases 6 + 10) produces a retrievable ticket via this endpoint.

---

## PHASE 13 — Dashboard Analytics
**Build:**
- `GET /api/admin/dashboard` — aggregate counts (Total Users, Flights, Airlines, Bookings, Today's Bookings, Revenue, Pending Payments)
- Optional: simple time-series endpoints for bookings/revenue-over-time if you want charts

**Checkpoint:** Dashboard endpoint numbers match what's actually in the DB after your seeded + test data.

---

## PHASE 14 — Cross-Cutting Polish Pass
By now search/filter/pagination should already exist per-module (build it in as you go, don't leave it all for here) — this phase is for catching what was missed:
- Confirm **every** list endpoint has pagination + at least one filter
- Confirm **every** write endpoint validates input on the backend (not just relying on frontend)
- Confirm logging is in place for key events (bookings created, payments processed, auth failures)
- Re-check every admin write route is actually behind `@PreAuthorize`

**Checkpoint:** Go through Part 2 of the Master Plan (all 10 admin pages) and confirm each has a working, protected, paginated, filterable backend endpoint behind it.

---

## PHASE 15 — Postman Collection Finalization
**Build:**
- Organize all requests used throughout Phases 3–14 into folders per module
- Include both success and failure cases (especially the double-booking 409 from Phase 6)
- Export as JSON collection for submission

**Checkpoint:** Fresh import of the collection into a clean Postman workspace runs end-to-end without manual fixes.

---

## Quick Reference: Build Order Summary

```
0. Project setup
1. Global exception handling
2. Entities + relationships + repositories
3. Auth + JWT + Spring Security          ← first real milestone
4. Airline CRUD + BLOB image             ← reference pattern
5. Flight CRUD (+ auto seat generation)
6. Seat booking logic (double-booking)   ← teacher's top priority
7. Dummy data seeding
8. Destination CRUD + Cloudinary
9. Booking management (admin)
10. Payment / eSewa backend
11. User management + real SMTP
12. Ticket management
13. Dashboard analytics
14. Cross-cutting polish pass
15. Postman collection finalization
```

**Rule of thumb while building:** don't start a phase until the previous one's checkpoint passes cleanly in Postman. Most bugs later in the project trace back to skipping a checkpoint early (usually Phase 3 or Phase 6).
