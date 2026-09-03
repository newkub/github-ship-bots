# @ship-feed/orchestrator

Continuous ship loop for approved cards.

Periodically fetches approved cards, checks mergeability, merges pull requests, and updates card status. Exposes a Worker `fetch` and `scheduled` entrypoint.

## Scripts

| Script | Description |
| --- | --- |
| `lint` | Run `tsc --noEmit` |
| `test` | Run orchestrator unit tests |

## Related

- [ship-feed root README](../../README.md)
