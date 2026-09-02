import { describe, expect, test } from "bun:test";
import type { Env } from "@ship-feed/shared";

describe("worker", () => {
  test("worker entry exists", async () => {
    const mod = await import("../src/index");
    expect(mod.default).toBeDefined();
    expect(typeof mod.default.fetch).toBe("function");
  });
});
