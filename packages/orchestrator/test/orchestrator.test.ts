import { describe, expect, test, beforeEach } from "bun:test";
import { createContext, fetchPendingCards, fetchApprovedCards, onApprove, onReject, runShipLoop } from "../src/index";
import type { Env, ShipCard } from "@ship-feed/shared";

function createMockDb(rows: Record<string, unknown>[] = []) {
  let calls: { sql: string; args: unknown[] }[] = [];

  function statement(sql: string) {
    return {
      bind: (...args: unknown[]) => ({
        all: async <T>() => ({ results: rows as T[], success: true, meta: {} as any }),
        run: async () => {
          calls.push({ sql, args });
          return { success: true, meta: {} as any };
        },
        first: async <T>() => (rows[0] as T) ?? undefined,
      }),
      all: async <T>() => ({ results: rows as T[], success: true, meta: {} as any }),
    };
  }

  return {
    db: {
      prepare: statement,
    } as unknown as Env["DB"],
    get calls() {
      return calls;
    },
  };
}

const baseCard: ShipCard = {
  id: "card-1",
  kind: "idea",
  title: "Test card",
  description: "A test card.",
  status: "approved",
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

function dbRow(card: ShipCard): Record<string, unknown> {
  return {
    id: card.id,
    kind: card.kind,
    title: card.title,
    description: card.description,
    status: card.status,
    repo_full_name: card.repoFullName,
    issue_number: card.issueNumber,
    pull_number: card.pullNumber,
    impact: card.impact,
    risk: card.risk,
    effect: card.effect,
    phase: card.phase,
    score: card.score,
    evidence_ids: JSON.stringify(card.evidenceIds),
    created_at: card.createdAt,
    updated_at: card.updatedAt,
  };
}

describe("orchestrator", () => {
  test("createContext builds context", () => {
    const ctx = createContext({ PUBLIC_APP_URL: "https://example.com" } as Env);
    expect(ctx.apiUrl).toBe("https://example.com");
  });

  test("fetchApprovedCards maps rows", async () => {
    const { db } = createMockDb([dbRow(baseCard)]);
    const ctx = createContext({ DB: db, PUBLIC_APP_URL: "https://example.com" } as Env);
    const cards = await fetchApprovedCards(ctx);
    expect(cards.length).toBe(1);
    expect(cards[0].id).toBe("card-1");
  });

  test("fetchPendingCards maps rows", async () => {
    const pending = { ...baseCard, status: "pending" as const };
    const { db } = createMockDb([dbRow(pending)]);
    const ctx = createContext({ DB: db, PUBLIC_APP_URL: "https://example.com" } as Env);
    const cards = await fetchPendingCards(ctx);
    expect(cards.length).toBe(1);
    expect(cards[0].status).toBe("pending");
  });

  test("onApprove fails when GitHub App is not configured", async () => {
    const { db, calls } = createMockDb();
    const ctx = createContext({ DB: db, PUBLIC_APP_URL: "https://example.com" } as Env);
    const res = await onApprove(ctx, baseCard);
    expect(res.ok).toBe(false);
    expect(res.github?.message).toBe("GitHub App credentials not configured");
    expect(calls).toHaveLength(0);
  });

  test("onReject fails when GitHub App is not configured", async () => {
    const { db, calls } = createMockDb();
    const ctx = createContext({ DB: db, PUBLIC_APP_URL: "https://example.com" } as Env);
    const res = await onReject(ctx, baseCard);
    expect(res.ok).toBe(false);
    expect(res.github?.message).toBe("GitHub App credentials not configured");
    expect(calls).toHaveLength(0);
  });

  test("runShipLoop does not ship without GitHub credentials", async () => {
    const { db } = createMockDb([dbRow(baseCard)]);
    const ctx = createContext({ DB: db, PUBLIC_APP_URL: "https://example.com" } as Env);
    const res = await runShipLoop(ctx);
    expect(res.shipped).toBe(0);
  });
});
