# ez-events

Sports event management app for the Fastbreak AI Developer Challenge.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase (Auth + Postgres)

## Current Status

- Auth: signup, login, logout
- Events: create, list, search/filter, load more, edit, delete
- UI: toast notifications and route-level loading skeletons
- Data access: server-side only (no client Supabase calls)
- Mutations: Server Actions (auth + input validation + Supabase calls)
- Seed data: winter olympics sample CSV included

## Local Development

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.

## Environment

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

## Overview


## Architecture


## Deployment
