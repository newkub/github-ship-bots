---
name: orchestrator
description: Continuous ship loop for approved cards
related:
  - AGENTS.md
  - package.json
---

## Goal

Implement, test, gather evidence, deploy, and learn from approved cards.

## Scope

A headless package that implements the continuous ship loop. It is invoked by `packages/worker` on cron or HTTP triggers.

## Execute

### 1. Architecture

- Language: TypeScript / Bun
- GitHub SDK: Octokit
- Trigger: Cron or HTTP from `packages/worker`
- Integration: `packages/api`

### 2. Platform

- Runtime: Bun
- Serverless: Cloudflare Workers
- Trigger: `/orchestrate` and `/ship` endpoints
- Target: `packages/worker`

### 3. Target User

The ship-feed system; not directly by end users.

### 4. Skills

- bun: /follow-lang-bun
- cli: /follow-create-bun-cli

### 5. Workspaces

- uses: `packages/shared`
- used by: `packages/api`, `packages/worker`

## Rules

1. Run the loop only for cards that pass approval rules.
2. Collect evidence and update card status.
3. Record learning weights after each ship.

## Expected Outcome

An autonomous yet approval-gated ship loop.
