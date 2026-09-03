# ship-feed Product Implementation Plan

This plan maps the [ship-feed issue plan](https://github.com/newkub/devin-skills/issues/1) into a runnable product built on top of `github-ship-bots`.

## Architecture

```
                                    ┌─────────────────────┐
                                    │   GitHub wrikka-    │
                                    │    ship-bot App     │
                                    └──────────┬──────────┘
                                               │
                                               ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Mobile PWA  │     │  Web Dash    │     │  ship-feed   │
│  (swipe)     │     │  (config)    │     │  API Worker  │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       └────────────────────┴────────────────────┘
                              │
                              ▼
       ┌──────────────────────────────────────────┐
       │     ship-feed Orchestrator (D1/KV/R2)    │
       └──────────────────────────────────────────┘

Packages:
- apps/mobile          TikTok-like PWA for approve/reject/review cards
- apps/web             Dashboard for bot customization, billing, users, inspector
- apps/landing         Marketing landing page
- packages/bot         GitHub App bot logic (Probot/Octokit)
- packages/api         Hono API: auth (WorkOS), payments (Stripe),
                       evidence vault, test oracle, learning loop,
                       continuous ship loop, web inspector
- packages/shared      Types, schemas, utils
- packages/orchestrator Devin skill + .devin-plugin/plugin.json
```

## Issue Plan Mapping

| No. | Issue Task                         | Product Piece                                | Status |
|-----|------------------------------------|----------------------------------------------|--------|
| 1   | ship-feed plugin manifest          | `.devin-plugin/plugin.json` + orchestrator   | done   |
| 2   | Mobile PWA swipe cards             | `apps/mobile`                                | done   |
| 3   | Evidence vault                     | `packages/api` + R2                          | done   |
| 4   | Test oracle                        | `packages/api` image diff                    | done   |
| 5   | GitHub bot with approve/reject     | `packages/bot`                               | done   |
| 6   | ship-continuous loop               | `packages/api` orchestration                 | done   |
| 7   | Learning loop                      | `packages/api` D1 preferences                | done   |
| 8   | Web inspector                      | `apps/web` element picker + CI trigger       | done   |
| 9   | Documentation and publish          | README, plugin install, landing              | done   |

Single Cloudflare worker: `packages/worker` (name `github-ship-bots`) combines API, GitHub bot webhooks, orchestrator cron, and landing assets.

## Phase 1 — Foundation

| No. | Task | Status |
|-----|------|--------|
| 1 | Convert repo to Bun workspace root | done |
| 2 | Create `apps/mobile` SolidJS PWA skeleton with vertical swipe cards | done |
| 3 | Create `apps/web` dashboard skeleton with WorkOS sign-in link | done |
| 4 | Create `packages/api` Hono worker with `/auth/callback`, `/health`, `/stripe/checkout`, `/stripe/webhook` | done |
| 5 | Wire WorkOS client ID + GitHub OAuth | pending (needs user GitHub OAuth app in WorkOS) |
| 6 | Commit + push | done |

## Phase 2 — Productize

| No. | Task | Status |
|-----|------|--------|
| 1 | Stripe product/price + checkout (test keys → production keys) | pending (needs production Stripe keys/price) |
| 2 | Evidence vault: R2 upload + hash + CI link | done |
| 3 | Test oracle: image diff with baseline | done |
| 4 | Web inspector: click-to-prompt-to-CI | done |
| 5 | Learning loop: collect approve/reject, tune next card order | done |
| 6 | Continuous ship loop: trigger implementation, test, deploy | done (orchestrator cron + GitHub actions; implementation step is Devin-driven) |
| 7 | Plugin manifest + orchestrator skill | done |

## Phase 3 — Harden

| No. | Task | Status |
|-----|------|--------|
| 1 | Tests for API and mobile | done |
| 2 | CI/CD for apps/web, apps/mobile, packages/api | done (root CI runs `lint`, `test`, `build` across all workspaces) |
| 3 | GitHub App events configured + worker deployed as single `github-ship-bots` | pending (needs GitHub App UI + Cloudflare dashboard) |
| 4 | Real Stripe + WorkOS GitHub OAuth credentials swapped | pending (needs production secrets) |

## Credentials Needed

| No. | Credential | Where | Status |
|-----|------------|-------|--------|
| 1 | `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` | `packages/worker` | pending |
| 2 | GitHub OAuth App client ID/secret for WorkOS social login | `packages/worker` `/auth/callback` | pending |
| 3 | Cloudflare D1/R2/KV bindings for `packages/worker` | `packages/worker` `wrangler.toml` | pending |
| 4 | GitHub App `wrikka-ship-bot` events: Issues, Issue comment, Pull request | `packages/worker` /webhook | pending |

## WorkOS AuthKit (Staging)

- App ID: `${WORKOS_APP_ID}`
- Client ID: `${WORKOS_CLIENT_ID}`
- Environment: `${WORKOS_ENVIRONMENT_ID}`
- Redirect URIs: `${PUBLIC_APP_URL}/auth/callback`,
  `http://localhost:5173/auth/callback`, `http://localhost:5174/auth/callback`
