---
name: shared
description: Shared domain types, crypto, and card mapping for ship-feed
related:
  - ../../AGENTS.md
---

## Goal

Provide domain types, utilities, and card mapping used by all other workspaces.

## Scope

Zero-dependency (or dev-only types) shared package. Imported by `apps/*` and `packages/*`.

## Execute

### 1. Architecture

- bun: /follow-lang-bun
- typescript: /learn-from-web
- cloudflare workers types: /learn-from-web

### 2. Platform

- Imported by apps and packages
- Not deployed independently
- Entry: `src/index.ts`

### 3. Target User

Other workspaces in the monorepo.

### 4. Skills

- report-what-you-do: /report-what-you-do

### 5. Workspaces

- `packages/shared`: use —

## Rules

- Keep the package free of runtime dependencies.
- Split types into focused files under `src/types/`.
- Centralize card mapping in `src/card-mapper.ts`.
- Keep crypto helpers in `src/crypto.ts`.

## Expected Outcome

All workspaces import types and utilities from `packages/shared` without circular dependencies.
