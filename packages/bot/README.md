# @ship-feed/bot

GitHub App worker for ship-feed.

Built with **Probot** and **Octokit**. Reacts to issue and pull request events, creates cards, and responds to `/approve`, `/reject`, and `/ship` comments.

## Develop

```bash
bun --filter @ship-feed/bot dev
```

## Deploy

```bash
bun --filter @ship-feed/bot deploy
```

## Scripts

| Script | Description |
| --- | --- |
| `dev` | Run the Probot dev server |
| `start` | Run the Probot server |
| `lint` | Run `tsc --noEmit` |
| `test` | Run issue and pull request handler tests |
| `deploy` | Deploy the Worker with Wrangler |

## Related

- [ship-feed root README](../../README.md)
