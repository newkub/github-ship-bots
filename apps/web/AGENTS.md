---
name: web
description: Web dashboard for ship-feed
related:
  - ../../AGENTS.md
---

## Goal

Provide a desktop dashboard where maintainers can review cards, manage repositories, inspect evidence, and configure billing.

## Scope

Authenticated web dashboard. Talks to `packages/api` and uses `packages/shared` types.

## Execute

### 1. Architecture

- solid-js: /follow-framework-solidjs
- @solidjs/router: /learn-from-web
- @tanstack/solid-query: /follow-lib-tanstack-ecosystem
- unocss: /follow-lib-unocss
- vite: /follow-tool-vite
- zod: /follow-lib-zod

### 2. Platform

- Client-side SPA built with Vite
- Deployed to Cloudflare Pages via `docs/dashboard/` output
- Build output: `../../docs/dashboard/`

### 3. Target User

Maintainers and team leads who prefer a desktop browser for managing the ship pipeline.

### 4. Skills

- review-uxui: /review-uxui
- report-uxui-sketch: /report-uxui-sketch

### 5. Workspaces

- `apps/web`: use `packages/shared`

## Rules

- Use `@solidjs/router` for in-app navigation.
- Use TanStack Query for all server state.
- Reuse types from `packages/shared`.
- Keep page components under `src/pages/` and feature components under `src/components/`.

## Expected Outcome

Dashboard builds to `docs/dashboard/` with real-time card queues, repo settings, and billing views.
