# GitHub App description

## Short description (use in GitHub App settings)

Card-driven approve/reject bot for GitHub issues and pull requests. Comment `/approve` to merge or `/reject` to close.

## Full description for app page

ship-feed-bot turns every new issue and pull request into a clear approve/reject voting card.

Maintainers and contributors can vote by simply replying with `/approve` or `/reject` in a comment.

### How to use

1. Install the app on repositories you want to manage.
2. Open a new issue or pull request.
3. The bot will post a card with the title, status, and voting instructions.
4. Comment `/approve` to approve or `/reject` to reject.
5. The bot will label the card and take action automatically.

### Commands

- `/approve` on an issue: adds the `approved` label.
- `/approve` on a pull request: adds the `approved` label and merges the PR.
- `/reject` on an issue: adds the `rejected` label and closes the issue.
- `/reject` on a pull request: adds the `rejected` label.

### Required secrets

The bot is deployed on Cloudflare Workers and needs these secrets:

- `APP_ID`: the numeric App ID from this GitHub App settings page.
- `PRIVATE_KEY`: generate a private key below, then convert it to PKCS#8 format with the included `scripts/convert-private-key.ts`.
- `WEBHOOK_SECRET`: any secure random string. Set the same value in GitHub App webhook settings and in Cloudflare Worker secrets.

### Permissions

- Issues: read & write
- Pull requests: read & write
- Contents: read & write

### Events

- Issues
- Issue comment
- Pull request
