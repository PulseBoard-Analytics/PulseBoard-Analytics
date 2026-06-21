# Contributing to PulseBoard

Thanks for your interest! Here's how to get started.

## Dev setup

1. Fork + clone the repo
2. Follow the local setup steps in README.md
3. Create a feature branch: `git checkout -b feat/my-feature`
4. Make your changes, keeping commits atomic and conventional (`feat:`, `fix:`, `chore:`)
5. Run `npm run lint && npm run typecheck && npm test` before pushing
6. Open a PR against `main` with a clear description

## Commit style

We follow Conventional Commits:
- `feat: add CSV export`
- `fix: correct KPI percentage calc`
- `chore: upgrade Prisma to 6.x`

## Code standards

- TypeScript strict mode  no `any`, no `!` non-null assertions
- All API inputs validated with Zod
- Server Components by default; `"use client"` only for interactivity
- shadcn/ui primitives for all UI components
