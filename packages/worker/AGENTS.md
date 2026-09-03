---
name: worker
description: Cloudflare Worker entry for ship-feed
related:
  - ../../AGENTS.md
---

## Goal

Mount the API, bot, and orchestrator behind a single Cloudflare Worker with routing, static assets, and environment adaptation.

## Scope

The top-level worker entry. Routes `/api/*` to `packages/api`, `/webhook` to `packages/bot`, `/orchestrate` and cron to `packages/orchestrator`, and serves static assets.

## Execute

### 1. Architecture

- wrangler: /follow-service-cloudflare
- cloudflare workers: /follow-service-cloudflare
- elysia: /follow-lib-elysia (via packages/api)
- probot: /follow-create-github-bots (via packages/bot)

### 2. Platform

- Runs on Cloudflare Workers
- Wrangler dev and deploy
- Entry: `src/index.ts`
- Static assets: `ASSETS` binding, fallback to dashboard

### 3. Target User

Public internet and GitHub webhook delivery. End users reach the API, dashboard, and bot through this worker.

### 4. Skills

- deploy-to-cloudflare: /deploy-to-cloudflare
- follow-service-cloudflare: /follow-service-cloudflare

### 5. Workspaces

- `packages/worker`: use `packages/api`, `packages/bot`, `packages/orchestrator`, `packages/shared`

## Rules

- Keep `src/lib/env-adapter.ts` as the only boundary between Worker env and bot env.
- Use `setRequestEnv` before invoking the Elysia app.
- Use timing-safe comparison for `x-cron-secret` and `x-bot-token`.
- Route `/dashboard` to `/dashboard/` and fall back to `ASSETS`.

## Expected Outcome

Worker deploys to Cloudflare and serves API, webhooks, orchestration, and static assets from one entry.
