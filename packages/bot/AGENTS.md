---
name: bot
description: GitHub App bot for ship-feed
related:
  - ../../AGENTS.md
---

## Goal

Receive GitHub webhooks and turn issues and pull requests into ship cards, then react to `/approve`, `/reject`, and `/ship` comments.

## Scope

Probot/Octokit GitHub App. Mounted by `packages/worker`. Uses `packages/shared` types and no direct database access.

## Execute

### 1. Architecture

- probot: /follow-github-app
- @octokit/rest: /learn-from-web
- @octokit/app: /learn-from-web
- cloudflare workers types: /learn-from-web

### 2. Platform

- Runs as part of `packages/worker` on Cloudflare Workers
- Local dev: `probot run ./src/index.ts`
- Exports: `./src/index.ts`, `./src/worker.ts`

### 3. Target User

GitHub repositories that have installed the ship-feed app.

### 4. Skills

- follow-github-app: /follow-github-app
- implement-github-issue: /implement-github-issue

### 5. Workspaces

- `packages/bot`: use `packages/shared`

## Rules

- Keep handlers under `src/handlers/`.
- Use `runWithBotEnv` for request-scoped bot environment.
- Avoid global mutable bot state.
- Use timing-safe comparison for secrets.

## Expected Outcome

Bot responds to issues and pull requests and routes commands back to the API and orchestrator.
