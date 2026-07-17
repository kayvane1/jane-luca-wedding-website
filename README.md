# Jane & Luca's wedding website

Infrastructure-only starting point for Jane and Luca's wedding website. The app uses Next.js and TypeScript, is hosted on Vercel, and is ready for a Neon Postgres database to store RSVP data.

## Local development

Prerequisites: Node.js 20.9 or newer and npm.

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Environment

Copy `.env.example` to `.env.local` for local development. Do not commit `.env.local`.

`DATABASE_URL` and `DATABASE_URL_UNPOOLED` are supplied by the Neon integration in Vercel. Pull the preview environment locally before running database commands:

```bash
vercel env pull .env.local --yes --environment=preview
```

The app uses the pooled `DATABASE_URL` at runtime and the direct `DATABASE_URL_UNPOOLED` for migrations.

Vercel may mask integration-managed sensitive values when pulling them locally. If either URL is empty, copy the pooled and direct connection strings from Neon's **Connect** dialog into the gitignored `.env.local` file.

## Database

For future schema changes, generate and apply a migration, then run the non-destructive smoke test:

```bash
npm run db:generate
npm run db:check
npm run db:migrate
npm run db:test
```

The smoke test inserts an RSVP, reads it back, and deletes it again.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
```
