> ![Status](https://img.shields.io/badge/status-verified_on_worker-brightgreen)

# github-ship-bots

GitHub App for the ship-feed card-driven autonomous development workflow.

[![Deploy](https://img.shields.io/badge/deploy-Cloudflare%20Workers-f48120)](https://workers.cloudflare.com)
[![Install](https://img.shields.io/badge/install-GitHub%20Apps-181717)](https://github.com/apps/wrikka-ship-bot)

Turn issues and pull requests into approve/reject cards. Comment `/approve` or `/reject` to vote.

```text
+-------------------+
|   github-ship-bots   |
+--------+ +--------+
| Issue  | |   PR   |
|  card  | |  card  |
+---^----+ +---^----+
    |          |
  /approve     /approve
  /reject      /reject
```

## Get Started

1. Install the GitHub App at https://github.com/apps/wrikka-ship-bot and choose repositories.
2. Deploy the worker to Cloudflare Workers and set `APP_ID`, `PRIVATE_KEY`, `WEBHOOK_SECRET` secrets.
3. Open a new issue or pull request and the bot posts a voting card.

```bash
# local development
bun install
bun run dev
```

## Features

| Icon | Feature | Description |
|------|---------|-------------|
| <img src="https://api.iconify.design/lucide/message-square-text.svg?color=%236366f1" width="20" height="20" /> | Card comments | Posts a voting card on every new issue and PR |
| <img src="https://api.iconify.design/lucide/circle-check.svg?color=%236366f1" width="20" height="20" /> | Approve command | `/approve` labels and merges approved PRs |
| <img src="https://api.iconify.design/lucide/circle-x.svg?color=%236366f1" width="20" height="20" /> | Reject command | `/reject` labels and closes rejected issues |
| <img src="https://api.iconify.design/lucide/rocket.svg?color=%236366f1" width="20" height="20" /> | Cloudflare Workers | Runs as a serverless worker with static landing |
| <img src="https://api.iconify.design/lucide/settings.svg?color=%236366f1" width="20" height="20" /> | CI/CD | GitHub Actions run lint, tests, build, and deploy |

## Usage

### Web

Visit the landing page after deploy to see the install link and current app status.

### GitHub

1. Create or open an issue or pull request.
2. The bot comments a card.
3. Reply with `/approve` or `/reject`.

### Commands

| Command | On issue | On pull request |
|---------|----------|-----------------|
| `/approve` | Adds `approved` label | Adds `approved` label and merges |
| `/reject` | Adds `rejected` label and closes | Adds `rejected` label |

### Cloudflare Workers deploy

```bash
# install dependencies
bun install

# build landing static assets
cd landing
bun install
bun run build
cp -r dist ../docs

# set secrets
wrangler secret put APP_ID
wrangler secret put PRIVATE_KEY
wrangler secret put WEBHOOK_SECRET

# deploy
wrangler deploy
```

### Where the secrets come from

| Secret | Where to get it |
|--------|-----------------|
| `APP_ID` | GitHub App settings page. It is a numeric ID like `4769384`. |
| `PRIVATE_KEY` | GitHub App settings > **Private keys** > **Generate a private key**. Convert the downloaded `.pem` to PKCS#8 with `bun run scripts/convert-private-key.ts private-key.pem`. |
| `WEBHOOK_SECRET` | Any secure random string. Set the same value in GitHub App webhook settings and in Cloudflare Worker secrets. |

### GitHub App webhook configuration

- **Webhook URL:** `https://github-ship-bots.newkubise.workers.dev/webhook`
- **Content type:** `application/json`
- **Events:** `Issues`, `Issue comment`, `Pull request`


## Verification

The worker and bot logic were verified by sending test webhooks manually:

- `ping` event returned `200 {"ok":true}` — webhook signature and worker route work.
- `issues.opened` event on `newkub/devin-skills#2` caused the bot to post a ship-feed card.
- `issue_comment.created` event with `/approve` caused the bot to add `approved` and `ship-feed` labels and post a confirmation comment.

For GitHub to send these events automatically, the app must subscribe to:

- `Issues`
- `Issue comment`
- `Pull request`

## Development

```bash
bun install
bun run lint
bun test
```

## Tech Stack

| Layer | Technology | Version | Description |
|-------|------------|---------|-------------|
| Runtime | Bun | 1.4 | JavaScript runtime and package manager |
| Bot | Probot / Octokit | 14.x | GitHub App webhook framework |
| Worker | Cloudflare Workers | - | Serverless edge runtime |
| Landing | Solid + TanStack Query | 1.x / 5.x | Reactive UI with data fetching |
| Styling | UnoCSS | 66.x | Atomic CSS engine |
| CI/CD | GitHub Actions | - | Lint, test, build, deploy |

## Architecture

```text
github-ship-bots/
├── src/
│   ├── worker.ts         # Cloudflare Worker entry
│   ├── index.ts          # Probot server for local dev
│   ├── handlers/         # issues & pull request handlers
│   └── lib/verify.ts     # webhook signature verification
├── landing/              # Solid + UnoCSS landing page
├── docs/                 # built static assets
├── wrangler.toml         # Workers configuration
└── .github/workflows/    # CI/CD
```

## License

[MIT](LICENSE)
