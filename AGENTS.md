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
- `apps/web`: SolidJS + `@solidjs/router` + TanStack Query dashboard
- `apps/mobile`: SolidJS + `@solidjs/router` + TanStack Query PWA
- `packages/api`: Elysia + Drizzle ORM + Zod + D1/R2/KV/WorkOS/Stripe
- `packages/bot`: Probot + Octokit for GitHub App webhooks
- `packages/cli`: Bun CLI `updatedeps` for dependency updates and conversions
- `packages/orchestrator`: Continuous ship loop for approved cards
- `packages/shared`: Domain types, crypto, and card mapping utilities
- `packages/worker`: Cloudflare Worker entry that mounts api, bot, and orchestrator

#### Tech Mapping

- bun: /follow-lang-bun
- typescript: /learn-from-web
- solid-js: /follow-lib-solid
- @tanstack/solid-query: /follow-lib-tanstack-query
- @tanstack/solid-router: /follow-lib-tanstack-router
- @solidjs/router: /follow-lib-solid-router
- elysia: /follow-framework-elysia
- drizzle-orm: /follow-tool-drizzle
- zod: /follow-tool-zod
- wrangler: /follow-tool-wrangler
- probot: /follow-github-app
- unocss: /follow-lib-unocss
- cloudflare workers: /follow-tool-wrangler

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

### 4. Target User

Development teams and open-source maintainers who want an AI-assisted, approval-first shipping pipeline inside GitHub.

### 5. Skills

- ship: /ship
- realize-implementation: /realize-implementation
- refactor-codebase: /refactor-codebase
- run-verify: /run-verify
- report-uxui: /report-uxui
- report-what-you-do: /report-what-you-do
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
- `solid-js`: /follow-lib-solid
- `@tanstack/solid-query`: /follow-lib-tanstack-query
- `@tanstack/solid-router`: /follow-lib-tanstack-router
- `@solidjs/router`: /follow-lib-solid-router
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
