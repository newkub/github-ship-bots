---
name: api
description: Backend HTTP API for ship-feed
related:
  - AGENTS.md
  - package.json
---

## Goal

Expose a secure, type-safe HTTP API for cards, auth, evidence, billing, and inspector features.

## Scope

A Cloudflare Worker package that currently uses Hono and is migrating to Elysia with Drizzle ORM and Zod.

## Execute

### 1. Architecture

- Server: Hono and Elysia
- Database: Cloudflare D1 with Drizzle ORM
- Validation: Zod
- Storage: Cloudflare R2, KV
- Auth: WorkOS
- Billing: Stripe
- Web Push: @mmmike/web-push
- Deployment: Wrangler

### 2. Platform

- Runtime: Bun
- Serverless: Cloudflare Workers
- Database: D1 (SQLite)
- Target: `packages/worker`

### 3. Target User

Other workspaces and the GitHub bot that call this API.

### 4. Skills

- bun: /follow-lang-bun
- hono: /follow-framework-hono
- elysia: /follow-framework-elysia
- drizzle: /follow-tool-drizzle
- zod: /follow-tool-zod
- wrangler: /follow-tool-wrangler

### 5. Workspaces

- uses: `packages/orchestrator`, `packages/shared`
- used by: `packages/worker`

## Rules

1. All new routes use Zod for input validation.
2. New tables use Drizzle ORM with D1.
3. Keep the API backward-compatible while migrating from Hono to Elysia.

## Expected Outcome

A typed, validated, and well-documented backend API.
