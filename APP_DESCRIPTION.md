# GitHub App description

## Short description (use in GitHub App settings)

Turns issues and PRs into approve/reject cards. Comment `/approve` to merge or `/reject` to close. Card-driven shipping for GitHub.

## Full description for app page

ship-feed-bot turns every new issue and pull request into a clear approve/reject card. Maintainers and contributors can vote by simply replying with `/approve` or `/reject` in a comment.

### How to use

1. Install the app on repositories you want to manage.
2. Open a new issue or pull request.
3. The bot will post a card with the title, status, and voting instructions.
4. Comment `/approve` to approve or `/reject` to reject.
5. The bot will label the card and take action automatically.

### Actions

- `/approve` on an issue: adds the `approved` label.
- `/approve` on a pull request: adds the `approved` label and merges the PR.
- `/reject` on an issue: adds the `rejected` label and closes the issue.
- `/reject` on a pull request: adds the `rejected` label.

### Permissions

The app requests the minimum permissions needed to comment, label, close, and merge:

- Issues: read & write
- Pull requests: read & write
- Contents: read & write

Events:

- Issues
- Issue comment
- Pull request
