# Vercel Config And Draft Deploy Plan

This document defines a minimal Vercel configuration for `ez-events` and a step-by-step draft deployment plan.

## 1) Vercel Config

Create `vercel.json` in the project root with:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "installCommand": "npm ci",
  "buildCommand": "npm run build"
}
```

Notes:
- Keep config minimal for a first deploy.
- If your Git repo root is above `ez-events`, set **Root Directory** to `ez-events` in Vercel Project Settings.

## 2) Required Environment Variables

Add these in Vercel Project Settings -> Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Set them for:
- `Preview`
- `Production`

## 3) Draft Deployment Plan

1. Push current branch to GitHub.
2. In Vercel, click **Add New Project** and import the repo.
3. Confirm:
   - Framework: `Next.js`
   - Root Directory: `ez-events` (if repo is monorepo-style)
4. Add the 2 Supabase environment variables.
5. Trigger first deploy (Preview is fine).
6. Open the preview URL and run smoke tests:
   - Signup/Login
   - Events dashboard loads
   - Search/filter/load more
   - Create event
   - Edit event
   - Delete event from edit page
   - Logout
7. Fix any issues, push updates, and verify fresh Preview deploys.
8. Promote to production by merging to production branch (or using Vercel promote flow).

## 4) Smoke Test Checklist (Quick)

- Auth:
  - Login redirects to `/events`
  - Logout returns to `/login`
- Events:
  - List renders seeded data
  - Search + sport filter return expected rows
  - Load more appends records without full reload
  - Create event appears in list
  - Edit updates persisted fields
  - Delete from edit page removes event

## 5) Common Failure Points

- Missing env vars in Vercel (`500`/auth failures).
- Wrong Root Directory (build fails or wrong app deployed).
- Supabase URL/key mismatch between local and Vercel environments.
