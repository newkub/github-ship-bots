# @ship-feed/mobile

TikTok-style mobile PWA for swiping approve/reject decisions.

Built with **SolidJS**, **`@solidjs/router`**, **TanStack Solid Query**, and **Vite PWA**. Supports offline queueing and web push notifications.

## Develop

```bash
bun --filter @ship-feed/mobile dev
```

## Build

```bash
bun --filter @ship-feed/mobile build
```

The build output is written to `dist/` and is deployed separately as a PWA or embedded as needed.

## Scripts

| Script | Description |
| --- | --- |
| `dev` | Start Vite dev server on port `5173` |
| `build` | Typecheck and build for production |
| `preview` | Preview the production build |
| `lint` | Run `tsc --noEmit` |
| `test` | Run offline queue and other unit tests |

## Related

- [ship-feed root README](../../README.md)
