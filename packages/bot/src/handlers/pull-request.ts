import {
  type ShipFeedWebhooks,
  type PullRequestOpenedPayload,
  type IssueCommentPayload,
} from "../types.ts";
import { parseCommand, renderCard } from "../domain/actions.ts";
import { createCardFromWebhook, uploadEvidence } from "../lib/api.ts";
import { generateReviewComment } from "../lib/review.ts";

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

    try {
      const { data: diff } = await octokit.rest.pulls.get({
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        pull_number: pull_request.number,
        mediaType: { format: "diff" },
      });
      if (typeof diff === "string") {
        const encoded = btoa(diff);
        await uploadEvidence({
          cardId: card.card.id,
          kind: "diff",
          data: encoded,
        });
      }
    } catch {
      // diff not available in test / private repos
    }

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

    try {
      const { data: diff } = await octokit.rest.pulls.get({
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        pull_number: pull_request.number,
        mediaType: { format: "diff" },
      });
      if (typeof diff === "string") {
        const reviewBody = await generateReviewComment(diff);
        await octokit.rest.pulls.createReview({
          owner: payload.repository.owner.login,
          repo: payload.repository.name,
          pull_number: pull_request.number,
          event: "COMMENT",
          body: reviewBody,
        });
      }
    } catch {
      // review not available in test / private repos
    }
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
