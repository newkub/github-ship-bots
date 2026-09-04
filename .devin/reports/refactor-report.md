# Refactor Report — SRP, Boundaries, Consistency

## Before

- `packages/api/src/index.ts` mixed middleware, health, route wiring, and Worker fetch handling
- `packages/api/src/lib/db.ts` contained `generateId` and `now` used only as helpers, not database logic
- `apps/web/src/api.ts` was 200 lines with 28 mixed API clients (cards, auth, billing, plugins, etc.)
- `apps/mobile/src/api.ts` mixed offline queue logic, auth, billing, and config clients
- Longest file: `apps/web/src/api.ts` at 200 lines
- Naming inconsistencies: some clients used inline `fetch`, some used helper patterns

## After

- `packages/api/src/index.ts` reduced to bootstrap export; `app.ts` composes routes; `middleware.ts` holds `onBeforeHandle` and CORS
- `packages/shared/src/id.ts` and `packages/shared/src/time.ts` own `generateId` and `now`; `packages/api/src/lib/db.ts` removed
- `apps/web/src/api.ts` is a barrel; domain clients live in `apps/web/src/api/{client,cards,auth,billing,plugins,inspector,templates,rules,evidence,repos,releases}.ts`
- `apps/mobile/src/api.ts` is a barrel; clients live in `apps/mobile/src/api/{client,cards,auth,billing,config}.ts`
- Longest file now: `packages/orchestrator/src/lib/github.ts` at 174 lines (<250)
- Consistent `fetchJson` / `postJson` helper pattern in both web and mobile clients

## Verification

- `bun --filter '*' lint`: pass
- `bun --filter '*' test`: pass
- `bun run build`: pass
- `bun --filter @ship-feed/worker deploy`: pass
- No file exceeds 250 lines
- No broken references

## Remaining TODO

- `packages/orchestrator/src/lib/github.ts` can be split into `auth.ts` and `shipper.ts` if it grows
- `packages/api/src/routes/auth.ts` can be split into `login.ts` and `callback.ts`
- Landing `data.ts` is marketing copy by design; keep static
