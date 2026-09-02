---
name: ship-feed
description: Card-driven autonomous development for GitHub projects
related:
  - apps/landing
  - apps/web
  - apps/mobile
  - packages/api
  - packages/bot
  - packages/orchestrator
  - packages/shared
  - packages/worker
---

## Goal

Build and ship GitHub projects with a human-in-the-loop card workflow. Ideas, pull requests, merges, and releases become cards that humans approve or reject; the system handles implementation, testing, evidence, shipping, and learning.

## Scope

This is a Bun + TypeScript monorepo. It contains a marketing landing site, a web dashboard, a mobile PWA, a GitHub bot, a Cloudflare Worker API, an orchestrator for the ship loop, and a shared package. This file is the root source of truth for architecture, platform, target users, and workspace conventions.

## Execute

### 1. Architecture

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
                  │ (Hono + Elysia   │
                  │  D1 + R2 + KV)   │
                  └────────┬─────────┘
                           ▼
                  ┌──────────────────┐
                  │ packages/orch.   │
                  │ continuous loop  │
                  └──────────────────┘
```

- `apps/landing`: SolidJS + TanStack Router + UnoCSS marketing site
- `apps/web`: SolidJS + TanStack Query + `@solidjs/router` dashboard
- `apps/mobile`: SolidJS + `@solidjs/router` + TanStack Query PWA
- `packages/api`: Hono + Elysia + Drizzle ORM + Zod + D1/R2/KV/WorkOS/Stripe
- `packages/bot`: Probot + Octokit for GitHub App webhooks
- `packages/orchestrator`: Continuous ship loop for approved cards
- `packages/shared`: Domain types and utilities
- `packages/worker`: Cloudflare Worker entry that mounts api, bot, and orchestrator

### 2. Platform

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

### 3. Target User

Development teams and open-source maintainers who want an AI-assisted, approval-first shipping pipeline inside GitHub.

### 4. Skills

- update-project: /update-project
- follow-lib-unocss: /follow-lib-unocss
- follow-lib-solid: /follow-lib-solid
- follow-lib-tanstack-query: /follow-lib-tanstack-query
- follow-lib-tanstack-router: /follow-lib-tanstack-router
- follow-framework-hono: /follow-framework-hono
- follow-framework-elysia: /follow-framework-elysia
- follow-tool-drizzle: /follow-tool-drizzle
- follow-tool-zod: /follow-tool-zod
- follow-github-app: /follow-github-app
- follow-create-bun-cli: /follow-create-bun-cli
- follow-tool-wrangler: /follow-tool-wrangler

### 5. Workspaces

| No. | Workspace | Role | Uses |
|-----|-----------|------|------|
| 1 | `apps/landing` | Marketing site with TanStack Router | `packages/shared` |
| 2 | `apps/web` | Dashboard for cards, repos, billing | `packages/shared` |
| 3 | `apps/mobile` | TikTok-like swipe PWA | `packages/shared` |
| 4 | `packages/api` | HTTP API and auth | `packages/orchestrator`, `packages/shared` |
| 5 | `packages/bot` | GitHub App worker | `packages/shared` |
| 6 | `packages/orchestrator` | Continuous ship loop | `packages/shared` |
| 7 | `packages/shared` | Domain types and utilities | — |
| 8 | `packages/worker` | Cloudflare Worker entry | `packages/api`, `packages/bot`, `packages/orchestrator`, `packages/shared` |

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
- `solid-js`: /follow-lib-solid
- `@tanstack/solid-query`: /follow-lib-tanstack-query
- `@tanstack/solid-router`: /follow-lib-tanstack-router
- `@solidjs/router`: /follow-lib-solid-router
- `hono`: /follow-framework-hono
- `elysia`: /follow-framework-elysia
- `drizzle-orm`: /follow-tool-drizzle
- `zod`: /follow-tool-zod
- `wrangler`: /follow-tool-wrangler
- `probot`: /follow-github-app
- `unocss`: /follow-lib-unocss

### 4. Workspace Rules

- Each workspace may have its own `AGENTS.md` with its architecture, platform, target user, and dependencies.
- Workspaces must not duplicate root conventions; reference the root file instead.
- `packages/worker` is the only entry that assembles `api`, `bot`, and `orchestrator`.

## Expected Outcome

- Root `AGENTS.md` is the single source of truth for the project.
- Every workspace has an `AGENTS.md` that references root conventions.
- New contributors can understand the architecture, platform, and workspace graph from these files.
