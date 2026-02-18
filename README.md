# ez-events

Sports Event Management application for the Fastbreak AI Developer Challenge.
Winter Olympic Events Listing 

## Tech Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase (Auth + Postgres)

## Requirements Summary

- Supabase Auth: email/password required, Google OAuth optional
- Auth-protected routes (redirect unauthenticated users)
- Event CRUD with venue info
- Dashboard listing with server-side search and sport-type filter
- All database interactions are server-side only
  - Prefer Server Actions over API routes
  - No client-side Supabase DB calls
- Loading states, error handling, toast notifications
- Deploy to Vercel, submit repo + URL

## Features
- Email/password sign up and login with Supabase Auth
- Auth-aware root routing (`/` -> `/events` or `/login`)
- Events overview page (`/events`) with server-side search + sport filter
- Load-more UX for incremental event listing
- Create event UI (`/events/new`) and API endpoint
- Shared TypeScript event model + DTO parsing
- Seed CSV for winter olympics sample events
- Middleware-based central route protection
- Toast notifications and richer loading states
- Deployment configuration and production verification

## Implementation Plan

### Phase 1 — Foundation & Infrastructure

- Supabase project setup and auth config
- Auth flow (sign up, login; logout pending)
- Events table schema
- Server-side Supabase helper + typed error handling

Status: mostly complete, logout remains.

### Phase 2 — Core Event Management

- Event create/list via API routes (update/delete pending)
- Dashboard listing (server component fetch)
- Search by name + filter by sport type with server-side refetch
- Basic form UX and inline error handling

### Phase 3 — UI Polish & Deployment

- Loading and error states
- Responsive layout and final UX
- Code organization pass for server-only DB access
- Vercel deployment + environment variables

## Local Development

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.

## Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Additional server-side keys may be added later if needed.


## Overview


## Architecture


## Deployment

Target: Vercel, with environment variables configured.
