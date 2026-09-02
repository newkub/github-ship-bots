---
name: mobile
description: Progressive web app for swiping ship-feed cards
related:
  - AGENTS.md
  - package.json
---

## Goal

Let users approve or reject cards quickly on mobile with a swipe-based interface.

## Scope

A SolidJS PWA with offline queue support, served from `dist/`.

## Execute

### 1. Architecture

- Framework: SolidJS
- Router: `@solidjs/router`
- State: `@tanstack/solid-query`
- Styling: UnoCSS
- PWA: vite-plugin-pwa
- Push: @mmmike/web-push
- Build output: `dist/`

### 2. Platform

- Runtime: Bun
- Build tool: Vite
- Deployment: Cloudflare Workers static assets or PWA install
- Target: iOS and Android browsers

### 3. Target User

Maintainers who want to vote on cards from their phone.

### 4. Skills

- solid-js: /follow-lib-solid
- tanstack-solid-query: /follow-lib-tanstack-query
- unocss: /follow-lib-unocss
- pwa: /follow-tool-vite-plugin-pwa

### 5. Workspaces

- uses: `packages/shared`

## Rules

1. Support offline swipe queue and replay.
2. Keep bundle small for mobile networks.
3. Follow the swipe UX from the design system.

## Expected Outcome

A smooth mobile PWA with offline-first voting.
