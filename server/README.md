# Vietnam Tour Discovery – Server

Express + TypeScript + Prisma + PostgreSQL backend.

## Environment

Set the following in `server/.env`:

```
DATABASE_URL="postgresql://postgres:123@localhost:5432/travel_db?schema=public"
JWT_SECRET="<random-long-string>"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="Strong@Pass1"
CLIENT_ORIGIN="http://localhost:5173"
NODE_ENV="development"
```

## Scripts

- `npm run dev` – start dev server (nodemon + ts-node)
- `npm run build` – compile TypeScript to `dist/`
- `npm start` – run compiled server
- `npx prisma migrate dev` – run migrations
- `npx prisma db seed` – seed data and default admin

## API Overview

Base URL: `http://localhost:5000`

### Public

- `GET /` – health
- `GET /api/locations` – list of locations with a few tours per location
- `GET /api/tours/:id` – tour detail (includes location)
- `POST /api/bookings` – create booking
  - Body: `{ customerName, customerEmail, customerPhone, adultCount, childCount, tourId }`
  - Server calculates `totalPrice = adult*price + child*price*0.7`
  - If logged in, booking is linked to the user

### Auth

- `POST /auth/register` – create account (JWT cookie)
- `POST /auth/login` – login (JWT cookie)
- `POST /auth/logout` – clear cookie
- `GET /auth/me` – current user

### Admin (require ADMIN role + cookie)

- Bookings
  - `GET /admin/bookings?status=PENDING|CONFIRMED|CANCELLED` – list
  - `PATCH /admin/bookings/:id` – update status
- Locations
  - `GET /admin/locations` – list
  - `POST /admin/locations` – create
  - `PUT /admin/locations/:id` – update
  - `DELETE /admin/locations/:id` – delete
- Tours
  - `GET /admin/tours` – list
  - `POST /admin/tours` – create
  - `PUT /admin/tours/:id` – update
  - `DELETE /admin/tours/:id` – delete

## Notes

- CORS origin enforced via `CLIENT_ORIGIN`; credentials enabled.
- Cookies: `SameSite=None; Secure` in production, `Lax` in development.
- Rate limiting applied to `/auth/register`, `/auth/login`, `/api/bookings`.
