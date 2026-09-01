import {
  type ShipFeedWebhooks,
  type PullRequestOpenedPayload,
  type IssueCommentPayload,
} from "../types.ts";
import { parseCommand, renderCard } from "../domain/actions.ts";
import { createCardFromWebhook } from "../lib/api.ts";

function isApprove(command: "approve" | "reject" | "ship"): boolean {
  return command === "approve";
}

export function pullRequestHandler(webhooks: ShipFeedWebhooks) {
  webhooks.on<PullRequestOpenedPayload>("pull_request.opened", async ({ octokit, payload }) => {
    const { pull_request } = payload;

    const card = await createCardFromWebhook({
      kind: "merge",
      title: pull_request.title,
      description: pull_request.body ?? "",
      repoFullName: `${payload.repository.owner.login}/${payload.repository.name}`,
      pullNumber: pull_request.number,
    });

    const body = renderCard({
      title: pull_request.title,
      number: pull_request.number,
      status: "pending",
      showShip: true,
      cardId: card.card.id,
      score: card.card.score,
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

    const label = command === "ship" ? "shipped" : isApprove(command) ? "approved" : "rejected";

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
