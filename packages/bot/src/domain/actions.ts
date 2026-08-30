export type CardStatus = "pending" | "approved" | "rejected";

export interface Card {
  title: string;
  number?: number;
  status: CardStatus;
}

export function renderCard(card: Card): string {
  const emoji =
    card.status === "approved"
      ? "approved"
      : card.status === "rejected"
        ? "rejected"
        : "pending";
  return `## github-ship-bots card: ${card.title}

| Status | Value |
|---|---|
| number | ${card.number ?? "-"} |
| status | \`${card.status}\` |

Reply with \`/approve\` or \`/reject\` to vote.`;
}

export function parseCommand(body: string): "approve" | "reject" | null {
  const lower = body.toLowerCase().trim();
  if (lower === "/approve") return "approve";
  if (lower === "/reject") return "reject";
  return null;
}
