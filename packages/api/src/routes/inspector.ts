import { Elysia } from "elysia";
import { z } from "zod";
import { getSession } from "../lib/session";
import { generateId, now } from "../lib/db";
import { insertCard } from "../services/card-service";
import { withEnv } from "../lib/env";

const inspector = withEnv(new Elysia({ prefix: "/api/inspector" }));

const inspectorSchema = z.object({
  url: z.string(),
  selector: z.string(),
  prompt: z.string(),
  repoFullName: z.string(),
  impact: z.enum(["high", "medium", "low"]).default("medium"),
  risk: z.enum(["high", "medium", "low"]).default("medium"),
  effect: z.enum(["high", "medium", "low"]).default("medium"),
  phase: z.enum(["mvp", "v2", "done"]).default("mvp"),
});

inspector.post("/", async ({ request, set, env, body }) => {
  const session = await getSession({ request, set, env });
  if (!session) {
    set.status = 401;
    return { error: "unauthorized" };
  }

  const id = generateId();
  await env.DB.prepare(
    "INSERT INTO inspector_annotations (id, url, selector, prompt, created_at) VALUES (?, ?, ?, ?, ?)"
  )
    .bind(id, body.url, body.selector, body.prompt, now())
    .run();

  const card = await insertCard(
    env,
    {
      kind: "work",
      title: body.prompt,
      description: `Inspector: ${body.url}\nSelector: ${body.selector}`,
      status: "pending",
      repoFullName: body.repoFullName,
      impact: body.impact,
      risk: body.risk,
      effect: body.effect,
      phase: body.phase,
    },
    session.id
  );

  await env.DB.prepare("UPDATE inspector_annotations SET card_id = ? WHERE id = ?")
    .bind(card.id, id)
    .run();

  return {
    ok: true,
    id,
    card,
    message: "Inspector annotation queued and ship-feed card created.",
  };
}, { body: inspectorSchema });

export default inspector;
