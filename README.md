> ![Status](https://img.shields.io/badge/status-in_development-red)

# ship-feed

Card-driven autonomous development for GitHub projects. Humans approve or reject cards; the system handles implementation, testing, evidence, shipping, and learning.

[![CI](https://github.com/newkub/github-ship-bots/actions/workflows/ci.yml/badge.svg)](https://github.com/newkub/github-ship-bots/actions/workflows/ci.yml)
[![GitHub App](https://img.shields.io/badge/GitHub%20App-wrikka--ship--bot-181717)](https://github.com/apps/wrikka-ship-bot)
[![Deploy](https://img.shields.io/badge/deploy-Cloudflare%20Workers-f48120)](https://workers.cloudflare.com)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE.md)

```text
┌──────────────────────────────────────────────────────────┐
│  ship-feed workspace overview                            │
│                                                          │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐            │
│   │  landing │   │   web    │   │  mobile  │            │
│   │  (Solid) │   │ dashboard│   │   PWA    │            │
│   └────┬─────┘   └────┬─────┘   └────┬─────┘            │
│        │              │              │                   │
│        └──────────────┼──────────────┘                   │
│                       ▼                                  │
│              ┌──────────────────┐                       │
│              │ packages/api     │                       │
│              │ Elysia + D1 + R2 │                       │
│              └────────┬─────────┘                       │
│                       ▼                                  │
│              ┌──────────────────┐                       │
│              │packages/worker   │                       │
│              │Cloudflare Workers│                       │
│              └──────────────────┘                       │
└──────────────────────────────────────────────────────────┘
```

## Get Started

1. Clone the monorepo and install dependencies.

```bash
git clone https://github.com/newkub/github-ship-bots.git
cd github-ship-bots
bun install
```

2. Configure Cloudflare bindings and secrets.

```bash
# required wrangler secrets for packages/worker
npx wrangler secret put WORKOS_CLIENT_ID
npx wrangler secret put WORKOS_API_KEY
npx wrangler secret put WORKOS_COOKIE_PASSWORD
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
npx wrangler secret put STRIPE_PRICE_PRO
npx wrangler secret put GITHUB_APP_ID
npx wrangler secret put GITHUB_APP_PRIVATE_KEY
npx wrangler secret put GITHUB_WEBHOOK_SECRET
```

3. Run local development servers.

```bash
bun run dev:worker
bun run dev:web
bun run dev:mobile
bun run dev:landing
```

4. Verify the workspace before committing.

```bash
bun run lint
bun run test
bun run build
```

5. Deploy the worker to Cloudflare.

```bash
bun run deploy
```

## Features

| Icon | Feature | Description |
| :---: | --- | --- |
| ![icon](https://api.iconify.design/mdi:github.svg?color=%231976d2&width=16) | GitHub App | Reacts to issues and pull requests, creates approval cards, posts votes as comments. |
| ![icon](https://api.iconify.design/mdi:vote.svg?color=%23388e3c&width=16) | Approve / Reject / Ship | Team members vote with `/approve`, `/reject`, or `/ship` comments on GitHub. |
| ![icon](https://api.iconify.design/mdi:monitor-dashboard.svg?color=%23c2185b&width=16) | Web Dashboard | SolidJS dashboard with card queue, repo filters, billing, and inspector. |
| ![icon](https://api.iconify.design/mdi:cellphone.svg?color=%237b1fa2&width=16) | Mobile PWA | TikTok-style swipe PWA with offline queue and push notifications. |
| ![icon](https://api.iconify.design/mdi:database.svg?color=%230097a7&width=16) | D1 + R2 + KV | Cloudflare-native data, evidence storage, and session state. |
| ![icon](https://api.iconify.design/mdi:credit-card.svg?color=%2300796b&width=16) | Stripe Billing | Checkout, subscriptions, and webhook handling for pro plans. |
| ![icon](https://api.iconify.design/mdi:shield-key.svg?color=%23d32f2f&width=16) | WorkOS Auth | GitHub OAuth login with session management and rate limiting. |
| ![icon](https://api.iconify.design/mdi:image-compare.svg?color=%23ffa000&width=16) | Visual Oracle | Image diff baselines for UI evidence and automated regression scoring. |

## Usage

### Usage via Web

Open the dashboard at `/dashboard` after logging in. Swipe or click to approve, reject, or ship cards. Filter by repository or status.

```text
┌──────────────────────────────────────────────────────────┐
│  Dashboard                                               │
│                                                          │
│  [Pending 3] [Approved 1] [Rejected 0] [Shipped 5]      │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Dark mode toggle          github-ship-bots      │   │
│  │  score 8.4  impact medium  risk low              │   │
│  │                                                   │   │
│  │  [Approve]  [Reject]  [Ship]  [Inspect]          │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Usage via GitHub Commands

Comment on an issue or pull request that has a card:

```bash
/approve   # approve the card
/reject   # reject the card
/ship     # queue the card for shipping
```

### Usage via API

```typescript
import type { ShipCard } from "@ship-feed/shared";

const res = await fetch("https://github-ship-bots.newkubise.workers.dev/api/cards", {
  credentials: "include",
});
const cards: ShipCard[] = await res.json();
```

| api | description | options | default |
| --- | --- | --- | --- |
| `GET /api/cards` | list cards visible to the session | `?status=` | — |
| `GET /api/cards/:id` | get a single card | — | — |
| `POST /api/cards/:id/status` | update card status | `{ status }` | — |
| `POST /api/cards/:id/ship` | trigger ship pipeline | — | — |
| `GET /api/cards/:id/evidence` | list evidence records | — | — |
| `POST /api/evidence` | upload evidence | `{ cardId?, kind, data, ciRunUrl? }` | — |
| `POST /api/inspector` | run visual oracle | `{ url, selector, prompt, repoFullName }` | — |

### Usage via CLI

The monorepo ships an internal `updatedeps` CLI for dependency maintenance.

```bash
npx updatedeps --help
bun --filter @ship-feed/cli test
```

```text
┌──────────────────────────────────────────────────────────┐
│  updatedeps — Dependency update helper                   │
│                                                          │
│  $ npx updatedeps packages/api/package.json             │
│  reading...                                              │
│  writing updated manifest                                │
│  done                                                    │
└──────────────────────────────────────────────────────────┘
```

### Usage via Mobile PWA

Install from the browser, then swipe right to approve, left to reject. Swipes are queued when offline and flushed when the connection returns.

```text
┌──────────────────────────────────────────────────────────┐
│  ship-feed mobile                                        │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Refactor auth flow   devin-skills               │   │
│  │                                                   │   │
│  │        [← swipe left]  [swipe right →]           │   │
│  │                                                   │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## License

[MIT](LICENSE.md)
