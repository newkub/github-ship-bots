import { describe, test, expect, beforeEach } from "bun:test";
import { Probot } from "probot";
import { pullRequestHandler } from "../../src/handlers/pull-request.ts";

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

  beforeEach(() => {
    app = new Probot({ appId: 1, privateKey: "test", secret: "test" });
    handlers = {} as any;
    (app as any).on = (event: string, fn: any) => {
      handlers[event] = handlers[event] || [];
      handlers[event].push(fn);
    };
    pullRequestHandler(app as any);
  });

  test("comments a card when PR opened", async () => {
    const ctx = createMockContext({
      repository: { owner: { login: "newkub" }, name: "devin-skills" },
      pull_request: { number: 2, title: "Add ship-feed bot" },
    });

    for (const fn of handlers["pull_request.opened"] || []) {
      await fn(ctx);
    }

    expect(ctx.calls.length).toBe(1);
    expect(ctx.calls[0].args.body).toContain("github-ship-bots card");
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
});
