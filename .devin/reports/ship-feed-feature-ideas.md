# ship-feed — Feature Ideas Report

## Project Overview

ship-feed is a card-driven autonomous development system for GitHub projects. It turns issues and PRs into cards that humans approve/reject/ship; the system handles implementation, evidence, billing, and shipping through a Cloudflare Worker.

## Current Workspaces

| No. | Workspace | Role |
|-----|-----------|------|
| 1 | `apps/landing` | Marketing site (SolidJS + TanStack Router) |
| 2 | `apps/web` | Dashboard (SolidJS + `@solidjs/router`) |
| 3 | `apps/mobile` | TikTok-style swipe PWA |
| 4 | `packages/api` | Elysia + D1 + R2 + KV HTTP API |
| 5 | `packages/bot` | Probot GitHub App worker |
| 6 | `packages/cli` | `updatedeps` dependency CLI |
| 7 | `packages/orchestrator` | Continuous ship loop |
| 8 | `packages/shared` | Domain types and utilities |
| 9 | `packages/worker` | Cloudflare Worker entry |

## Existing Features (baseline)

- GitHub App: webhook reactions, issue/PR → cards, comment votes.
- Vote commands: `/approve`, `/reject`, `/ship`.
- Web dashboard: card queue, repo filters, billing, inspector.
- Mobile PWA: swipe, offline queue, push notifications.
- Evidence: image baselines, visual oracle, R2 storage.
- Stripe billing: checkout, subscriptions.
- WorkOS auth: GitHub OAuth, sessions.
- Learning: history-based card ordering.

---

## Feature Ideas

### Extended Features

| No. | Feature | Phase | Effort | MVP Score | Risk |
|-----|---------|-------|--------|-----------|------|
| 1 | GitHub App: multi-org + fine-grained repo permissions | MVP | L | 8 | กลาง |
| 2 | Dashboard: dark mode, drag-and-drop kanban, advanced filters | MVP | M | 9 | ต่ำ |
| 3 | Voting: weighted votes, roles, and quorum rules | MVP | M | 9 | กลาง |
| 4 | Mobile PWA: push notifications + offline deck | v2 | M | 8 | กลาง |
| 5 | Visual Oracle: video, DOM diff, AI baseline | v2 | L | 8 | สูง |
| 6 | Evidence: tags, folders, full-text search | v2 | S | 8 | ต่ำ |
| 7 | Billing: team seats, usage-based, trial | v2 | L | 7 | กลาง |
| 8 | Auth: SSO orgs, invites, audit log | v3 | L | 7 | กลาง |

### New Features

| No. | Feature | Phase | Effort | MVP Score | Risk |
|-----|---------|-------|--------|-----------|------|
| 9 | AI Code Review Agent | MVP | XL | 8 | สูง |
| 10 | Auto-rollback on post-ship regression | v2 | L | 8 | สูง |
| 11 | Release Notes Generator | MVP | S | 9 | ต่ำ |
| 12 | Public API + Webhooks | v2 | M | 8 | กลาง |
| 13 | Slack/Discord Bot | v2 | M | 7 | กลาง |
| 14 | Repository Health Score | v2 | M | 7 | กลาง |
| 15 | Contributor Leaderboard | v3 | S | 6 | ต่ำ |
| 16 | CLI for Card Management | v3 | M | 6 | ต่ำ |

---

## Detailed Feature Specs

### 1. Multi-org GitHub App (Extends)
- **Description**: Allow installing the GitHub App on multiple orgs and choosing which repos per org ship-feed watches.
- **Reason**: Current single-org flow blocks enterprise adoption and open-source maintainers with many orgs.
- **How**: Extend `repos.ts` with org scoping, add an org selector in dashboard, update webhook routing.
- **RiskDetail**: Handling GitHub App permissions across orgs; need OAuth scope checks.

### 2. Dashboard: Dark Mode + Kanban DnD + Filters (Extends)
- **Description**: Theme toggle, draggable kanban columns, and filter by status/repo/assignee/date.
- **Reason**: The current board is read-only; drag-to-status and dark mode are standard UX expectations.
- **How**: Add a `theme` signal, integrate `solid-dnd` for drag, extend `Cards` filters.
- **RiskDetail**: DnD accessibility; ensure mobile view still works.

### 3. Weighted Votes, Roles, Quorum (Extends)
- **Description**: Define repo-level rules: approver roles, min approvers, veto power, and vote weight.
- **Reason**: Teams have different approval cultures; simple majority is too rigid for regulated or large repos.
- **How**: Add `approval_rules` columns for `weight`, `role`, and `veto`; update `write.ts` vote logic.
- **RiskDetail**: Misconfiguration can block shipping; needs clear UI and validation.

### 4. Mobile PWA Push + Offline Deck (Extends)
- **Description**: Push notifs when a card changes status and an offline swipe deck that syncs later.
- **Reason**: Mobile is a swipe UI; without real-time push the queue is stale.
- **How**: Use `push.ts` VAPID + Service Worker, queue swipes in IndexedDB.
- **RiskDetail**: Push token management and delivery reliability.

### 5. Visual Oracle 2.0 (Extends)
- **Description**: Compare videos, DOM trees, and auto-generate baselines with LLM captioning.
- **Reason**: Image diffs are limited; video and DOM diffs catch more UI regressions.
- **How**: Extend `oracle.ts` with video frame extraction and DOM snapshots.
- **RiskDetail**: Cost and storage of video; accuracy of DOM diff.

### 6. Evidence Management (Extends)
- **Description**: Tag evidence, folder structure, and search across all records.
- **Reason**: As cards grow, evidence becomes hard to find and audit.
- **How**: Add `tags` and `folder` to evidence schema; index with D1 full-text search.
- **RiskDetail**: Index size; query performance on R2 metadata.

### 7. Team Billing & Seats (Extends)
- **Description**: Per-seat pricing, usage tiers, and a 14-day team trial.
- **Reason**: Current single-user pro plan does not match team buying behavior.
- **How**: Extend `stripe.ts` with metered seats; dashboard team management.
- **RiskDetail**: Billing edge cases; seat revocation.

### 8. SSO Orgs + Audit Log (Extends)
- **Description**: WorkOS SSO for orgs, member invites, and an admin audit log.
- **Reason**: Enterprises require SSO and an audit trail for compliance.
- **How**: Use WorkOS organization API, add `audit_logs` table.
- **RiskDetail**: Sensitive log retention; session lifecycle.

### 9. AI Code Review Agent (New)
- **Description**: Before human vote, an LLM reviews the diff, suggests changes, and scores quality.
- **Reason**: Reduces human review time and catches obvious issues before the card is approved.
- **How**: Add `api/routes/review.ts`, call LLM via env token, post review as a comment.
- **RiskDetail**: Hallucination; token cost; latency.

### 10. Auto-Rollback on Regression (New)
- **Description**: After a card is shipped, monitor health checks and automatically open a revert PR if it fails.
- **Reason**: Reduces blast radius of bad ships and closes the loop for the ship pipeline.
- **How**: Extend `orchestrator` with post-ship health polling; create a revert card.
- **RiskDetail**: False positives; needs rollback approval gate.

### 11. Release Notes Generator (New)
- **Description**: Auto-draft release notes from shipped cards with summaries, PRs, and contributors.
- **Reason**: Manual release notes are tedious and error-prone; this is high value for users.
- **How**: Aggregate shipped cards in a time window; use LLM or template.
- **RiskDetail**: Quality of generated summaries; needs human edit.

### 12. Public API + Webhooks (New)
- **Description**: Expose read endpoints and webhooks so users can integrate ship-feed into their own tools.
- **Reason**: Teams want to build internal dashboards, CI gates, and notifications.
- **How**: Add API key tokens, document endpoints, emit webhooks on card status change.
- **RiskDetail**: Auth model and rate limits; backward compatibility.

### 13. Slack/Discord Bot (New)
- **Description**: Send card summaries to channels and accept `/approve` or `/reject` slash commands.
- **Reason**: Many teams live in chat; reduces friction to vote.
- **How**: Add `packages/bot-slack` or extend worker with slash command handlers.
- **RiskDetail**: Token/security; maintaining two command interfaces.

### 14. Repository Health Score (New)
- **Description**: A score per repo based on activity, test coverage, open cards, dependency freshness, and evidence.
- **Reason**: Helps teams prioritize which repos need attention.
- **How**: Aggregate metrics in `packages/orchestrator`; show in dashboard.
- **RiskDetail**: Scoring formula can be gamed; needs transparency.

### 15. Contributor Leaderboard (New)
- **Description**: Gamified stats for top approvers, reviewers, and shippers per repo.
- **Reason**: Encourages review participation and recognition.
- **How**: Count votes and ships per user; add a leaderboard page.
- **RiskDetail**: May create perverse incentives; optional per repo.

### 16. CLI for Card Management (New)
- **Description**: `npx ship-feed list`, `approve`, `reject`, `ship` from the terminal.
- **Reason**: Power users prefer terminal; useful for CI/CD.
- **How**: Add CLI package using `@ship-feed/api` client.
- **RiskDetail**: Auth and token storage; not a high-priority need yet.

---

## What to do by phase

| Phase | No. | Feature |
|-------|-----|---------|
| **MVP** | 2 | Dashboard dark mode + kanban DnD |
| **MVP** | 3 | Weighted votes & quorum rules |
| **MVP** | 9 | AI code review agent |
| **MVP** | 11 | Release notes generator |
| **v2** | 1 | Multi-org GitHub App |
| **v2** | 4 | Mobile push + offline deck |
| **v2** | 5 | Visual oracle 2.0 |
| **v2** | 6 | Evidence tags & search |
| **v2** | 10 | Auto-rollback |
| **v2** | 12 | Public API + webhooks |
| **v2** | 13 | Slack/Discord bot |
| **v2** | 14 | Repository health score |
| **v3** | 7 | Team billing & seats |
| **v3** | 8 | SSO orgs & audit log |
| **v3** | 15 | Contributor leaderboard |
| **v3** | 16 | Card management CLI |

---

## Recommendation

Focus first on **MVP Score ≥ 8** and **Effort ≤ M**:

- `2` Dashboard dark mode + kanban DnD
- `3` Weighted votes & quorum
- `11` Release notes generator

These have high impact, manageable effort, and low-to-medium risk, and they directly improve the core shipping loop.
