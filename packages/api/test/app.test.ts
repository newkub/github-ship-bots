import { describe, expect, test } from "bun:test";
import app from "../src/index";
import type { Env } from "@ship-feed/shared";

describe("api", () => {
  test("GET / returns health payload", async () => {
    const res = await app.request("/", undefined, {} as Env);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.service).toBe("ship-feed-api");
  });
});
