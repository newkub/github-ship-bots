---
name: web
description: Web dashboard for ship-feed cards, repos, billing, and settings
related:
  - AGENTS.md
  - package.json
---

## Goal

Provide a web dashboard where users view, manage, approve, and ship cards.

## Scope

A SolidJS SPA served at `/dashboard/`. Uses `@solidjs/router` for routing and TanStack Query for remote state.

## Execute

### 1. Architecture

- Framework: SolidJS
- Router: `@solidjs/router`
- State: `@tanstack/solid-query`
- Styling: UnoCSS
- Icons: lucide-solid
- Build output: `docs/dashboard/`

### 2. Platform

- Runtime: Bun
- Build tool: Vite
- Deployment: Cloudflare Workers static assets
- Target: desktop and tablet browsers

### 3. Target User

Team members and maintainers who manage cards from a browser.

### 4. Skills

- solid-js: /follow-lib-solid
- tanstack-solid-query: /follow-lib-tanstack-query
- unocss: /follow-lib-unocss

### 5. Workspaces

- uses: `packages/shared`

## Rules

1. Reuse the shared type definitions from `packages/shared`.
2. Prefer `createQuery` and `createMutation` over manual `fetch`.
3. Keep pages responsive and dark-themed.

## Expected Outcome

A reliable, fast dashboard for the full ship-feed workflow.
