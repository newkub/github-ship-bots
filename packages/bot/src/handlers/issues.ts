import {
  type ShipFeedWebhooks,
  type IssueOpenedPayload,
  type IssueCommentPayload,
} from "../types";
import { parseCommand, renderCard } from "../domain/actions";
import { createCardFromWebhook } from "../lib/api";

function isApprove(command: "approve" | "reject" | "ship"): boolean {
  return command === "approve";
}

export function issuesHandler(webhooks: ShipFeedWebhooks) {
  webhooks.on<IssueOpenedPayload>("issues.opened", async ({ octokit, payload }) => {
    const { issue } = payload;

    const card = await createCardFromWebhook({
      kind: "idea",
      title: issue.title,
      description: issue.body ?? "",
      repoFullName: `${payload.repository.owner.login}/${payload.repository.name}`,
      issueNumber: issue.number,
    });

    const body = renderCard({
      title: issue.title,
      number: issue.number,
      status: "pending",
      cardId: card.card.id,
      score: card.card.score,
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
