import { Hono } from "hono";
import { getSession } from "../lib/session";
import { generateId, now } from "../lib/db";
import { insertCard } from "./cards";
import type { Env } from "@ship-feed/shared";

const inspector = new Hono<{ Bindings: Env }>();

inspector.post("/", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const body = await c.req.json<{
    url: string;
    selector: string;
    prompt: string;
    repoFullName: string;
    impact?: "high" | "medium" | "low";
    risk?: "high" | "medium" | "low";
    effect?: "high" | "medium" | "low";
    phase?: "mvp" | "v2" | "done";
  }>();

  const id = generateId();
  await c.env.DB.prepare(
    "INSERT INTO inspector_annotations (id, url, selector, prompt, created_at) VALUES (?, ?, ?, ?, ?)"
  )
    .bind(id, body.url, body.selector, body.prompt, now())
    .run();

  const card = await insertCard(c.env, {
    kind: "work",
    title: body.prompt,
    description: `Inspector: ${body.url}\nSelector: ${body.selector}`,
    status: "pending",
    repoFullName: body.repoFullName,
    impact: body.impact ?? "medium",
    risk: body.risk ?? "medium",
    effect: body.effect ?? "medium",
    phase: body.phase ?? "mvp",
  });

  await c.env.DB.prepare("UPDATE inspector_annotations SET card_id = ? WHERE id = ?")
    .bind(card.id, id)
    .run();

  return c.json({
    ok: true,
    id,
    card,
    message: "Inspector annotation queued and ship-feed card created.",
  });
});

export default inspector;
