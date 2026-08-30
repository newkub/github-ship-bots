import {
  type ShipFeedWebhooks,
  type PullRequestOpenedPayload,
  type IssueCommentPayload,
} from "../types.ts";
import { parseCommand, renderCard } from "../domain/actions.ts";

function isApprove(command: "approve" | "reject"): boolean {
  return command === "approve";
}

export function pullRequestHandler(webhooks: ShipFeedWebhooks) {
  webhooks.on<PullRequestOpenedPayload>("pull_request.opened", async ({ octokit, payload }) => {
    const { pull_request } = payload;
    const body = renderCard({
      title: pull_request.title,
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

  webhooks.on<IssueCommentPayload>("issue_comment.created", async ({ octokit, payload }) => {
    const { comment, issue } = payload;
    if (!issue.pull_request) return;

    const command = parseCommand(comment.body ?? "");
    if (!command) return;

    const label = isApprove(command) ? "approved" : "rejected";

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

    if (isApprove(command)) {
      await octokit.rest.pulls.merge({
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        pull_number: issue.number,
        merge_method: "squash",
      });
    }
  });
}
