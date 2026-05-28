# Backend

Express + Postgres API for contact, views, and stats cache.

## Local dev

1. Create a `.env` file from `.env.example`.
2. Run the SQL in `sql/001_init.sql` against your database.
3. Start the server:
   - `npm run dev -w backend`

## Endpoints

- `GET /api/health`
- `POST /api/contact`
- `GET /api/views/:slug`
- `POST /api/views/:slug`
- `GET /api/stats`
