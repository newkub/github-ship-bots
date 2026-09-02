---
name: worker
description: Cloudflare Worker entry for ship-feed
related:
  - AGENTS.md
  - package.json
---

## Goal

Serve the landing, dashboard, and mobile static assets plus route GitHub webhooks, API calls, and cron triggers to the correct workers.

## Scope

The top-level Cloudflare Worker that mounts `packages/api`, `packages/bot`, and `packages/orchestrator` and serves static assets.

## Execute

### 1. Architecture

- Runtime: Cloudflare Workers
- Tooling: Wrangler
- Mounted workers:
  - `packages/api` for `/api/*`
  - `packages/bot` for `/webhook`
  - `packages/orchestrator` for `/orchestrate` and `/ship`
- Static assets: landing, dashboard, mobile

### 2. Platform

- Runtime: Bun (dev), Cloudflare Workers (deploy)
- Build: Wrangler
- Target: public internet

### 3. Target User

All end users and GitHub services reaching ship-feed.

### 4. Skills

- bun: /follow-lang-bun
- wrangler: /follow-tool-wrangler
- cloudflare: /follow-platform-cloudflare

### 5. Workspaces

- uses: `packages/api`, `packages/bot`, `packages/orchestrator`, `packages/shared`

## Rules

1. Return 401 for cron endpoints without `x-cron-secret`.
2. Redirect `/dashboard` to `/dashboard/`.
3. Serve `index.html` for landing SPA routes.
4. Serve `dashboard/index.html` for dashboard SPA routes.

## Expected Outcome

A single worker entry that routes all traffic correctly.
