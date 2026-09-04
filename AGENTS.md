---
name: ship-feed
description: Card-driven autonomous development for GitHub projects
related:
  - apps/landing
  - apps/web
  - apps/mobile
  - packages/api
  - packages/bot
  - packages/cli
  - packages/orchestrator
  - packages/shared
  - packages/worker
---

## Goal

Build and ship GitHub projects with a human-in-the-loop card workflow. Ideas, pull requests, merges, and releases become cards that humans approve or reject; the system handles implementation, testing, evidence, shipping, and learning.

## Scope

This is a Bun + TypeScript monorepo. It contains a marketing landing site, a web dashboard, a mobile PWA, a GitHub bot, a dependency update CLI, a Cloudflare Worker API, an orchestrator for the ship loop, and a shared package. This file is the root source of truth for architecture, platform, target users, and workspace conventions.

## Execute

### 1. Analyze Project

1. Read this `AGENTS.md` and `package.json` before editing.
2. Use `bun --filter '*' lint` and `bun --filter '*' test` for verification.
3. Update this file when the workspace graph or tech stack changes.

### 2. Architecture

```text
                    ┌─────────────┐
                    │  ship-feed  │
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌────────────┐  ┌────────────┐  ┌────────────┐
    │  mobile    │  │    web     │  │  GitHub    │
    │  (PWA)     │  │  dashboard │  │    bot     │
    └─────┬──────┘  └──────┬──────┘  └─────┬──────┘
          └────────────────┼───────────────┘
                           ▼
                  ┌──────────────────┐
                  │ packages/api     │
                  │ (Elysia          │
                  │  D1 + R2 + KV)   │
                  └────────┬─────────┘
                           ▼
                  ┌──────────────────┐
                  │ packages/orch.   │
                  │ continuous loop  │
                  └──────────────────┘
```

- `apps/landing`: SolidJS + TanStack Router + UnoCSS marketing site
- `apps/web`: SolidJS + `@solidjs/router` + TanStack Query dashboard; API clients split by domain in `src/api/`
- `apps/mobile`: SolidJS + `@solidjs/router` + TanStack Query PWA; API clients split by domain in `src/api/`
- `packages/api`: Elysia + Drizzle ORM + Zod + D1/R2/KV/WorkOS/Stripe; `src/app.ts` composes routes, `src/middleware.ts` holds env/rate-limit/CORS, `src/routes/auth/` is split by endpoint
- `packages/bot`: Probot + Octokit for GitHub App webhooks
- `packages/cli`: Bun CLI `updatedeps` for dependency updates and conversions
- `packages/orchestrator`: Continuous ship loop for approved cards; `src/lib/github/` split into `client.ts` and `ship.ts`
- `packages/shared`: Domain types, crypto, id/time helpers, and card mapping utilities
- `packages/worker`: Cloudflare Worker entry that mounts api, bot, and orchestrator

#### Tech Mapping

- bun: /follow-lang-bun
- typescript: /follow-lang-typescript
- vite: /follow-tool-vite
- solid-js: /follow-framework-solidjs
- @tanstack/solid-query: /follow-lib-tanstack-ecosystem
- @tanstack/solid-router: /follow-lib-tanstack-ecosystem
- @solidjs/router: /learn-from-web
- elysia: /follow-lib-elysia
- drizzle-orm: /follow-lib-drizzle
- zod: /follow-lib-zod
- wrangler: /follow-service-cloudflare
- cloudflare workers: /follow-service-cloudflare
- probot: /follow-create-github-bots
- unocss: /follow-lib-unocss
- workos: /follow-service-workos
- stripe: /follow-service-stripe

### 3. Platform

- Runtime: Bun `>=1.4.0`
- Server: Cloudflare Workers via Wrangler
- Database: Cloudflare D1 (SQLite) with Drizzle ORM
- Storage: Cloudflare R2, KV
- Auth: WorkOS
- Billing: Stripe
- Frontend: SolidJS with Vite + UnoCSS
- Routing: TanStack Router (landing), `@solidjs/router` (web/mobile)
- State: TanStack Query
- Build output: `docs/` (landing), `docs/dashboard/` (web), `dist/` (mobile)
- CLI binary: `updatedeps` in `packages/cli`
- CI/CD: `.github/workflows/ci.yml` runs lint/test/build on PRs and deploys from `main` using `CLOUDFLARE_API_TOKEN`

### 4. Target User

Development teams and open-source maintainers who want an AI-assisted, approval-first shipping pipeline inside GitHub.

### 5. Skills

- ship: /ship
- realize-implementation: /realize-implementation
- refactor-codebase: /refactor-codebase
- restructure: /restructure
- run-verify: /run-verify
- review-uxui: /review-uxui
- review-quality: /review-quality
- report-what-you-do: /report-what-you-do
- report-session-status: /report-session-status
- deploy-to-cloudflare: /deploy-to-cloudflare
- follow-create-bun-cli: /follow-create-bun-cli
- update-devin-global-rules: /update-devin-global-rules

### 6. Workspaces

| No. | Workspace | Role | Uses |
|-----|-----------|------|------|
| 1 | `apps/landing` | Marketing site with TanStack Router | `packages/shared` |
| 2 | `apps/web` | Dashboard for cards, repos, billing | `packages/shared` |
| 3 | `apps/mobile` | TikTok-like swipe PWA | `packages/shared` |
| 4 | `packages/api` | HTTP API and auth | `packages/orchestrator`, `packages/shared` |
| 5 | `packages/bot` | GitHub App worker | `packages/shared` |
| 6 | `packages/cli` | Dependency update and conversion CLI | — |
| 7 | `packages/orchestrator` | Continuous ship loop | `packages/shared` |
| 8 | `packages/shared` | Domain types, crypto, and utilities | — |
| 9 | `packages/worker` | Cloudflare Worker entry | `packages/api`, `packages/bot`, `packages/orchestrator`, `packages/shared` |

## Rules

### 1. Language

All `AGENTS.md` files are written in English only.

### 2. Conventions

- Use Bun as the runtime and package manager.
- Use TypeScript for all source code.
- Prefer workspace dependencies for internal packages.
- Keep `AGENTS.md` under 250 lines.

### 3. Tech Mapping

- `bun`: /follow-lang-bun
- `typescript`: /follow-lang-typescript
- `vite`: /follow-tool-vite
- `solid-js`: /follow-framework-solidjs
- `@tanstack/solid-query`: /follow-lib-tanstack-ecosystem
- `@tanstack/solid-router`: /follow-lib-tanstack-ecosystem
- `@solidjs/router`: /learn-from-web
- `elysia`: /follow-lib-elysia
- `drizzle-orm`: /follow-lib-drizzle
- `zod`: /follow-lib-zod
- `wrangler`: /follow-service-cloudflare
- `cloudflare workers`: /follow-service-cloudflare
- `probot`: /follow-create-github-bots
- `unocss`: /follow-lib-unocss
- `workos`: /follow-service-workos
- `stripe`: /follow-service-stripe

### 4. Workspace Rules

- Each workspace may have its own `AGENTS.md` with its architecture, platform, target user, and dependencies.
- Workspaces must not duplicate root conventions; reference the root file instead.
- `packages/worker` is the only entry that assembles `api`, `bot`, and `orchestrator`.

## Rollback Plan

- Cloudflare Worker: `wrangler rollback --name github-ship-bots --version-id <previous-version>`
- D1 database: migrations are forward-only; restore from Wrangler backup/export before re-applying
- Git: force reset to previous tag `git reset --hard <previous-tag>` only for unmerged hotfixes
- R2/KV: data changes are additive; rollback by deleting bad objects/keys via `wrangler r2 object delete` or KV delete

## Expected Outcome

- Root `AGENTS.md` is the single source of truth for the project.
- Every workspace has an `AGENTS.md` that references root conventions.
- New contributors can understand the architecture, platform, and workspace graph from these files.
