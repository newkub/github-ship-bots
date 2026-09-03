# @ship-feed/api

HTTP API and authentication layer for ship-feed.

Built with **Elysia**, **Zod**, **Drizzle ORM**, and **Cloudflare D1/R2/KV**. Integrates with **WorkOS** for auth and **Stripe** for billing.

## Routes

| Route | Description |
| --- | --- |
| `GET /health` | Health check |
| `GET /auth/login` | Start WorkOS GitHub OAuth |
| `GET /auth/callback` | OAuth callback |
| `GET /auth/session` | Current session |
| `GET /api/cards` | List cards |
| `POST /api/cards/:id/ship` | Ship a card |
| `POST /api/evidence` | Store evidence |
| `POST /api/inspector` | Run visual oracle |
| `POST /api/stripe/*` | Stripe billing hooks |

## Scripts

| Script | Description |
| --- | --- |
| `lint` | Run `tsc --noEmit` |
| `test` | Run API unit tests |
| `db:migrate:local` | Apply D1 migrations locally |
| `db:migrate` | Apply D1 migrations |

## Related

- [ship-feed root README](../../README.md)
