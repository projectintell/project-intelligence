# Project Intelligence

Single Next.js 14 (App Router) codebase serving three things:

1. **Marketing site** — `src/app/(marketing)` — home, pricing.
2. **Claim Score** — `src/app/claim-score` — subcontractor-facing paid rating tool (Stripe Checkout → upload → AI scoring → results dashboard).
3. **Claims Intelligence** — `src/app/dashboard` — consultant-facing case/document/event dashboard.

All three share one Dataverse data layer (`src/lib/dataverse.ts`), one Stripe account, one Claude-based extraction pipeline (`src/lib/claude.ts`), and Vercel Blob for document storage.

This is a scaffold — most pages are structural stubs with `TODO` comments marking what's not built yet. See `build-decisions.md` and `Claim Score - Schema and Process Scoping.md` in the project folder for the decisions this scaffold implements.

## Status

Scaffolded 2026-07-07. Not yet installed, built, or deployed anywhere. The build sandbox this was created in has no npm registry access, so `npm install` / `npm run build` have **not** been run or verified locally — that needs to happen on your machine or via Vercel's own build step (which has full registry access regardless).

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in real secrets — never commit .env.local
npm run dev
```

## Environment variables

See `.env.example`. Notably:
- `DATAVERSE_CLIENT_SECRET` — generated during the S2S app registration setup on 2026-07-07; rotate and store properly (e.g. directly in Vercel's environment variable settings) rather than reusing whatever was used for testing.
- Dataverse calls currently target the **Dev clone tables** (`cr3ed_casesdevs`, `cr3ed_documentsdevs`, `cr3ed_eventsdevs`) — safe to read/write freely, fully isolated from the live production Cases/Documents/Events tables in the same environment.

## Deploy strategy (decided 2026-07-07)

- **Repo**: private repo under Tim's personal GitHub account (not a company org, for now).
- **Model**: single `main` branch, auto-deploy to production on every push via Vercel's GitHub integration. Every branch/PR still gets its own preview URL — check the preview before merging to `main`, since there's no separate staging gate.
- **Vercel team**: `projectintell's projects` (already exists, no projects created in it yet).

### Steps to actually connect this (manual — needs your GitHub login, not done by Claude)

This folder is delivered **without** a `.git` history — the build sandbox's file mount corrupts git's internal files, so version control needs to start on your own machine:

1. From this folder, initialize git and make the first commit:
   ```bash
   git init
   git add -A
   git commit -m "Initial scaffold"
   ```
2. Create a new **private** repo on your personal GitHub account (e.g. `project-intelligence`).
3. Push:
   ```bash
   git remote add origin <your-repo-url>
   git branch -M main
   git push -u origin main
   ```
4. In Vercel (`projectintell's projects` team) → **Add New Project** → Import the GitHub repo → it will auto-detect Next.js. Set the environment variables from `.env.example` before the first deploy.
5. Every push to `main` will now auto-deploy to production; every other branch gets a preview URL.

## Known gaps (tracked as TODOs in code / Planner)

- No auth yet on `/dashboard` (Claims Intelligence) or account creation for Claim Score.
- Extraction pipeline (`lib/claude.ts`) is a placeholder — real system prompt and Claim Signal underscore-normalisation logic still need porting from the existing Power Automate flow.
- Only Cl