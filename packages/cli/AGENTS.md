---
name: cli
description: Dependency update and conversion CLI for the ship-feed monorepo
related:
  - ../../AGENTS.md
---

## Goal

Provide a Bun CLI `updatedeps` for bumping dependencies, retesting, refactoring, committing, and converting git submodules.

## Scope

Internal tooling package. Not deployed to npm. Binary `updatedeps` exposed from `packages/cli`.

## Execute

### 1. Architecture

- bun: /follow-lang-bun
- typescript: /learn-from-web
- node:child_process: /learn-from-web

### 2. Platform

- Runs locally with Bun
- Binary: `updatedeps`
- Entry: `src/cli.ts`

### 3. Target User

Maintainers of the ship-feed monorepo.

### 4. Skills

- follow-create-bun-cli: /follow-create-bun-cli
- follow-tool-release-it: /follow-tool-release-it

### 5. Workspaces

- `packages/cli`: use —

## Rules

- Keep commands self-contained and safe.
- Use `spawnSync` with stdio inheritance.
- Prefer `bunx taze` for version bumps.
- Support `--dry-run`, `--write`, `--recursive`, and `--interactive`.

## Expected Outcome

`bun updatedeps` and `bun updatedeps retest|refactor|commit|convert-submodules` run reliably.
