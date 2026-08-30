import type { Octokit } from "@octokit/rest";
import { parseCommand, renderCard } from "../domain/actions.ts";

interface Context {
  octokit: Octokit;
  payload: any;
}

export function issuesHandler(
  app: { on: (event: string, handler: (ctx: Context) => Promise<void>) => void },
) {
  app.on("issues.opened", async ({ octokit, payload }: Context) => {
    const { issue } = payload;
    const title = issue.title ?? "New idea";
    const body = renderCard({ title, number: issue.number, status: "pending" });

    await octokit.rest.issues.createComment({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issue_number: issue.number,
      body,
    });
  });

  app.on("issue_comment.created", async ({ octokit, payload }: Context) => {
    const { comment, issue } = payload;
    const command = parseCommand(comment.body ?? "");
    if (!command) return;

    const label = command === "approve" ? "approved" : "rejected";
    const state = command === "approve" ? "open" : "closed";

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

    if (state === "closed") {
      await octokit.rest.issues.update({
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        issue_number: issue.number,
        state: "closed",
      });
    }
  });
}
