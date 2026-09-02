---
name: shared
description: Domain types and utilities shared across ship-feed
related:
  - AGENTS.md
  - package.json
---

## Goal

Provide a single source of truth for types, constants, and utilities used by all workspaces.

## Scope

A dependency-free package with shared TypeScript types and helpers.

## Execute

### 1. Architecture

- Language: TypeScript
- Runtime: Bun
- Exports: `src/index.ts`

### 2. Platform

- Target: all other `@ship-feed/*` workspaces
- Deployment: imported at build/bundle time

### 3. Target User

Other ship-feed packages and apps.

### 4. Skills

- bun: /follow-lang-bun
- typescript: /follow-lang-typescript

### 5. Workspaces

- used by: `apps/landing`, `apps/web`, `apps/mobile`, `packages/api`, `packages/bot`, `packages/orchestrator`, `packages/worker`

## Rules

1. Keep this package dependency-free.
2. Only export domain types and pure utilities.
3. Do not import from other workspaces.

## Expected Outcome

Type-safe contracts across the entire monorepo.
