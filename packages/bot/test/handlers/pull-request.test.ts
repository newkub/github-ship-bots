import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { Probot } from "probot";
import { pullRequestHandler } from "../../src/handlers/pull-request.ts";
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
        },
        pulls: {
          merge: async (args: any) => {
            calls.push({ name: "merge", args });
          },
          get: async () => ({ data: "diff content" }),
        },
      },
    },
    get calls() {
      return calls;
    },
  };
}

describe("pull request handler", () => {
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
      return new Response(JSON.stringify({ ok: true, card: { id: "card-pr-1", score: 8.2 } }), {
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
    pullRequestHandler(app as any);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("creates a card and comments when PR opened", async () => {
    const ctx = createMockContext({
      repository: { owner: { login: "newkub" }, name: "devin-skills" },
      pull_request: { number: 2, title: "Add ship-feed bot", body: "" },
    });

    for (const fn of handlers["pull_request.opened"] || []) {
      await fn(ctx);
    }

    expect(fetchCalls.length).toBe(2);
    expect(fetchCalls[0].url).toBe("https://test/api/cards/webhook");
    expect(fetchCalls[1].url).toBe("https://test/api/evidence/webhook");

    expect(ctx.calls.length).toBe(1);
    expect(ctx.calls[0].args.body).toContain("github-ship-bots card");
    expect(ctx.calls[0].args.body).toContain("`/ship`");
    expect(ctx.calls[0].args.body).toContain("card-pr-1");
  });

  test("merges PR on /approve", async () => {
    const ctx = createMockContext({
      repository: { owner: { login: "newkub" }, name: "devin-skills" },
      issue: { number: 2, pull_request: {} },
      comment: { body: "/approve", user: { login: "newkub" } },
    });

    for (const fn of handlers["issue_comment.created"] || []) {
      await fn(ctx);
    }

    const merge = ctx.calls.find((c) => c.name === "merge");
    expect(merge).toBeDefined();
    expect(merge.args.pull_number).toBe(2);
    expect(merge.args.merge_method).toBe("squash");
  });

  test("queues ship pipeline on /ship", async () => {
    const ctx = createMockContext({
      repository: { owner: { login: "newkub" }, name: "devin-skills" },
      issue: { number: 2, pull_request: {} },
      comment: { body: "/ship", user: { login: "newkub" } },
    });

    for (const fn of handlers["issue_comment.created"] || []) {
      await fn(ctx);
    }

    const merge = ctx.calls.find((c) => c.name === "merge");
    expect(merge).toBeUndefined();

    const labels = ctx.calls.find((c) => c.name === "addLabels");
    expect(labels).toBeDefined();
    expect(labels.args.labels).toContain("shipped");

    const comment = ctx.calls.find((c) => c.name === "createComment");
    expect(comment).toBeDefined();
    expect(comment.args.body).toContain("ship");
  });
});
