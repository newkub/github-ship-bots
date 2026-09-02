---
name: landing
description: Marketing landing site for ship-feed
related:
  - AGENTS.md
  - package.json
---

## Goal

Present ship-feed to visitors and guide them to install the GitHub App or open the dashboard.

## Scope

A single-page application split into routes: `/`, `/about`, `/features`, `/how-it-works`, `/commands`, `/install`. Built with SolidJS, TanStack Router, and UnoCSS.

## Execute

### 1. Architecture

- Framework: SolidJS
- Router: `@tanstack/solid-router`
- Styling: UnoCSS
- Animation: animejs
- Icons: lucide-solid
- Build output: `docs/`

### 2. Platform

- Runtime: Bun
- Build tool: Vite
- Deployment: Cloudflare Pages / Workers static assets
- Target: web browsers

### 3. Target User

Visitors and potential users evaluating ship-feed before installing the GitHub App.

### 4. Skills

- unocss: /follow-lib-unocss
- solid-js: /follow-lib-solid
- tanstack-solid-router: /follow-lib-tanstack-router

### 5. Workspaces

- uses: `packages/shared`

## Rules

1. Keep pages route-based, not hash-based.
2. Install buttons link to `/install` before sending users to GitHub.
3. Maintain dark, indigo/emerald/orange/purple visual language.

## Expected Outcome

A fast, responsive marketing site with clear navigation and consistent visuals.
