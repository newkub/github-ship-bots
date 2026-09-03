# @ship-feed/worker

Cloudflare Worker entry that mounts `packages/api`, `packages/bot`, and `packages/orchestrator`.

Handles GitHub webhooks, dashboard asset serving, API requests, cron triggers, and Stripe webhooks. Serves static assets from `../../docs/`.

## Develop

```bash
bun --filter @ship-feed/worker dev
```

## Deploy

```bash
bun run deploy
```

## Scripts

| Script | Description |
| --- | --- |
| `dev` | Start Wrangler dev server |
| `deploy` | Deploy to Cloudflare Workers |
| `lint` | Run `tsc --noEmit` |
| `test` | Run Worker entry tests |

## Related

- [ship-feed root README](../../README.md)
