import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { Probot } from "probot";
import { issuesHandler } from "../../src/handlers/issues.ts";
import { setBotEnv } from "../../src/lib/api.ts";
import { createBotEnv } from "../../src/types.ts";

function createMockContext(payload: any) {
  const calls: any[] = [];
  return {
    payload,
    octokit: {
      rest: {
        issues: {
          createComment: async (args: any) => {
            calls.push({ name: "createComment", args });
          },
          addLabels: async (args: any) => {
            calls.push({ name: "addLabels", args });
          },
          update: async (args: any) => {
            calls.push({ name: "update", args });
          },
        },
      },
    },
    get calls() {
      return calls;
    },
  };
}

describe("issues handler", () => {
  let app: Probot;
  let handlers: Record<string, ((ctx: any) => Promise<void>)[]>;
  let fetchCalls: { url: string; init: any }[];
  let originalFetch: typeof fetch;

  beforeEach(() => {
    fetchCalls = [];
    originalFetch = globalThis.fetch;
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input.toString();
      fetchCalls.push({ url, init });
      return new Response(JSON.stringify({ ok: true, card: { id: "card-123", score: 7.5 } }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    };

    setBotEnv(createBotEnv({ API_URL: "https://test", API_TOKEN: "token" }));

    app = new Probot({ appId: 1, privateKey: "test", secret: "test" });
    handlers = {} as any;
    (app as any).on = (event: string, fn: any) => {
      handlers[event] = handlers[event] || [];
      handlers[event].push(fn);
    };
    issuesHandler(app as any);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("creates a card and comments when issue opened", async () => {
    const ctx = createMockContext({
      repository: { owner: { login: "newkub" }, name: "devin-skills" },
      issue: { number: 1, title: "[Plan] ship-feed", body: "" },
    });

    for (const fn of handlers["issues.opened"] || []) {
      await fn(ctx);
    }

    expect(fetchCalls.length).toBe(1);
    expect(fetchCalls[0].url).toBe("https://test/api/cards/webhook");

    expect(ctx.calls.length).toBe(1);
    expect(ctx.calls[0].args.body).toContain("github-ship-bots card");
    expect(ctx.calls[0].args.body).toContain("`/approve` or `/reject`");
    expect(ctx.calls[0].args.body).toContain("card-123");
  });

  test("labels approved and comments on /approve", async () => {
    const ctx = createMockContext({
      repository: { owner: { login: "newkub" }, name: "devin-skills" },
      issue: { number: 1 },
      comment: { body: "/approve", user: { login: "newkub" } },
    });

    for (const fn of handlers["issue_comment.created"] || []) {
      await fn(ctx);
    }

    const labels = ctx.calls.find((c) => c.name === "addLabels");
    expect(labels).toBeDefined();
    expect(labels.args.labels).toContain("approved");

    const comment = ctx.calls.find((c) => c.name === "createComment");
    expect(comment).toBeDefined();
    expect(comment.args.body).toContain("approve");
  });

  test("ignores unknown commands", async () => {
    const ctx = createMockContext({
      repository: { owner: { login: "newkub" }, name: "devin-skills" },
      issue: { number: 1 },
      comment: { body: "hello", user: { login: "newkub" } },
    });

    for (const fn of handlers["issue_comment.created"] || []) {
      await fn(ctx);
    }

    expect(ctx.calls.length).toBe(0);
  });

  test("ignores /ship on issues", async () => {
    const ctx = createMockContext({
      repository: { owner: { login: "newkub" }, name: "devin-skills" },
      issue: { number: 1 },
      comment: { body: "/ship", user: { login: "newkub" } },
    });

    for (const fn of handlers["issue_comment.created"] || []) {
      await fn(ctx);
    }

    expect(ctx.calls.length).toBe(0);
  });
});
