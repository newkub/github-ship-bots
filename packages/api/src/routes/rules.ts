import { Elysia, t } from "elysia";
import { getSession } from "../lib/session";
import { ensureAuth, unauthorized, forbidden } from "../lib/card-auth";
import { getApprovalRule, setApprovalRule } from "../lib/approval";
import { canAccessRepo } from "../services/card-service";
import { now } from "@ship-feed/shared";
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
    if (!(await canAccessRepo(env.DB, session.id, query.repo))) {
      set.status = 403;
      return forbidden();
    }
    const rule = await getApprovalRule(env.DB, query.repo);
    return rule;
  }, { query: querySchema })

  .post("/", async ({ request, set, env, body }) => {
    const session = await getSession({ request, set, env });
    if (!ensureAuth(set, session)) return unauthorized();
    if (!(await canAccessRepo(env.DB, session.id, body.repoFullName))) {
      set.status = 403;
      return forbidden();
    }
    await setApprovalRule(env.DB, { ...body, updatedAt: now() });
    return getApprovalRule(env.DB, body.repoFullName);
  }, { body: bodySchema });

export default rules;
