# ship-feed-bot

GitHub bot for the [ship-feed](https://github.com/newkub/devin-skills/issues/1) card-driven autonomous development workflow.

## Features

- Comments a voting card on every new issue
- Comments a voting card on every new pull request
- Responds to `/approve` and `/reject` commands in issue/PR comments
- Adds `approved` or `rejected` labels
- Auto-closes rejected issues
- Auto-merges approved pull requests

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

1. Register a GitHub App
2. Install the app on the target repository
3. Set environment variables from `.env.example`
4. Deploy to Cloudflare Workers, Vercel, Railway, or any Node/Bun host
