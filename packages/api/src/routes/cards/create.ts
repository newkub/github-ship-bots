import { Elysia } from "elysia";
import type { z } from "zod";
import type { ShipCard } from "@ship-feed/shared";
import { timingSafeEquals } from "@ship-feed/shared";
import { getSession } from "../../lib/session";
import { unauthorized, notFound, ensureAuth } from "../../lib/card-auth";
import { insertCard } from "../../services/card-service";
import { withEnv } from "../../lib/env";
import { cardInputSchema } from "./schemas";

type CardInput = z.infer<typeof cardInputSchema>;

type NewCard = Omit<ShipCard, "id" | "score" | "createdAt" | "updatedAt" | "evidenceIds">;

function cardFromBody(body: CardInput): NewCard {
  return {
    kind: body.kind,
    title: body.title,
    description: body.description,
    status: "pending",
    repoFullName: body.repoFullName,
    issueNumber: body.issueNumber,
    pullNumber: body.pullNumber,
    impact: body.impact,
    risk: body.risk,
    effect: body.effect,
    phase: body.phase,
  };
}

const create = withEnv(new Elysia())
  .post("/webhook", async ({ request, set, env, body }) => {
    const token = request.headers.get("x-bot-token");
    if (!env.BOT_TOKEN || !token || !timingSafeEquals(token, env.BOT_TOKEN)) {
      set.status = 401;
      return { error: "unauthorized" };
    }
    const card = await insertCard(env, cardFromBody(body));
    return { ok: true, card };
  }, { body: cardInputSchema })

  .post("/", async ({ request, set, env, body }) => {
    const session = await getSession({ request, set, env });
    if (!ensureAuth(set, session)) return unauthorized();
    const card = await insertCard(env, cardFromBody(body));
    return { ok: true, card };
  }, { body: cardInputSchema });

export default create;
