import { Probot } from "probot";
import { parseCommand, renderCard } from "../domain/actions.ts";

export function issuesHandler(app: Probot) {
  app.on("issues.opened", async (context) => {
    const { issue } = context.payload;
    const title = issue.title ?? "New idea";
    const body = renderCard({ title, number: issue.number, status: "pending" });

    await context.octokit.rest.issues.createComment({
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      issue_number: issue.number,
      body,
    });
  });

  app.on("issue_comment.created", async (context) => {
    const { comment, issue } = context.payload;
    const command = parseCommand(comment.body ?? "");
    if (!command) return;

    const label = command === "approve" ? "approved" : "rejected";
    const state = command === "approve" ? "open" : "closed";

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

    if (state === "closed") {
      await context.octokit.rest.issues.update({
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        issue_number: issue.number,
        state: "closed",
      });
    }
  });
}
