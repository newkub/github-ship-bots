---
name: mobile
description: Mobile PWA for ship-feed card review
related:
  - ../../AGENTS.md
---

## Goal

Provide a mobile-first, swipe-based PWA for quickly approving, rejecting, or prompting on ship cards.

## Scope

PWA with offline queue, push notifications, and a TikTok-like card stack. Talks to `packages/api` and uses `packages/shared` types.

## Execute

### 1. Architecture

- solid-js: /follow-lib-solid
- @solidjs/router: /follow-lib-solid-router
- @tanstack/solid-query: /follow-lib-tanstack-query
- unocss: /follow-lib-unocss
- vite: /learn-from-web
- vite-plugin-pwa: /learn-from-web
- @mmmike/web-push: /learn-from-web

### 2. Platform

- Mobile-first PWA built with Vite
- Works offline with service worker precache
- Push notification support via Web Push
- Build output: `dist/`

### 3. Target User

Maintainers on mobile devices who want to vote on cards and attach voice or sketch prompts on the go.

### 4. Skills

- report-uxui: /report-uxui
- report-uxui-sketch: /report-uxui-sketch

### 5. Workspaces

- `apps/mobile`: use `packages/shared`

## Rules

- Use `@solidjs/router` for navigation.
- Use TanStack Query for server state and offline queue for local state.
- Keep card swipe logic under `src/components/card/`.
- Register PWA service worker via `vite-plugin-pwa`.

## Expected Outcome

PWA installs to home screen and lets users swipe, prompt, and receive push updates.
