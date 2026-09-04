import { Elysia } from "elysia";
import { z } from "zod";
import { getSession } from "../../lib/session";
import { now, generateId } from "@ship-feed/shared";
import { updateLearningWeights } from "../../lib/learning";
import { resolveApprovalStatus } from "../../lib/approval";
import { notifyCardStatus } from "../../lib/notify";
import { createContext, onApprove, onReject } from "@ship-feed/orchestrator";
import { unauthorized, notFound, ensureAuth } from "../../lib/card-auth";
import { requireCard } from "../../services/card-service";
import { withEnv } from "../../lib/env";
import { paramsSchema, swipeSchema, statusSchema } from "./schemas";

const write = withEnv(new Elysia())
  .post("/:id/swipe", async ({ request, set, env, params, body }) => {
    const session = await getSession({ request, set, env });
    if (!ensureAuth(set, session)) return unauthorized();
    const id = params.id;
    const card = await requireCard(env.DB, id, session.id);
    if (!card) {
      set.status = 404;
      return notFound();
    }
    await updateLearningWeights(env.DB, card, body.direction);
    const swipeId = generateId();
    await env.DB.prepare("INSERT INTO swipes (id, card_id, user_id, direction, created_at) VALUES (?, ?, ?, ?, ?)")
      .bind(swipeId, id, session.id, body.direction, now())
      .run();
    if (body.comment && body.comment.trim().length > 0) {
      const commentId = generateId();
      await env.DB
        .prepare("INSERT INTO card_comments (id, card_id, user_id, body, posted_to_github, created_at) VALUES (?, ?, ?, ?, 0, ?)")
        .bind(commentId, id, session.id, body.comment.trim(), now())
        .run();
    }
    const status = await resolveApprovalStatus(env.DB, card);
    if (status !== card.status) {
      await env.DB.prepare("UPDATE cards SET status = ?, updated_at = ? WHERE id = ?")
        .bind(status, now(), id)
        .run();
    }
    await notifyCardStatus(env, { ...card, status }, body.direction === "approve" ? "approved" : "rejected");
    return { ok: true, status };
  }, { params: paramsSchema, body: swipeSchema })

  .post("/:id/ship", async ({ request, set, env, params }) => {
    const session = await getSession({ request, set, env });
    if (!ensureAuth(set, session)) return unauthorized();
    const id = params.id;
    const card = await requireCard(env.DB, id, session.id);
    if (!card) {
      set.status = 404;
      return notFound();
    }
    if (!env.GITHUB_APP_ID || !env.GITHUB_APP_PRIVATE_KEY) {
      set.status = 503;
      return { error: "service unavailable", missing: ["GITHUB_APP_ID", "GITHUB_APP_PRIVATE_KEY"] };
    }
    const ctx = createContext(env);
    const result = await onApprove(ctx, card);
    if (!result.ok) {
      set.status = 502;
      return { ok: false, error: result.github?.message ?? "github ship failed" };
    }
    await updateLearningWeights(env.DB, result.card, "approve");
    await notifyCardStatus(env, result.card, "shipped");
    return result;
  }, { params: paramsSchema })

  .post("/:id/reject", async ({ request, set, env, params }) => {
    const session = await getSession({ request, set, env });
    if (!ensureAuth(set, session)) return unauthorized();
    const id = params.id;
    const card = await requireCard(env.DB, id, session.id);
    if (!card) {
      set.status = 404;
      return notFound();
    }
    if (!env.GITHUB_APP_ID || !env.GITHUB_APP_PRIVATE_KEY) {
      set.status = 503;
      return { error: "service unavailable", missing: ["GITHUB_APP_ID", "GITHUB_APP_PRIVATE_KEY"] };
    }
    const ctx = createContext(env);
    const result = await onReject(ctx, card);
    if (!result.ok) {
      set.status = 502;
      return { ok: false, error: result.github?.message ?? "github reject failed" };
    }
    await updateLearningWeights(env.DB, result.card, "reject");
    await notifyCardStatus(env, result.card, "rejected");
    return result;
  }, { params: paramsSchema })

  .post("/:id/status", async ({ request, set, env, params, body }) => {
    const session = await getSession({ request, set, env });
    if (!ensureAuth(set, session)) return unauthorized();
    const id = params.id;
    const existing = await requireCard(env.DB, id, session.id);
    if (!existing) {
      set.status = 404;
      return notFound();
    }
    if (body.status === "approved" || body.status === "rejected") {
      const direction = body.status === "approved" ? "approve" : "reject";
      await updateLearningWeights(env.DB, existing, direction);
    }
    await env.DB.prepare("UPDATE cards SET status = ?, updated_at = ? WHERE id = ?")
      .bind(body.status, now(), id)
      .run();
    const updated = await requireCard(env.DB, id, session.id);
    if (updated) {
      await notifyCardStatus(env, updated, body.status as "created" | "approved" | "rejected" | "shipped");
    }
    return { ok: true };
  }, { params: paramsSchema, body: z.object({ status: statusSchema }) });

export default write;
