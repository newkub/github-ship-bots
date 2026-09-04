import { Elysia } from "elysia";
import { z } from "zod";
import type { Env } from "@ship-feed/shared";
import { getSession } from "../lib/session";
import { generateId, now } from "../lib/db";
import { insertCard } from "../services/card-service";
import { withEnv } from "../lib/env";
import { inspectUrl } from "../lib/inspector-fetch";

const inspector = withEnv(new Elysia({ prefix: "/api/inspector" }));

const inspectorSchema = z.object({
  url: z.string().url(),
  selector: z.string(),
  prompt: z.string(),
  repoFullName: z.string(),
  impact: z.enum(["high", "medium", "low"]).default("medium"),
  risk: z.enum(["high", "medium", "low"]).default("medium"),
  effect: z.enum(["high", "medium", "low"]).default("medium"),
  phase: z.enum(["mvp", "v2", "done"]).default("mvp"),
});

async function canInspectRepo(db: Env["DB"], userId: string, repoFullName: string): Promise<boolean> {
  const row = await db
    .prepare("SELECT 1 FROM user_repos WHERE user_id = ? AND repo_full_name = ?")
    .bind(userId, repoFullName)
    .first();
  return Boolean(row);
}

inspector.post("/", async ({ request, set, env, body }) => {
  const session = await getSession({ request, set, env });
  if (!session) {
    set.status = 401;
    return { error: "unauthorized" };
  }

  if (!(await canInspectRepo(env.DB, session.id, body.repoFullName))) {
    set.status = 403;
    return { error: "forbidden", message: "You do not have access to this repository" };
  }

  const inspection = await inspectUrl(body.url, body.selector);
  if (!inspection.ok) {
    set.status = 422;
    return { error: "inspect failed", message: inspection.error ?? "Could not fetch the target URL" };
  }

  const id = generateId();
  const title = body.prompt || inspection.title || `Inspect ${body.url}`;
  const description = [
    `Inspector: ${body.url}`,
    `Selector: ${body.selector}`,
    `Page title: ${inspection.title ?? "N/A"}`,
    `Selector text: ${inspection.selectorText ?? "N/A"}`,
  ].join("\n");

  await env.DB.prepare(
    "INSERT INTO inspector_annotations (id, url, selector, prompt, created_at) VALUES (?, ?, ?, ?, ?)"
  )
    .bind(id, body.url, body.selector, body.prompt, now())
    .run();

  const card = await insertCard(
    env,
    {
      kind: "work",
      title,
      description,
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
    inspection,
    message: "Inspector fetched the page and created a ship-feed card.",
  };
}, { body: inspectorSchema });

export default inspector;
