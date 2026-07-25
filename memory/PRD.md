# Penzión Štrba *** — Product Requirements

## Original problem statement
Build an exclusive, cinematic, conversion-focused website for **Penzión Štrba**, a 3-star year-round mountain pension in Tatranská Štrba (High Tatras, Slovakia), 8 km from Štrbské Pleso. Style: minimalist + filmic, Apple-clean UI with glassmorphism, smooth scroll animations and full-screen hero. Goal: increase bookings.

## User personas
- **Leisure traveler (SK/CZ/PL)** — family/couple looking for a mountain escape with wellness.
- **International tourist (EN/DE)** — needs multi-language content, trust signals, easy booking.
- **Group / corporate booker** — conferences, school trips, teambuilding.
- **Hotel admin** — reviews reservations and contact messages, confirms/cancels, exports info.

## Core requirements (static)
- Cinematic landing (Hero with layered mountain silhouettes, particle stars, gradient).
- Sections: About, Rooms, Wellness, Services, Location (seasonal tabs: summer / winter / relax), Reviews, CTA strip, Contact, Footer.
- 3 room types (double-extra, double, triple-kitchen) with pricing + capacity + images.
- Multi-language SK / EN / DE with live switcher.
- Full reservation system: 3-step flow (dates + room, guests + extras, contact) with live total calculation, server-side validation and email dispatch.
- Admin panel at `/admin` with JWT bearer auth, dashboard stats, reservation CRUD, messages list.
- Contact form with Resend integration (gracefully no-op when `RESEND_API_KEY` is empty; data always persisted).
- Design: Outfit (display) + Manrope (body). Dark cinematic theme with champagne gold `#E2C073` accent. Glassmorphism surfaces. Framer Motion scroll reveals.

## Architecture & tasks done (Dec 2025)
- **Backend** (`/app/backend/server.py`)
  - FastAPI + Motor + Pydantic. Routes under `/api/*`.
  - JWT auth: `POST /api/auth/login`, `GET /api/auth/me` (Bearer token). Idempotent admin seeding from env.
  - Public: `GET /api/rooms`, `GET /api/reviews`, `POST /api/reservations`, `POST /api/contact`.
  - Admin-only: `GET /api/reservations`, `PATCH /api/reservations/{id}`, `DELETE /api/reservations/{id}`, `GET /api/admin/stats`, `GET /api/contact`.
  - Resend email dispatch (async via `asyncio.to_thread`), graceful when key absent.
  - Price formula: base × nights × adults + child (50%) + 2€ tax/person/night + 5€ 1-night fee + 30€ wellness + 10€ half-board per person/night.
- **Frontend** (`/app/frontend/src`)
  - React 19 + react-router 7, Tailwind + custom tokens, Framer Motion for reveals, lucide-react icons, sonner toasts.
  - `LangContext` (SK/EN/DE) with `i18n.js` dictionary, default **SK**, persisted in `localStorage`.
  - `AuthContext` with `/api/auth/me` session check and Bearer token in localStorage `ps_token`.
  - 10+ home sections (`/pages/Home.jsx`) + 3-step `BookingDialog` with react-day-picker range calendar.
  - Admin pages: `/admin/login`, `/admin` (stats, reservations table with confirm/cancel/delete, messages tab).
  - Every interactive element has a `data-testid`.

## What's been implemented
- 2025-12-04: MVP complete. 100% of backend pytest tests pass (22/22). Frontend E2E verified: language switching, full booking flow (test reservation created with correct total), contact form, admin login → dashboard → status update → logout.
- Admin seeded: `admin@penzion-strba.sk / Admin123!` (see `/app/memory/test_credentials.md`).
- Resend code path live; key empty, emails logged + persisted only.

## Prioritized backlog
**P1 — next-up (requires user input)**
- Provide a Resend API key (https://resend.com/api-keys) to enable real guest confirmation emails + admin notifications.
- Upload real property imagery and the cinematic hero video; replace placeholder hero (currently elegant SVG peaks).
- Custom sender domain verification in Resend (`info@penzion-strba.sk` as `from`).

**P2 — growth / polish**
- Availability engine (calendar that blocks occupied nights per room type).
- Stripe/PayPal deposit capture for binding reservations.
- SEO meta tags, Open Graph images, structured data (Hotel schema) for better search visibility.
- Newsletter opt-in capture + Resend broadcast integration.
- Booking history download (PDF/CSV) from admin dashboard.

**P3 — nice-to-have**
- Multi-admin support with roles.
- Photo gallery section (rooms + wellness + restaurant).
- Blog / news module (mountain updates, seasonal specials).

## Next tasks list
1. Receive Resend API key from user → add to `/app/backend/.env` → restart backend.
2. Receive brand photography + hero video → swap placeholders in Hero / Rooms / Wellness / CTA.
3. Implement availability calculations per room type (P2).
