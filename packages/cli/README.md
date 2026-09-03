# @ship-feed/cli

Internal CLI helpers for the ship-feed monorepo.

The `updatedeps` command reads a `package.json`, detects dependency upgrades, and rewrites the manifest.

## Usage

```bash
npx updatedeps packages/api/package.json
bun src/cli.ts packages/api/package.json
```

## Scripts

| Script | Description |
| --- | --- |
| `lint` | Run `tsc --noEmit` |
| `test` | Run CLI unit tests |

## Related

- [ship-feed root README](../../README.md)
