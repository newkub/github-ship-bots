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
- apps/web             Dashboard for bot customization, billing, users
- apps/landing         Existing landing page
- packages/bot         Existing GitHub bot worker (Probot/Octokit)
- packages/api         Hono API: auth (WorkOS), payments (Stripe),
                       evidence vault, test oracle, learning loop,
                       continuous ship loop, web inspector
- packages/shared      Types, schemas, utils
- packages/orchestrator Devin skill + .devin-plugin/plugin.json
```

## Issue Plan Mapping

| No. | Issue Task                         | Product Piece                                |
|-----|------------------------------------|----------------------------------------------|
| 1   | ship-feed plugin manifest          | `.devin-plugin/plugin.json` + orchestrator   |
| 2   | Mobile PWA swipe cards             | `apps/mobile`                                |
| 3   | Evidence vault                     | `packages/api` + R2                          |
| 4   | Test oracle                        | `packages/api` image diff                    |
| 5   | GitHub bot with approve/reject     | `packages/bot` (done, needs dashboard hook)  |
| 6   | ship-continuous loop               | `packages/api` orchestration                 |
| 7   | Learning loop                      | `packages/api` D1 preferences                |
| 8   | Web inspector                      | `apps/web` element picker + CI trigger       |
| 9   | Documentation and publish          | README, plugin install, landing              |

## Phase 1 — Foundation

1. Convert repo to Bun workspace root
2. Create `apps/mobile` SolidJS PWA skeleton with vertical swipe cards
3. Create `apps/web` dashboard skeleton with WorkOS sign-in link
4. Create `packages/api` Hono worker with `/auth/callback`, `/health`, `/stripe/checkout`, `/stripe/webhook`
5. Wire WorkOS client ID + GitHub OAuth (pending user GitHub OAuth app)
6. Commit + push

## Phase 2 — Productize

1. Stripe product/price + checkout (test keys → production keys)
2. Evidence vault: R2 upload + hash + CI link
3. Test oracle: image diff with baseline
4. Web inspector: click-to-prompt-to-CI
5. Learning loop: collect approve/reject, tune next card order
6. Continuous ship loop: trigger implementation, test, deploy
7. Plugin manifest + orchestrator skill

## Phase 3 — Harden

1. Tests for API and mobile
2. CI/CD for apps/web, apps/mobile, packages/api
3. GitHub App events configured + old worker deleted
4. Real Stripe + WorkOS GitHub OAuth credentials swapped

## Credentials Needed

- `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`
- GitHub OAuth App client ID/secret for WorkOS social login
- Cloudflare D1/R2/KV bindings for `packages/api`
- GitHub App `wrikka-ship-bot` events: Issues, Issue comment, Pull request

## WorkOS AuthKit (Staging)

- App ID: `app_01M19F99TR4QZ2XVW36W39R7N8`
- Client ID: `client_01M19F99TQW7CRED4Q65YAE0DH`
- Environment: `environment_01JNEQB3JNQKNK97BB3WD7W638`
- Redirect URIs: `https://github-ship-bots.newkubise.workers.dev/auth/callback`,
  `http://localhost:5173/auth/callback`, `http://localhost:5174/auth/callback`
