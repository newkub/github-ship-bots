import { describe, expect, test } from "bun:test";
import type { ShipCard } from "../src/index";

describe("shared types", () => {
  test("ShipCard shape is valid", () => {
    const card: ShipCard = {
      id: "card-1",
      kind: "idea",
      title: "Test card",
      description: "A test card for the ship-feed ecosystem.",
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

    expect(card.kind).toBe("idea");
    expect(card.status).toBe("pending");
    expect(card.score).toBe(7.5);
  });
});
