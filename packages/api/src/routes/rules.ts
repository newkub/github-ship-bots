import { Elysia, t } from "elysia";
import { getSession } from "../lib/session";
import { ensureAuth, unauthorized } from "../lib/card-auth";
import { getApprovalRule, setApprovalRule } from "../lib/approval";
import { now } from "../lib/db";
import { withEnv } from "../lib/env";

const bodySchema = t.Object({
  repoFullName: t.String(),
  minApprovers: t.Number({ minimum: 1 }),
  minRejectors: t.Number({ minimum: 1 }),
  voteWeight: t.Number({ minimum: 1 }),
  vetoEnabled: t.Boolean(),
});

const querySchema = t.Object({
  repo: t.String(),
});

const rules = withEnv(new Elysia({ prefix: "/api/rules" }))
  .get("/", async ({ request, set, env, query }) => {
    const session = await getSession({ request, set, env });
    if (!ensureAuth(set, session)) return unauthorized();
    const rule = await getApprovalRule(env.DB, query.repo);
    return rule;
  }, { query: querySchema })

  .post("/", async ({ request, set, env, body }) => {
    const session = await getSession({ request, set, env });
    if (!ensureAuth(set, session)) return unauthorized();
    await setApprovalRule(env.DB, { ...body, updatedAt: now() });
    return getApprovalRule(env.DB, body.repoFullName);
  }, { body: bodySchema });

export default rules;
