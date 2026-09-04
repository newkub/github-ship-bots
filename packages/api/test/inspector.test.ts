import { describe, expect, test } from "bun:test";
import app from "../src/index";
import type { Env } from "@ship-feed/shared";

function mockDb(): Env["DB"] {
  return {
    prepare: () => ({
      bind: () => ({ run: async () => ({ success: true }) }),
      all: async () => ({ results: [] }),
      first: async () => undefined,
    }),
  } as unknown as Env["DB"];
}

function mockKv(): Env["SESSION_KV"] {
  return {
    get: async () => null,
    put: async () => undefined,
    delete: async () => undefined,
  } as unknown as Env["SESSION_KV"];
}

describe("inspector", () => {
  test("POST /api/inspector requires session", async () => {
    const res = await app.fetch(
      new Request("http://localhost/api/inspector", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          url: "https://example.com",
          selector: ".hero > h1",
          prompt: "Make the headline more compelling and run CI.",
          repoFullName: "newkub/github-ship-bots",
        }),
      }),
      {
        DB: mockDb(),
        EVIDENCE_BUCKET: {} as Env["EVIDENCE_BUCKET"],
        BASELINE_BUCKET: {} as Env["BASELINE_BUCKET"],
        SESSION_KV: mockKv(),
        PUBLIC_APP_URL: "https://example.com",
      } as Env
    );
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("unauthorized");
  });
});
