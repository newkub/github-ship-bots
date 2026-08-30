import type { Octokit } from "@octokit/rest";
import { parseCommand, renderCard } from "../domain/actions.ts";

interface Context {
  octokit: Octokit;
  payload: any;
}

export function pullRequestHandler(
  app: { on: (event: string, handler: (ctx: Context) => Promise<void>) => void },
) {
  app.on("pull_request.opened", async ({ octokit, payload }: Context) => {
    const { pull_request } = payload;
    const title = pull_request.title ?? "New PR";
    const body = renderCard({
      title,
      number: pull_request.number,
      status: "pending",
    });

    await octokit.rest.issues.createComment({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issue_number: pull_request.number,
      body,
    });
  });

  app.on("issue_comment.created", async ({ octokit, payload }: Context) => {
    const { comment, issue } = payload;
    if (!("pull_request" in issue) || !issue.pull_request) return;

    const command = parseCommand(comment.body ?? "");
    if (!command) return;

    const label = command === "approve" ? "approved" : "rejected";

    await octokit.rest.issues.addLabels({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issue_number: issue.number,
      labels: [label, "ship-feed"],
    });

    await octokit.rest.issues.createComment({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issue_number: issue.number,
      body: `ship-feed bot: **${command}** by @${comment.user?.login ?? "unknown"}`,
    });

    if (command === "approve") {
      await octokit.rest.pulls.merge({
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        pull_number: issue.number,
        merge_method: "squash",
      });
    }
  });
}
