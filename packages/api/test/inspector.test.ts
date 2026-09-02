import { describe, expect, test } from "bun:test";
import app from "../src/index";
import type { Env } from "@ship-feed/shared";

describe("inspector", () => {
  test("POST /api/inspector requires session", async () => {
    const res = await app.request(
      "/api/inspector",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          url: "https://example.com",
          selector: ".hero > h1",
          prompt: "Make the headline more compelling and run CI.",
          repoFullName: "newkub/github-ship-bots",
        }),
      },
      {} as Env
    );
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("unauthorized");
  });
});
