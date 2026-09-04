# Ship-Feed Monorepo — Production Readiness Deep Review

## Summary
The core card queue, auth, billing webhooks, evidence storage, and GitHub bot plumbing are implemented, but several flows are incomplete or misconfigured for production. The most serious issue is that the ship/reject orchestrator can mark cards as completed even when GitHub credentials are missing. Several major feature tables are unused, and required environment validation is too coarse.

---

## Critical

1. **Orchestrator marks cards shipped/rejected even when GitHub is not configured**
   - `packages/orchestrator/src/lib/github.ts:112-114` — `shipToGitHub` returns `{ ok: true, skipped: true }` when `appId` or `privateKey` is missing.
   - `packages/orchestrator/src/index.ts:67-78` — `onApprove` treats `ok: true` as success and updates the card to `shipped`.
   - `packages/orchestrator/src/index.ts:96-107` — `onReject` does the same for `rejected`.
   - **Impact**: missing GitHub App creds does not fail the ship; cards are silently advanced.

2. **Worker orchestrate endpoints run the ship loop without env validation**
   - `packages/worker/src/index.ts:23-32` — `/orchestrate` and `/ship` only check `CRON_SECRET`, then call `orchestratorWorker.fetch`.
   - `packages/orchestrator/src/worker.ts:5-16` — creates context and runs `runShipLoop` without validating `DB`, `GITHUB_APP_*`, or `PUBLIC_APP_URL`.
   - **Impact**: a cron call with missing env will throw or silently skip GitHub actions.

3. **API requires all 14 environment variables before serving any protected route**
   - `packages/api/src/lib/validate-env.ts:3-18` — lists `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `GITHUB_APP_PRIVATE_KEY`, etc. as required for **every** `onBeforeHandle` call.
   - `packages/api/src/index.ts:29-32` — returns `503 service unavailable` with `missing` list if any are absent.
   - **Impact**: a single missing optional integration (e.g. Stripe or GitHub) brings down the entire dashboard/cards API.

4. **Auth derives GitHub login from WorkOS email local-part or first name**
   - `packages/api/src/routes/auth.ts:13-20` — `githubLoginFromProfile` uses `email.split("@")[0]` or `firstName`.
   - **Impact**: creates `github_login` values that are not actual GitHub usernames, breaking the bot’s repo/permission mapping.

---

## High

5. **Push notification flow is only half-wired**
   - `packages/api/src/routes/push.ts:20-96` — has `subscribe`/`unsubscribe`/manual `notify`, but no server-side trigger.
   - `packages/api/src/lib/notify.ts:11-27` — only sends Slack/Telegram; never pushes to stored subscriptions.
   - **Impact**: the PWA can subscribe, but users will never receive a push.

6. **Web Inspector is a placeholder**
   - `packages/api/src/routes/inspector.ts:21-61` — inserts a row and creates a card, but does not capture a screenshot, run CI, or call the target URL.
   - `apps/web/src/pages/Inspector.tsx:111-112` — preview hardcodes `https://example.com` and static selectors.
   - **Impact**: the inspector does not actually inspect anything.

7. **Marketplace plugins are hardcoded and non-functional**
   - `packages/api/migrations/0004_plugins.sql:16-21` — seeds five fake plugins with fake install counts.
   - `packages/api/src/routes/plugins.ts:15-34` — install/uninstall only toggles `user_plugins`; no plugin code is ever executed.
   - **Impact**: marketplace is a catalog UI, not real integrations.

8. **Billing only supports the `pro` plan**
   - `packages/api/src/routes/stripe.ts:7-26` — plans are hardcoded; `team` has no price ID.
   - `packages/api/src/routes/stripe.ts:49` — checkout always uses `STRIPE_PRICE_PRO`.
   - `packages/api/src/routes/stripe.ts:48` — `customer_email: session.email` may be `undefined`.
   - **Impact**: `team` plan is advertised but cannot be purchased.

9. **`/api/repos` only shows repos that already have cards**
   - `packages/api/src/routes/repos.ts:13-21` — query is `SELECT DISTINCT repo_full_name FROM cards ...`.
   - **Impact**: users cannot see newly installed/authorized repos until the bot creates a card.

10. **Bot `toBotEnv` can throw on missing env without a graceful 5xx response**
    - `packages/worker/src/lib/env-adapter.ts:12-18` — `requireString` throws `Error`.
    - `packages/worker/src/lib/env-adapter.ts:20-41` — `toBotEnv` calls `requireString` for `GITHUB_APP_ID`, `GITHUB_APP_PRIVATE_KEY`, `WEBHOOK_SECRET`, `BOT_TOKEN`, `PUBLIC_APP_URL`.
    - **Impact**: a misconfigured bot worker returns 500 on webhook instead of a clean 503.

---

## Medium

11. **Feature tables are defined but never used**
    - `packages/api/src/db/schema.ts:158-253` and `packages/api/migrations/0005_features.sql:27-114` define:
      - `security_findings`
      - `rollback_events`
      - `refactor_artifacts`
      - `issue_traces`
      - `ci_diagnostics`
      - `agent_sdks`
      - `notification_channels`
      - `health_checks`
      - `voice_commands`
    - Grep confirms zero non-schema references.
    - **Impact**: schema bloat; these features are not wired.

12. **API bypasses validation when `DB` is missing**
    - `packages/api/src/index.ts:27` — `if (!env?.DB) return;` in `onBeforeHandle`.
    - **Impact**: missing DB skips env validation and rate-limiting, then later handlers fail with raw DB errors.

13. **Landing pages use hardcoded marketing data**
    - `apps/landing/src/components/dashboard/data.ts:14-60` — hardcoded `previewCards`, `stats`, etc.
    - `apps/landing/src/data.ts:51-142` — hardcoded features, steps, commands, default install URL.

14. **Mobile Account page hardcodes billing and push CTAs**
    - `apps/mobile/src/pages/Account.tsx:84-89` — “Upgrade to Pro” button always links to the pro checkout.
    - `apps/mobile/src/pages/Account.tsx:65-70` — plan badge falls back to “free plan”.

15. **Mobile Feed hardcodes nudge count**
    - `apps/mobile/src/pages/Feed.tsx:18` — `const [nudgeCount, setNudgeCount] = createSignal(2);`.
    - `apps/mobile/src/pages/Alerts.tsx:23` — nudge suggestion threshold is hardcoded `score >= 8.5 && risk === "low"`.

16. **Web Repos page has a hardcoded fallback install URL**
    - `apps/web/src/pages/Repos.tsx:6` — default `https://github.com/apps/wrikka-ship-bots/installations/new`.

17. **OpenAI review falls back to heuristics silently**
    - `packages/bot/src/lib/review.ts:74-87` — if `OPENAI_API_KEY` is absent, it uses `heuristicReview` with no indication to the user that the AI review did not run.

18. **Evidence webhook auth requires `BOT_TOKEN` length check but no rate limit**
    - `packages/api/src/routes/evidence.ts:79` — `env.BOT_TOKEN.length < 32` check. No rate limiting or retry logic.

---

## Low

19. **Dead helper `first` in `db.ts`**
    - `packages/api/src/lib/db.ts:3-5` — exported `first<T>` is never used.

20. **Console logging in workers**
    - `packages/orchestrator/src/index.ts:68,76-77` and `packages/orchestrator/src/worker.ts:20-22` — `console.log`/`console.error` instead of structured logging.

21. **Landing fetches app info with a hardcoded default**
    - `apps/landing/src/data.ts:151-152` — `VITE_GITHUB_APP_NAME` defaults to `wrikka-ship-bot`.

22. **No `WORKOS_REDIRECT_URI` in `.env.example` but it is used**
    - `packages/api/src/routes/auth.ts:22-24` — uses `WORKOS_REDIRECT_URI`.
    - `packages/api/src/.env.example` — does not list `WORKOS_REDIRECT_URI` (only in wrangler comment).

---

## Recommended Next Implementations (priority order)

1. **Fix orchestrator "ship" correctness** — `shipToGitHub` must return `ok: false` when GitHub is not configured, and `onApprove`/`onReject` must not advance card status on failure.
2. **Make env validation route-aware** — do not require Stripe/GitHub/WorkOS for every endpoint; validate only the keys needed by the route being called.
3. **Complete push notifications** — trigger `sendPushBatch` from `notifyCardStatus` when card events occur, and surface VAPID missing errors clearly.
4. **Fix WorkOS → GitHub login mapping** — store the real GitHub `login` from the WorkOS profile or add a `github_username` field and onboarding step.
5. **Finish the inspector** — implement screenshot/headless DOM extraction or remove the page; the current API just creates a card.
6. **Make marketplace real or remove it** — either execute plugin logic on install/apply or drop the catalog until plugins are implemented.
7. **Add team billing** — make plans configurable and support a `STRIPE_PRICE_TEAM` checkout flow.
8. **Add `/api/repos` from GitHub App installations** — query `user_repos` and sync on `installation.*` events instead of only repos with cards.
9. **Remove or wire unused feature tables** — delete `security_findings`, `rollback_events`, `refactor_artifacts`, `issue_traces`, `ci_diagnostics`, `agent_sdks`, `notification_channels`, `health_checks`, `voice_commands`, `usage_events` or implement their routes.
10. **Add structured logging and error telemetry** — replace `console.*` with a correlating logger and centralize error handling in the worker.
