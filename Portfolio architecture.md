
# Portfolio v2.0 — Full System Architecture

Tech stack: **React + Vite** (frontend) · **Hono** (backend) · **PostgreSQL** (Neon/Supabase) · **Drizzle ORM** · **IndexedDB (Dexie.js)** for offline sync · **pnpm workspaces** monorepo

---

## Full File Structure

```
portfolio-v2.0/
├── apps/
│   ├── web/                              # React + Vite frontend (public site + admin panel)
│   │   ├── index.html
│   │   ├── vite.config.js
│   │   ├── package.json
│   │   ├── public/
│   │   └── src/
│   │       ├── App.jsx                   # Root routes (public + /admin/* protected routes)
│   │       ├── main.jsx
│   │       ├── index.css
│   │       │
│   │       ├── components/               # PUBLIC components (existing, unchanged)
│   │       │   ├── About.jsx
│   │       │   ├── CommandPalette.jsx
│   │       │   ├── Contact.jsx           # now POSTs to /api/contact instead of Web3Forms only
│   │       │   ├── Dashboard.jsx         # now pulls real metrics from DB
│   │       │   ├── Footer.jsx
│   │       │   ├── Hero.jsx
│   │       │   ├── LanguageStatsBar.jsx
│   │       │   ├── Navbar.jsx
│   │       │   ├── ProjectModal.jsx
│   │       │   ├── Projects.jsx          # now fetches from GET /api/projects
│   │       │   ├── Skills.jsx            # now fetches from GET /api/skills
│   │       │   ├── Terminal.jsx
│   │       │   ├── ThreeBackground.jsx
│   │       │   ├── Timeline.jsx          # now fetches from GET /api/timeline
│   │       │   └── Toast.jsx
│   │       │
│   │       ├── admin/                    # NEW — admin panel components
│   │       │   ├── AdminLogin.jsx
│   │       │   ├── AdminLayout.jsx       # nav + StatusIndicator wrapper
│   │       │   ├── AdminDashboard.jsx    # overview + sync queue widget
│   │       │   ├── AdminProjects.jsx     # CRUD table + form
│   │       │   ├── AdminSkills.jsx       # CRUD table + form
│   │       │   ├── AdminTimeline.jsx     # CRUD table + form
│   │       │   ├── AdminBio.jsx          # single-row edit form
│   │       │   ├── StatusIndicator.jsx   # 🟢/🔴 DB connection indicator (health poll)
│   │       │   └── SyncQueueBadge.jsx    # "3 changes pending" indicator
│   │       │
│   │       ├── lib/                      # NEW — frontend infra
│   │       │   ├── api.js                # fetch wrapper, base URL, auth header injection
│   │       │   ├── db.js                 # Dexie.js IndexedDB setup (offline queue store)
│   │       │   ├── syncManager.js        # queue processor, backoff, flush-on-reconnect
│   │       │   └── useHealthCheck.js     # hook: polls /api/health, expo backoff when down
│   │       │
│   │       ├── data/
│   │       │   └── portfolioData.js      # DEPRECATED — kept temporarily as fallback/seed data
│   │       │
│   │       ├── pages/
│   │       │   ├── AboutPage.jsx
│   │       │   ├── ContactPage.jsx
│   │       │   ├── DashboardPage.jsx
│   │       │   ├── Home.jsx
│   │       │   ├── ProjectsPage.jsx
│   │       │   └── TerminalPage.jsx
│   │       │
│   │       └── utils/
│   │
│   └── api/                              # NEW — Hono backend
│       ├── package.json
│       ├── tsconfig.json
│       ├── vercel.json                   # if deployed as its own Vercel project
│       └── src/
│           ├── index.ts                  # Hono app entry, route mounting, CORS
│           ├── middleware/
│           │   ├── auth.ts               # JWT verification middleware (protects /api/admin/*)
│           │   └── errorHandler.ts
│           ├── routes/
│           │   ├── health.ts             # GET /api/health — SELECT 1 DB ping
│           │   ├── auth.ts               # POST /api/auth/login, /logout
│           │   ├── contact.ts            # POST /api/contact (public)
│           │   ├── projects.ts           # GET (public) + admin CRUD
│           │   ├── skills.ts             # GET (public) + admin CRUD
│           │   ├── timeline.ts           # GET (public) + admin CRUD
│           │   ├── bio.ts                # GET (public) + admin PUT
│           │   └── sync.ts               # POST /api/sync — batch endpoint for offline queue flush
│           ├── db/
│           │   ├── client.ts             # Drizzle + Postgres connection (Neon)
│           │   └── schema.ts             # tables: projects, skills, timeline, bio, messages, sync_log
│           └── lib/
│               └── idempotency.ts        # operation_id dedup check (for /api/sync)
│
├── packages/
│   └── shared/                           # NEW — shared between web & api
│       ├── package.json
│       └── src/
│           ├── types.ts                  # Project, Skill, TimelineEntry, Bio, Message types
│           └── schemas.ts                # Zod validation schemas (used both client + server)
│
├── ARCHITECTURE.md                       # NEW — system design write-up for portfolio credibility
├── package.json                          # root workspace config
├── pnpm-workspace.yaml                   # NEW
├── .env.example
├── .gitignore
└── vercel.json                           # updated monorepo routing (web + api)
```

---

## What's new vs. your current structure

| Area                      | Change                                                                          |
| ------------------------- | ------------------------------------------------------------------------------- |
| Root                      | Added`apps/`, `packages/`, `pnpm-workspace.yaml` — monorepo conversion   |
| `apps/web`              | Your existing`src/` moves here almost as-is                                   |
| `apps/web/src/admin/`   | Entirely new — admin panel UI                                                  |
| `apps/web/src/lib/`     | New — API client, IndexedDB (Dexie), sync manager, health-check hook           |
| `apps/api/`             | Entirely new — Hono backend, not existing before                               |
| `packages/shared/`      | New — shared types/Zod schemas so frontend and backend never drift out of sync |
| `data/portfolioData.js` | Kept temporarily as fallback/seed data, phased out as DB migration completes    |

---

## Migration order (keeps the live site working throughout)

1. `git checkout -b feat/monorepo-migration`
2. Move existing code into `apps/web/` using `git mv` (preserves history)
3. Scaffold `apps/api/` — health check + DB connection first
4. Add `packages/shared` types/schemas
5. Build auth (`/api/auth/login` + JWT middleware)
6. Build Projects CRUD (backend + `AdminProjects.jsx`) — first full vertical slice
7. Repeat pattern for Skills → Timeline → Bio
8. Migrate public components (`Projects.jsx`, etc.) from `portfolioData.js` → API fetch
9. Add `StatusIndicator.jsx` (health polling) to `AdminLayout.jsx`
10. Add offline queue: `lib/db.js` (Dexie) + `lib/syncManager.js` + `/api/sync` + idempotency check
11. Add exponential backoff to health polling and sync retries
12. Write `ARCHITECTURE.md` documenting the design decisions (LWW conflict strategy, idempotency, circuit breaker) — this is what turns it into a system-design showcase
13. Test on Vercel preview deployment → merge to `main` only once verified

---

## Key system-design concepts this structure demonstrates

- Monorepo with shared type contracts (`packages/shared`)
- JWT-based auth boundary (`middleware/auth.ts`)
- Local-first / offline-first writes with eventual consistency (`lib/db.js` + `syncManager.js`)
- Idempotent operations (`lib/idempotency.ts`) to prevent duplicate writes on retry
- Health checks against the actual dependency (DB), not just liveness (`routes/health.ts`)
- Exponential backoff / circuit-breaker pattern for polling and sync retries
