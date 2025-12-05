# Vietnam Tour Discovery – Client

React + Vite + TypeScript frontend using Tailwind CSS and React-Leaflet.

## Environment & Servers

- Frontend dev: `http://localhost:5173`
- Backend dev: `http://localhost:5000`
- CORS origin is locked via server env `CLIENT_ORIGIN` (default `http://localhost:5173`).

## Scripts

- `npm run dev` – start Vite dev server
- `npm run build` – typecheck and build
- `npm run preview` – preview production build

## Features

- Map with locations and tours (OpenStreetMap via React-Leaflet)
- Tour details and booking (child = 70% adult price)
- Auth (register/login/logout) with JWT cookie; user/admin roles
- Admin
  - Bookings: list, filter, confirm/cancel
  - Locations: CRUD + map picker for coordinates
  - Tours: CRUD linked to locations

## Quick Start

1. Start the backend (see `server/README.md`).
2. Install deps and run:

```bash
npm install
npm run dev
```

## Notes

- Booking form appears only on the booking page and prefills user info when logged in.
- Ensure backend `.env` has `CLIENT_ORIGIN` and `NODE_ENV` set appropriately.
