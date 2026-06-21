# PulseBoard Analytics

> Real-time collaborative analytics dashboard — track metrics, visualise trends, and share live data with your team.

[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Database-Supabase-green)](https://supabase.com)

---

## Live Demo

🔗 [pulseboard-analytics.vercel.app](https://pulseboard-analytics.vercel.app)

Demo credentials: `demo@pulseboard.dev` / `password123`

---

## Screenshot

> Glassmorphism dark dashboard with teal accent, real-time KPI tiles, area charts, and sidebar navigation.

---

## Features

| Feature | Status |
|---|---|
| Email/password authentication | ✅ |
| GitHub OAuth login | ✅ |
| Create / rename / delete boards | ✅ |
| Add metrics manually | ✅ |
| CSV import (up to 500 rows) | ✅ |
| Real-time SSE broadcast | ✅ |
| Public share links (no login) | ✅ |
| KPI tiles with trend indicators | ✅ |
| Area chart + bar chart (Recharts) | ✅ |
| Analytics page | ✅ |
| Settings (theme, profile, security) | ✅ |
| Dark / light mode | ✅ |
| Glassmorphism sidebar | ✅ |
| Ambient audio toggle | ✅ |
| Responsive (320px → desktop) | ✅ |
| Deployed on Vercel | ✅ |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript strict |
| Styling | Tailwind CSS v4 + custom glassmorphism UI |
| Database | PostgreSQL via Supabase |
| ORM | Prisma 6 |
| Auth | Auth.js v5 (NextAuth) — email + GitHub OAuth |
| Real-time | Server-Sent Events (SSE) |
| Charts | Recharts 2 |
| Validation | Zod on every API boundary |
| Testing | Vitest + React Testing Library + Playwright |
| Deployment | Vercel |

---

## Local Setup

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) or [Neon](https://neon.tech) PostgreSQL database
- A GitHub OAuth App (optional)

### Steps

```bash
# 1. Clone
git clone https://github.com/PulseBoard-Analytics/PulseBoard-Analytics.git
cd PulseBoard-Analytics/pulseboard

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Fill in your database URLs and AUTH_SECRET

# 4. Push schema to database
npx prisma db push

# 5. Seed demo data
node seed-local.mjs

# 6. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | Pooled Postgres connection string |
| `DIRECT_URL` | ✅ | Direct Postgres connection string |
| `AUTH_SECRET` | ✅ | Random 32+ char secret |
| `NEXTAUTH_URL` | ✅ | App URL e.g. `http://localhost:3000` |
| `AUTH_GITHUB_ID` | Optional | GitHub OAuth App client ID |
| `AUTH_GITHUB_SECRET` | Optional | GitHub OAuth App client secret |

---

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npm test             # Vitest unit + component tests
npm run test:e2e     # Playwright e2e tests
npm run db:push      # Push Prisma schema
npm run db:studio    # Open Prisma Studio
node seed-local.mjs  # Seed demo data
```

---

## Project Structure

```
pulseboard/
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seed script
├── public/
│   └── music/               # Ambient audio
├── src/
│   ├── app/
│   │   ├── (app)/           # Authenticated routes
│   │   │   ├── analytics/   # Analytics dashboard
│   │   │   ├── boards/      # Board list + detail
│   │   │   ├── settings/    # User settings
│   │   │   ├── sources/     # Data sources
│   │   │   └── team/        # Team management
│   │   ├── api/             # SSE stream + NextAuth
│   │   ├── auth/            # Sign in/up/error pages
│   │   └── share/           # Public read-only view
│   ├── components/
│   │   ├── analytics/       # Analytics view
│   │   ├── auth/            # Auth forms
│   │   ├── boards/          # Board components
│   │   ├── charts/          # KPI, line, bar charts
│   │   ├── layout/          # Sidebar + nav
│   │   ├── metrics/         # Metric dialogs + table
│   │   ├── settings/        # Settings view
│   │   ├── share/           # Share dashboard
│   │   └── ui/              # shadcn/ui primitives
│   ├── hooks/               # useToast
│   ├── lib/                 # auth, db, csv, sse, utils
│   ├── server/actions/      # Server Actions
│   └── tests/               # Unit, component, e2e
└── .github/workflows/ci.yml
```

---

## Architecture Decisions

### Server-Sent Events for real-time
SSE is native HTTP, works on Vercel without extra services, and is perfect for one-directional server → browser pushes. Zero external dependencies.

### Server Actions for mutations
Keeps mutations collocated with data, typed end-to-end, no fetch boilerplate.

### JWT sessions
Stateless — no DB round-trip on every request. One-line change to switch to database sessions.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

---

## License

MIT © 2025 PulseBoard Analytics
