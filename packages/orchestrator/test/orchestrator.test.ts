import { describe, expect, test } from "bun:test";
import { createContext, onApprove, onReject } from "../src/index";
import type { Env, ShipCard } from "@ship-feed/shared";

describe("orchestrator", () => {
  const ctx = createContext({ PUBLIC_APP_URL: "https://example.com" } as Env);

  const card: ShipCard = {
    id: "card-1",
    kind: "idea",
    title: "Test card",
    description: "A test card.",
    status: "pending",
    repoFullName: "newkub/github-ship-bots",
    impact: "medium",
    risk: "low",
    effect: "high",
    phase: "mvp",
    score: 7.5,
    evidenceIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  test("createContext builds context", () => {
    expect(ctx.apiUrl).toBe("https://example.com");
  });

  test("onApprove returns ok", async () => {
    const res = await onApprove(ctx, card);
    expect(res.ok).toBe(true);
    expect(res.card.id).toBe(card.id);
  });

  test("onReject returns ok", async () => {
    const res = await onReject(ctx, card);
    expect(res.ok).toBe(true);
    expect(res.card.id).toBe(card.id);
  });
});
