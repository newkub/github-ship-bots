import { Probot } from "probot";
import { parseCommand, renderCard } from "../domain/actions.ts";

export function pullRequestHandler(app: Probot) {
  app.on("pull_request.opened", async (context) => {
    const { pull_request } = context.payload;
    const title = pull_request.title ?? "New PR";
    const body = renderCard({
      title,
      number: pull_request.number,
      status: "pending",
    });

    await context.octokit.rest.issues.createComment({
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      issue_number: pull_request.number,
      body,
    });
  });

  app.on("issue_comment.created", async (context) => {
    const { comment, issue } = context.payload;
    if (!("pull_request" in issue) || !issue.pull_request) return;

    const command = parseCommand(comment.body ?? "");
    if (!command) return;

    const label = command === "approve" ? "approved" : "rejected";

    await context.octokit.rest.issues.addLabels({
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      issue_number: issue.number,
      labels: [label, "ship-feed"],
    });

    await context.octokit.rest.issues.createComment({
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      issue_number: issue.number,
      body: `ship-feed bot: **${command}** by @${comment.user?.login ?? "unknown"}`,
    });

    if (command === "approve") {
      await context.octokit.rest.pulls.merge({
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        pull_number: issue.number,
        merge_method: "squash",
      });
    }
  });
}
