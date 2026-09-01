# ship-feed

Card-driven autonomous development ecosystem.

[![CI](https://github.com/newkub/github-ship-bots/actions/workflows/ci.yml/badge.svg)](https://github.com/newkub/github-ship-bots/actions/workflows/ci.yml)
[![GitHub App](https://img.shields.io/badge/GitHub%20App-wrikka--ship--bot-181717)](https://github.com/apps/wrikka-ship-bot)
[![Deploy](https://img.shields.io/badge/deploy-Cloudflare%20Workers-f48120)](https://workers.cloudflare.com)

> The human only selects ideas and approves or rejects cards. The system handles idea generation, implementation, testing, evidence collection, shipping, and continuous learning.

## Packages

| No. | Package | Description |
|-----|---------|-------------|
| 1 | `apps/landing` | Marketing landing page, built with SolidJS + UnoCSS |
| 2 | `apps/web` | Dashboard for cards, repos, billing, web inspector, and settings |
| 3 | `apps/mobile` | TikTok-like PWA for swiping approve/reject cards |
| 4 | `packages/bot` | GitHub App worker (Probot + Hono on Cloudflare Workers) |
| 5 | `packages/api` | Backend API: auth, cards, evidence, oracle, learning, inspector, Stripe |
| 6 | `packages/orchestrator` | Devin skill for the continuous ship loop |
| 7 | `packages/shared` | Domain types and utilities shared across the workspace |

## Get started

1. Install the [GitHub App](https://github.com/apps/wrikka-ship-bot) and choose repositories.
2. Deploy the `packages/api` and `packages/bot` workers to Cloudflare Workers.
3. Open a new issue or pull request and the bot posts a voting card.
4. Comment `/approve`, `/reject`, or `/ship` to vote.

```bash
# local development
bun install
bun run dev:api
bun run dev:web
bun run dev:mobile
```

## Verification

```bash
bun run lint
bun test
bun run build
```

## Architecture

```text
                    ┌─────────────┐
                    │  ship-feed  │
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌────────────┐  ┌────────────┐  ┌────────────┐
    │  mobile    │  │    web     │  │  GitHub    │
    │  (PWA)     │  │  dashboard │  │    bot     │
    └─────┬──────┘  └──────┬──────┘  └─────┬──────┘
          └────────────────┼───────────────┘
                           ▼
                  ┌──────────────────┐
                  │ packages/api     │
                  │ (Hono + D1 + R2) │
                  └────────┬─────────┘
                           ▼
                  ┌──────────────────┐
                  │ packages/orch.   │
                  │ continuous loop  │
                  └──────────────────┘
```

## Tech stack

| No. | Layer | Technology |
|-----|-------|------------|
| 1 | Runtime | Bun 1.4 |
| 2 | Bot | Probot / Octokit |
| 3 | Worker | Cloudflare Workers (Hono) |
| 4 | Frontend | SolidJS + TanStack Query |
| 5 | Styling | UnoCSS |
| 6 | CI/CD | GitHub Actions |

## License

[MIT](LICENSE)
