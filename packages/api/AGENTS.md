---
name: api
description: HTTP API for ship-feed
related:
  - ../../AGENTS.md
---

## Goal

Expose a type-safe HTTP API for cards, auth, evidence, billing, learning, and notifications.

## Scope

Elysia-based API mounted by `packages/worker`. Uses D1 for persistence, R2 for evidence, KV for sessions, WorkOS for auth, and Stripe for billing.

## Execute

### 1. Architecture

- elysia: /follow-lib-elysia
- zod: /follow-lib-zod
- drizzle-orm: /follow-lib-drizzle
- stripe: /follow-service-stripe
- @workos-inc/node: /follow-service-workos
- @mmmike/web-push: /learn-from-web
- cloudflare workers types: /learn-from-web

### 2. Platform

- Runs on Cloudflare Workers
- Database: Cloudflare D1 (SQLite)
- Object storage: Cloudflare R2
- Session store: Cloudflare KV
- Auth: WorkOS
- Billing: Stripe
- Exports: `./src/index.ts`

### 3. Target User

Frontend clients (web, mobile) and the GitHub bot. Not called directly by end users.

### 4. Skills

- follow-lib-elysia: /follow-lib-elysia
- follow-lib-zod: /follow-lib-zod
- follow-lib-drizzle: /follow-lib-drizzle

### 5. Workspaces

- `packages/api`: use `packages/orchestrator`, `packages/shared`

## Rules

- Keep routes under `src/routes/`.
- Use `withEnv` for request-scoped environment.
- Validate all inputs with Zod.
- Run `bun run db:migrate:local` before local tests.

## Expected Outcome

API mounts cleanly in `packages/worker` and passes lint and tests.
