# Portfolio v2.0 — System Design & Architecture

> This document exists as a **system-design showcase** — not just implementation notes.
> It captures the *why* behind each architectural decision, not just the *what*.

---

## Overview

Portfolio v2.0 is a **local-first, offline-capable admin CMS** for a React portfolio site.

The challenge: a single developer needs to manage portfolio content (projects, skills, timeline, bio) from anywhere, including unreliable network conditions, without touching code or triggering a redeploy.

The solution: a monorepo with a Hono REST API backed by Supabase PostgreSQL, an admin panel with IndexedDB-backed offline write buffering, and idempotent batch sync with exponential backoff.

---

## Architecture Diagram

```
Browser (Admin)
     │
     │  Online: direct API call
     │  Offline: write to IndexedDB queue
     ▼
┌─────────────────────────┐
│  IndexedDB (Dexie.js)   │  ← offline queue / local durability
│  sync_queue store       │
└──────────┬──────────────┘
           │ on reconnect: batch flush
           ▼
┌─────────────────────────┐
│  Hono API               │  ← Vercel Serverless Function (/api/*)
│  apps/api/src/index.ts  │
│  hono/vercel adapter    │
└──────────┬──────────────┘
           │
     ┌─────┴──────┐
     │  Drizzle   │  ← type-safe ORM over postgres.js
     │  ORM       │
     └─────┬──────┘
           │
┌──────────▼──────────────┐
│  Supabase PostgreSQL    │  ← managed Postgres, PgBouncer pooling
│  Tables:                │
│  projects, skills,      │
│  timeline, bio,         │
│  messages, sync_log     │
└─────────────────────────┘
```

---

## Key System Design Decisions

### 1. Monorepo with Shared Type Contracts

**`packages/shared`** contains TypeScript interfaces and Zod schemas used by both `apps/web` and `apps/api`.

**Why this matters:** Without shared contracts, frontend and backend types drift silently. A DB column rename breaks the UI at runtime — not at compile time. With shared types, the TypeScript compiler surfaces every mismatch immediately, across both packages, before the code ever runs.

```
packages/shared/src/types.ts   → interface Project { id: number; name: string; ... }
packages/shared/src/schemas.ts → const projectSchema = z.object({ name: z.string()... })
```

The Zod schemas serve double duty: server-side request validation (via `@hono/zod-validator`) and client-side form validation. One schema, two use sites, no duplication.

---

### 2. JWT Auth Boundary

Admin routes are protected by a JWT middleware (`apps/api/src/middleware/auth.ts`).

Design constraints for a personal portfolio:
- No user registration — single admin only
- Admin password stored as a **bcrypt hash** in an environment variable (not in the DB)
- JWT signed with `HS256`, 8-hour expiry
- Client stores token in `localStorage` — acceptable for a personal tool where XSS risk is low

**Public vs. admin routing pattern:**
```
GET  /api/projects         → public, no auth required
POST /api/projects/admin   → requires valid Bearer token
PUT  /api/projects/admin/:id → requires valid Bearer token  
DELETE /api/projects/admin/:id → requires valid Bearer token
```

The same Hono router file handles both public reads and authenticated writes, minimizing boilerplate while keeping the auth boundary explicit.

---

### 3. Local-First / Offline-First Writes

**Problem:** Admin writes can fail mid-session if on mobile or flaky WiFi. Losing a form submission is frustrating.

**Solution:** Every admin write goes through `syncManager.js`:

```
Admin submits form
       │
       ▼
enqueueOperation() → IndexedDB (instant, synchronous-feeling)
       │
       ▼
Attempt immediate syncBatch() call to server
       │
    Success?
   ╱        ╲
  Yes         No
   │           │
Remove        Operation stays queued
from IDB      scheduleRetry() with backoff
```

**Last-Write-Wins (LWW) conflict strategy:** Since there is only one admin, concurrent write conflicts cannot occur. LWW is correct and sufficient here. A multi-user CMS would need CRDT or operational transform — documented in [Future Considerations](#future-considerations) below.

---

### 4. Idempotent Operations via operation_id

**Problem:** Network retries create duplicate writes. A "create project" that succeeds server-side but returns a network error to the client will be retried — creating a duplicate.

**Solution:** Every write operation gets a **UUID v4 `operation_id`** assigned on the client before any network call.

```
Client generates: operation_id = crypto.randomUUID()
           │
           ▼
Server checks: SELECT * FROM sync_log WHERE operation_id = ?
           │
    Already exists?
   ╱                ╲
  Yes                No
   │                  │
Skip (idempotent)   Process write → INSERT into sync_log
```

The `sync_log` table is the idempotency log. It grows over time (operations are never deleted) and provides a complete audit trail of all admin writes.

---

### 5. Health Checks Against the Actual Dependency

**`GET /api/health`** executes `SELECT 1` against the Supabase PostgreSQL connection before returning `ok: true`.

**Why not just check liveness (200 OK)?** A pod/function can be alive but unable to reach the database. Liveness checks that don't probe the actual dependency give false confidence — you declare "healthy" while every API call is actually failing.

**StatusIndicator.jsx** in the admin panel polls this endpoint every 15 seconds and shows latency. If the DB connection is unhealthy, the indicator turns red before any admin write fails — giving the user advance warning.

---

### 6. Exponential Backoff / Circuit-Breaker Pattern

Both `useHealthCheck.js` and `syncManager.js` implement exponential backoff:

| Attempt | Delay |
|:-------:|:-----:|
| 1st     | 1s    |
| 2nd     | 2s    |
| 3rd     | 4s    |
| 4th     | 8s    |
| …       | …     |
| Max     | 60s (sync) / 120s (health) |

**Why this matters:** Without backoff, every client hammering a failing server with instant retries creates a **thundering herd** — the server comes back online and immediately gets overwhelmed by every client's simultaneous retry storm. Backoff distributes retries over time, giving the system space to recover.

On reconnect, `useHealthCheck` fires `onServerReconnect()` which immediately resets the delay to 1s and flushes the offline queue.

---

### 7. Supabase PostgreSQL with PgBouncer (Serverless-Optimized)

Vercel Serverless Functions are stateless and create a new process per invocation. This means a new DB connection per request if not handled carefully — PostgreSQL has a hard connection limit.

**Configuration (`apps/api/src/db/client.ts`):**
```typescript
const client = postgres(connectionString, {
  max: 1,       // one connection per serverless invocation
  prepare: false // required for Supabase PgBouncer in transaction mode
});
```

Supabase's PgBouncer (on port 6543) pools connections at the infrastructure level, so `max: 1` per function × N concurrent functions still stays within Postgres' connection limit. `prepare: false` is required because PgBouncer in transaction mode doesn't support PostgreSQL prepared statements.

---

## Vercel Deployment (Same-Domain Monorepo)

```
vercel.json (root):
  buildCommand: pnpm --filter @portfolio/web build
  outputDirectory: apps/web/dist
  rewrites:
    /api/(.*) → /api/index   ← Hono serverless function
    /(.*)     → /index.html  ← React SPA fallback

api/index.ts (root):
  import { handle } from 'hono/vercel'
  import app from './apps/api/src/index'
  export default handle(app)
```

**Benefits of same-domain deployment:**
- Zero CORS configuration — `/api/*` calls from React are same-origin
- One preview URL per PR — test frontend + backend together
- Hono's `basePath('/api')` and Vercel's rewrite work together cleanly

---

## Future Considerations

> These are intentional non-decisions for the current scope. Noting them shows system-design maturity — knowing *when* to add complexity, not just *how*.

| Scenario | Current approach | When to change |
|---|---|---|
| Multiple clients (mobile app) hitting the same API | Frontend + API co-deployed | Split `apps/api` into separate Railway/Render service |
| Multiple admin users with conflict resolution | LWW (no conflict possible with 1 user) | Implement CRDT or server-reconciled OT |
| High message volume (contact form) | Save to DB synchronously | Add a queue (Redis + worker) for async email delivery |
| JWT token revocation | Stateless JWT — can't revoke before expiry | Add a token blocklist in Redis or Supabase |
| Image uploads for projects | URLs only (external hosting) | Add Supabase Storage + presigned URL upload flow |

---

## Repository Structure

```
portfolio-v2.0/
├── api/                          # Vercel serverless entry (hono/vercel handle)
│   └── index.ts
├── apps/
│   ├── web/                      # React + Vite SPA (public + admin)
│   │   └── src/
│   │       ├── admin/            # Admin panel components (CRUD + auth)
│   │       ├── components/       # Public site components (API-fetching)
│   │       └── lib/              # api.js, db.js (Dexie), syncManager, useHealthCheck
│   └── api/                      # Hono backend source
│       └── src/
│           ├── db/               # Drizzle schema, client, seed
│           ├── middleware/       # JWT auth, error handler
│           ├── routes/           # health, auth, projects, skills, timeline, bio, contact, sync
│           └── lib/              # idempotency.ts
└── packages/
    └── shared/                   # Shared TypeScript types + Zod schemas
        └── src/
            ├── types.ts
            └── schemas.ts
```
