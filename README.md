# ship-feed-bot

GitHub bot for the [ship-feed](https://github.com/newkub/devin-skills/issues/1) card-driven autonomous development workflow.

## What it does

- Comments a voting card on every new issue and pull request
- Listens for `/approve` and `/reject` commands in comments
- Adds `approved` or `rejected` labels
- Closes rejected issues
- Merges approved pull requests

## Quick start

1. Install the GitHub App: https://github.com/apps/wrikka-ship-bot
2. Choose the repositories the bot can access
3. Open a new issue or pull request
4. The bot posts a card with voting instructions
5. Reply with `/approve` or `/reject`

## Commands

| Command | Effect |
|---------|--------|
| `/approve` | Marks approved. On a PR, the bot merges it. |
| `/reject` | Marks rejected. On an issue, the bot closes it. |

## Landing page

The landing page is built with Solid and TanStack Query.

```bash
cd landing
bun install
bun run dev
```

Build for production:

```bash
cd landing
bun run build
```

Static output is in `landing/dist/`. The `docs/` folder is the same build for GitHub Pages.

## Development

```bash
bun install
bun run dev
```

## Tests

```bash
bun test
```

## Configuration

Create a `.env` file from `.env.example` and fill the GitHub App credentials:

- `APP_ID` from the GitHub App settings
- `PRIVATE_KEY` from the GitHub App private key file
- `WEBHOOK_SECRET` from the GitHub App webhook settings

## Permissions

The app needs the following permissions:

- Issues: read & write
- Pull requests: read & write
- Contents: read & write

Events to subscribe:

- Issues
- Issue comment
- Pull request
