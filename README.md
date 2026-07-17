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

`DATABASE_URL` will be supplied by the Neon integration in Vercel. After connecting Neon to this Vercel project, pull the environment locally:

```bash
vercel env pull .env.local --yes
```

No database migration is included yet; the RSVP schema will be designed when that feature is implemented.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
```
