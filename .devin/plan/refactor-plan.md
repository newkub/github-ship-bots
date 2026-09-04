# Refactor Plan — SRP, Boundaries, Consistency

## Baseline

- Monorepo: Bun workspace, TypeScript, SolidJS, Elysia, Drizzle, Wrangler
- Longest source file: `apps/web/src/api.ts` (195 lines)
- No files exceed 250 lines, but many are close and mix concerns
- SRP violations in `packages/api/src/index.ts` (env + rate limit + routes), `apps/web/src/api.ts` (clients + helpers + types)
- Relative `../` imports dominate; no workspace path aliases in apps
- Some duplicated utility patterns across packages

## Phases

### 1. Shared utilities and types
- Extract `now`, `generateId`, and small helpers from `packages/api/src/lib/db.ts` to `packages/shared/src/id.ts` and `packages/shared/src/time.ts`
- Keep `packages/shared/src/index.ts` as a clean barrel

### 2. API entrypoint
- Split `packages/api/src/index.ts` into:
  - `packages/api/src/app.ts` (Elysia app composition)
  - `packages/api/src/middleware/env.ts` (env/rate-limit/cors middleware)
  - `packages/api/src/bootstrap.ts` (worker export)
- Keep `packages/api/src/index.ts` as a barrel or remove if not needed

### 3. Mobile and web API clients
- Split `apps/web/src/api.ts` into `client.ts`, `cards.ts`, `auth.ts`, `stripe.ts`, `types.ts`
- Split `apps/mobile/src/api.ts` similarly
- Use shared API types from `@ship-feed/shared`

### 4. Consistency and naming
- Normalize handler/loader naming in routes to `*Handler` / `*Loader`
- Remove unused imports and dead code
- Ensure every file has one responsibility

### 5. Validation
- `bun --filter '*' lint`
- `bun --filter '*' test`
- `bun run build`
- `bun --filter @ship-feed/worker deploy`

## Acceptance

- All source files ≤250 lines
- `lint`, `test`, `build` pass
- Worker deploys
- No broken references
