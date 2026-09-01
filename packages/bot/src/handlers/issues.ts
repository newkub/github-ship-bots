import {
  type ShipFeedWebhooks,
  type IssueOpenedPayload,
  type IssueCommentPayload,
} from "../types.ts";
import { parseCommand, renderCard } from "../domain/actions.ts";

function isApprove(command: "approve" | "reject" | "ship"): boolean {
  return command === "approve";
}

export function issuesHandler(webhooks: ShipFeedWebhooks) {
  webhooks.on<IssueOpenedPayload>("issues.opened", async ({ octokit, payload }) => {
    const { issue } = payload;
    const body = renderCard({
      title: issue.title,
      number: issue.number,
      status: "pending",
    });

    await octokit.rest.issues.createComment({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issue_number: issue.number,
      body,
    });
  });

  webhooks.on<IssueCommentPayload>("issue_comment.created", async ({ octokit, payload }) => {
    const { comment, issue } = payload;
    if (issue.pull_request) return;

    const command = parseCommand(comment.body ?? "");
    if (!command) return;
    if (command === "ship") return;

    const label = isApprove(command) ? "approved" : "rejected";
    const shouldClose = !isApprove(command);

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
      body: `github-ship-bots: **${command}** by @${comment.user?.login ?? "unknown"}`,
    });

    if (shouldClose) {
      await octokit.rest.issues.update({
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        issue_number: issue.number,
        state: "closed",
      });
    }
  });
}
