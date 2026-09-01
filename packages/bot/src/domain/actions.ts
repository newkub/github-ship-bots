export type CardStatus = "pending" | "approved" | "rejected" | "shipped";

export interface Card {
  title: string;
  number?: number;
  status: CardStatus;
  showShip?: boolean;
}

export function renderCard(card: Card): string {
  const emoji =
    card.status === "approved"
      ? "approved"
      : card.status === "rejected"
        ? "rejected"
        : "pending";
  const actions = card.showShip
    ? "Reply with \`/approve\`, \`/reject\` or \`/ship\` to vote."
    : "Reply with \`/approve\` or \`/reject\` to vote.";
  return `## github-ship-bots card: ${card.title}

| Status | Value |
|---|---|
| number | ${card.number ?? "-"} |
| status | \`${card.status}\` |

${actions}`;
}

export function parseCommand(body: string): "approve" | "reject" | "ship" | null {
  const lower = body.toLowerCase().trim();
  if (lower === "/approve") return "approve";
  if (lower === "/reject") return "reject";
  if (lower === "/ship") return "ship";
  return null;
}
