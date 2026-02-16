# ez-events

Sports Event Management application for the Fastbreak AI Developer Challenge.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase (Auth + Postgres)
- shadcn/ui + react-hook-form

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

Scaffolded Next.js project with Tailwind and TypeScript. Implementation pending.

## Implementation Phases (Review-Gated)

Each phase ends with a review checkpoint before continuing.

### Phase 1 — Foundation & Infrastructure

- Supabase project setup and auth config
- `.env.local` wiring (no secrets committed)
- Auth flow (sign up, login, logout)
- Events table schema
- Server-side Supabase helper + typed error handling

Review checkpoint: validate auth flow, schema, and server-only data access constraints.

### Phase 2 — Core Event Management

- Event CRUD via Server Actions
- Dashboard listing (server component fetch)
- Search by name + filter by sport type with server-side refetch
- Form UX with shadcn Form + react-hook-form + toasts

Review checkpoint: confirm no client-side DB calls and that search/filter refetches from DB.

### Phase 3 — UI Polish & Deployment

- Loading and error states
- Responsive layout and final UX
- Code organization pass for server-only DB access
- Vercel deployment + environment variables

Review checkpoint: production verification and final checklist.

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

## Data Model (Planned)

`events` table:

- `id` (uuid, primary key)
- `user_id` (uuid, references auth.users)
- `name` (text)
- `sport_type` (text)
- `starts_at` (timestamptz)
- `description` (text)
- `venues` (text[] or jsonb)
- `created_at` (timestamptz, default now)

Exact SQL will be finalized during Phase 1.

## Constraints To Protect

- Supabase DB calls must never run in client components
- Prefer Server Actions for mutations
- Search/filter must refetch server-side (no client-only filtering)

## Open Questions

- Confirm venue storage format: `text[]` vs `jsonb`
- Confirm required sport types list (fixed set or free text)
- Confirm if Google OAuth is in scope for this submission

## Deployment

Target: Vercel, with environment variables configured.

## Changelog

- 2026-02-16: Initialized project and phased plan.
