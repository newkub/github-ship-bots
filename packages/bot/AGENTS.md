---
name: bot
description: GitHub App worker for ship-feed
related:
  - AGENTS.md
  - package.json
---

## Goal

React to GitHub issues, pull requests, and comments by creating and updating cards.

## Scope

A Probot + Octokit-based GitHub App that runs on Cloudflare Workers via `packages/worker`.

## Execute

### 1. Architecture

- Framework: Probot
- GitHub SDK: Octokit (`@octokit/app`, `@octokit/rest`, `@octokit/webhooks`)
- Worker entry: `packages/worker`
- Deployment: Wrangler

### 2. Platform

- Runtime: Bun
- Serverless: Cloudflare Workers
- Trigger: GitHub webhooks
- Target: `packages/worker`

### 3. Target User

GitHub repositories that install the ship-feed GitHub App.

### 4. Skills

- bun: /follow-lang-bun
- probot: /follow-github-app
- wrangler: /follow-tool-wrangler

### 5. Workspaces

- uses: `packages/shared`
- used by: `packages/worker`

## Rules

1. Parse `/approve`, `/reject`, and `/ship` commands from comments.
2. Create cards in the database for new issues and pull requests.
3. Keep webhook handlers stateless.

## Expected Outcome

A responsive GitHub App that bridges GitHub and the ship-feed pipeline.
