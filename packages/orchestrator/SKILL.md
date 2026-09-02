---
name: ship-feed-orchestrator
description: Orchestrate the ship-feed continuous development loop — idea cards, human swipes, implementation, evidence, merge, and learning.
related:
  - use-github-ship-bots
  - follow-tool-vite
  - follow-test
  - run-deploy
  - watch-cicd-and-resolve
  - ship
---

# ship-feed orchestrator

Controls the full card-driven autonomous development loop.

## Workflow

1. Observe GitHub issues/PRs via the `github-ship-bots` worker webhook.
2. Generate `ShipCard` entries in the ship-feed API.
3. Surface cards on the mobile PWA and web dashboard.
4. Wait for human approve/reject swipe.
5. On approve:
   - Trigger implementation with Devin `continue`/`ship`.
   - Collect evidence (screenshots, videos, CI links) in the evidence vault.
   - Run tests and oracle diffs.
   - Open or update a pull request.
   - Request final merge approval.
6. On reject:
   - Close the related issue/PR.
   - Record the rejection in the learning loop.
7. Update `learning_weights` so future card ordering and suggestions improve.

## Commands

- `/ship-feed` — show current cards and status
- `/approve <card-id>` — approve a card
- `/reject <card-id>` — reject a card
- `/swipe <card-id> <approve|reject>` — record a swipe

## Environment

- `WORKOS_API_KEY`
- `WORKOS_CLIENT_ID`
- `STRIPE_SECRET_KEY`
- `GITHUB_APP_ID`
- `GITHUB_APP_PRIVATE_KEY`
- `PUBLIC_APP_URL`

