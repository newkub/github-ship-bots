---
name: landing
description: Marketing landing site for ship-feed
related:
  - ../../AGENTS.md
---

## Goal

Provide a fast, responsive marketing site that explains ship-feed and drives users to install the GitHub app and open the dashboard.

## Scope

Static landing site with multiple routes and scroll-reveal animations. No live data or auth.

## Execute

### 1. Architecture

- solid-js: /follow-lib-solid
- @tanstack/solid-router: /follow-lib-tanstack-router
- unocss: /follow-lib-unocss
- animejs: /learn-from-web
- vite: /learn-from-web

### 2. Platform

- Client-side SPA built with Vite
- Deployed to Cloudflare Pages via `docs/` output
- Build output: `../../docs/`

### 3. Target User

First-time visitors and open-source maintainers evaluating ship-feed before installing the GitHub app.

### 4. Skills

- report-uxui: /report-uxui
- report-uxui-sketch: /report-uxui-sketch

### 5. Workspaces

- `apps/landing`: use —

## Rules

- Use UnoCSS for all styles.
- Use animejs only for scroll-reveal and micro-interactions.
- Keep landing routes under `src/pages/`.
- Link install CTAs to `/install` instead of new tabs.

## Expected Outcome

Landing site builds to `docs/` with clear product messaging and fast first paint.
