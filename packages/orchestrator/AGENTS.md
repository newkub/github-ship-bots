---
name: orchestrator
description: Continuous ship loop for approved cards
related:
  - ../../AGENTS.md
---

## Goal

Poll approved cards and trigger the shipping pipeline (merge, release, evidence collection, rollback) for each one.

## Scope

Shared library used by `packages/api` and `packages/worker`. Contains the core ship loop, context builder, and GitHub interactions.

## Execute

### 1. Architecture

- bun: /follow-lang-bun
- typescript: /learn-from-web
- cloudflare workers types: /learn-from-web

### 2. Platform

- Runs as part of `packages/worker` on Cloudflare Workers
- Triggered by cron or HTTP `/orchestrate`
- Exports: `./src/index.ts`, `./src/worker.ts`

### 3. Target User

The ship-feed system itself. Not exposed directly to end users.

### 4. Skills

- ship: /ship
- realize-implementation: /realize-implementation
- report-what-you-do: /report-what-you-do

### 5. Workspaces

- `packages/orchestrator`: use `packages/shared`

## Rules

- Keep ship loop deterministic and idempotent.
- Use `createContext` to build runtime context.
- Return `{ ok, card, github }` results for every card.
- Handle missing GitHub credentials gracefully in tests.

## Expected Outcome

Orchestrator ships all approved cards and updates their status in D1.
