# @ship-feed/landing

Marketing landing site for ship-feed.

Built with **SolidJS**, **TanStack Solid Router**, and **UnoCSS**. Served as static assets through the Cloudflare Worker.

## Develop

```bash
bun --filter @ship-feed/landing dev
```

## Build

```bash
bun --filter @ship-feed/landing build
```

The build output is written to `../../docs/` so the Worker can serve it at the root path.

## Scripts

| Script | Description |
| --- | --- |
| `dev` | Start Vite dev server on port `5175` |
| `build` | Typecheck and build for production |
| `preview` | Preview the production build |
| `lint` | Run `tsc --noEmit` |

## Related

- [ship-feed root README](../../README.md)
