# ez-events

Sports Event Management application for the Fastbreak AI Developer Challenge.

## Stack

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

## Project Status

Core auth and event dashboard functionality is implemented.

Implemented now:

- Email/password sign up and login with Supabase Auth
- Auth-aware root routing (`/` -> `/events` or `/login`)
- Events overview page (`/events`) with server-side search + sport filter
- Load-more UX for incremental event listing
- Create event UI (`/events/new`) and API endpoint
- Shared TypeScript event model + DTO parsing
- Seed CSV for winter olympics sample events

Still pending:

- Logout flow
- Update/delete event UI + APIs (full CRUD)
- Middleware-based central route protection
- Toast notifications and richer loading states
- Deployment configuration and production verification

## Implementation Phases (Review-Gated)

Each phase ends with a review checkpoint before continuing.

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

Status: mostly complete for create/list/search/filter; full CRUD and Server Actions alignment pending.

### Phase 3 — UI Polish & Deployment

- Loading and error states
- Responsive layout and final UX
- Code organization pass for server-only DB access
- Vercel deployment + environment variables

Status: not started.

## Local Development

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.

## API Test Cases

- Update endpoint validation scenarios: `docs/update-event-test-cases.md`

## Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Additional server-side keys may be added later if needed.

## Data Model (Planned)

`events` table:

- `id` (uuid, primary key)
- `owner_user_id` (uuid, references auth.users)
- `name` (text)
- `sport_type` (text)
- `starts_at` (timestamptz)
- `description` (text)
- `venues` (text[])
- `updated_at` (timestamptz, default now, trigger-managed)
- `created_at` (timestamptz, default now)

RLS policies are enabled so users can only access their own events.

## Constraints To Protect

- Supabase DB calls must never run in client components
- Prefer Server Actions for mutations
- Search/filter must refetch server-side (no client-only filtering)

## Open Questions

- Confirm if Google OAuth is in scope for this submission

## Deployment

Target: Vercel, with environment variables configured.

## Changelog

- 2026-02-16: Initialized project and phased plan.
