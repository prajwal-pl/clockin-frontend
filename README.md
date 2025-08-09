# Worker Clock-in – Frontend

A modern, responsive web app for geofenced time tracking. Built with Next.js App Router, Ant Design, Tailwind CSS, and lucide-react. It integrates with a Node.js/Express backend (Prisma + PostgreSQL) and supports email/password and Google authentication.

## Key Features

- Authentication: email/password and Google OAuth. Token-based auth persisted on the client.
- Role-based access control: Care Worker vs Manager/Admin.
- Worker clock-in/out with geofence validation against configured perimeters.
- Manager dashboard: active staff, daily activity, and total hours summaries.
- Perimeter management: create, view, edit, delete circular geofences (center + radius).
- View user logs (manager), personal logs are accessible by the user.
- Clean and responsive UI using Ant Design, tailored with Tailwind.

## Getting Started

Frontend

- Env: create `frontend/.env` with `NEXT_PUBLIC_API_BASE=http://localhost:8080/api` (or your backend URL).
- Install and run:
  - npm install
  - npm run dev
- Open http://localhost:3000

Backend

- Configure `backend/.env` (DATABASE_URL, JWT_SECRET, FRONTEND_URL, etc.)
- Run migrations and start the server per the backend README or package scripts.

## Frontend Routes

- Public
  - `/` Home: shows product splash; redirects authenticated users by role.
  - `/auth/login` Login form with email/password and a Google sign-in button.
  - `/auth/register` Registration with name, email, password.
  - `/auth/callback` OAuth token receiver; stores token then routes to `/`.
- App (requires authentication)
  - `/worker/clock` Worker clock-in/out with live location map and optional note.
  - `/account` Account profile and “Become Manager” control.
- Manager (requires MANAGER or ADMIN)
  - `/manager/dashboard` Overview: active staff and daily activity summaries.
  - `/manager/perimeters` List of perimeters with actions.
  - `/manager/perimeters/new` Create perimeter (name, location label, center, radius).
  - `/manager/perimeters/[id]` Edit perimeter.
  - `/manager/reports` Reports summary (if backend data available).
  - `/manager/users/[id]/logs` View a user’s clock logs.

## Authentication & Roles

- Client stores a JWT token in localStorage after login/register/OAuth.
- Requests include `Authorization: Bearer <token>` via an Axios interceptor.
- The app header displays menu items based on role and provides Logout.
- Manager routes are gated in the UI and via backend middleware.

## Backend API Endpoints

Base URL: `${NEXT_PUBLIC_API_BASE}` (default `http://localhost:8080/api`)

Auth

- POST `/auth/register` → { user, token }
  - body: { name, email, password }
- POST `/auth/login` → { user, token }
  - body: { email, password }
- GET `/auth/me` → { user }
- PUT `/auth/update-role` → { message, user }
  - body: { userId, role }
  - requires Authorization
- GET `/auth/logout` → { message }
  - requires Authorization
- GET `/auth/google` → redirects to Google consent
- GET `/auth/google/callback` → redirects to FRONTEND_URL `/auth/callback?token=...`

Clock

- POST `/clock/clock-in` → { message, record }
  - body: { latitude, longitude, note? }
  - requires Authorization
- POST `/clock/clock-out` → { message, record }
  - body: { latitude, longitude, note? }
  - requires Authorization
- GET `/clock/active-staff` → { active: [{ clockInAt, user: { id, name, email, role } }] }
  - requires MANAGER or ADMIN
- GET `/clock/user/:userId/logs` → { records: [...] }
  - requires Authorization; managers can view others, workers can view their own
- GET `/clock/dashboard` → { range, avgHoursPerDay, totalHoursPerStaffLastWeek }
  - requires MANAGER or ADMIN

Perimeters

- POST `/perimeters` → { perimeter }
  - body: { name, location, latitude, longitude, radiusMeters }
  - requires MANAGER or ADMIN
- GET `/perimeters` → { perimeters: [...] }
  - requires MANAGER or ADMIN
- GET `/perimeters/:id` → { perimeter }
  - requires MANAGER or ADMIN
- PUT `/perimeters/:id` → { perimeter }
  - body: partial update fields (name, location, latitude, longitude, radiusMeters)
  - requires MANAGER or ADMIN
- DELETE `/perimeters/:id` → { message }
  - requires MANAGER or ADMIN
- GET `/perimeters/check/within?latitude=...&longitude=...` → { inside, nearest }
  - nearest: { id, name, distanceMeters, radiusMeters } | null

## Tech Stack

- Frontend: Next.js App Router, Ant Design, Tailwind CSS, lucide-react
- Backend: Node.js, Express, Prisma, PostgreSQL
- Maps: Leaflet

## Development Notes

- The frontend AuthProvider manages token and current user; role-based menus are computed client-side.
- Manager pages are additionally protected by a RequireManager wrapper.
- For OAuth, set FRONTEND_URL in backend `.env`; Google callback will redirect to `/auth/callback?token=...`.

## License

This project is for internal/demo use. Add a license file if distributing.
