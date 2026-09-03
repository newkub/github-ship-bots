# @ship-feed/web

Web dashboard for managing ship-feed cards, repositories, billing, inspector, and settings.

Built with **SolidJS**, **`@solidjs/router`**, **TanStack Solid Query**, and **UnoCSS**.

## Develop

```bash
bun --filter @ship-feed/web dev
```

## Build

```bash
bun --filter @ship-feed/web build
```

The build output is written to `../../docs/dashboard/` and served at `/dashboard` by the Worker.

## Scripts

| Script | Description |
| --- | --- |
| `dev` | Start Vite dev server on port `5174` |
| `build` | Typecheck and build for production |
| `preview` | Preview the production build |
| `lint` | Run `tsc --noEmit` |

## Related

- [ship-feed root README](../../README.md)
