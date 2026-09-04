import { Elysia, t } from "elysia";
import { getSession } from "../lib/session";
import { ensureAuth, unauthorized } from "../lib/card-auth";
import { rowToCard } from "../lib/card-mapper";
import { withEnv } from "../lib/env";

const querySchema = t.Object({
  from: t.Optional(t.String()),
  to: t.Optional(t.String()),
});

function releaseNotes(cards: ReturnType<typeof rowToCard>[], from: string, to: string) {
  const title = `Release ${from} to ${to}`;
  const sections: string[] = [];

  const byRepo = Map.groupBy ? Map.groupBy(cards, (c) => c.repoFullName) : groupBy(cards, (c) => c.repoFullName);

  for (const [repo, items] of Object.entries(byRepo)) {
    sections.push(`### ${repo}`);
    for (const card of items ?? []) {
      const line = card.pullNumber
        ? `- #${card.pullNumber}: ${card.title}`
        : card.issueNumber
          ? `- #${card.issueNumber}: ${card.title}`
          : `- ${card.title}`;
      sections.push(`  ${line}`);
    }
  }

  const body = sections.length ? sections.join("\n") : "_No shipped cards in this range._";

  return {
    title,
    range: { from, to },
    markdown: `# ${title}\n\n${body}\n`,
    cards: cards.map((c) => ({ id: c.id, title: c.title, repoFullName: c.repoFullName })),
  };
}

function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const k = key(item);
    (acc[k] ??= []).push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

const releases = withEnv(new Elysia())
  .get("/notes", async ({ request, set, env, query }) => {
    const session = await getSession({ request, set, env });
    if (!ensureAuth(set, session)) return unauthorized();

    const to = query.to ? new Date(query.to) : new Date();
    const from = query.from ? new Date(query.from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const fromStr = from.toISOString().split("T")[0]!;
    const toStr = to.toISOString().split("T")[0]!;

    const { results } = await env.DB
      .prepare(
        `SELECT * FROM cards
         WHERE status = 'shipped'
           AND updated_at >= ?
           AND updated_at <= ?
           AND (creator_id = ? OR repo_full_name IN (SELECT repo_full_name FROM user_repos WHERE user_id = ?))
         ORDER BY updated_at DESC`
      )
      .bind(from.toISOString(), to.toISOString(), session.id, session.id)
      .all<Record<string, unknown>>();

    const cards = (results ?? []).map(rowToCard);
    return releaseNotes(cards, fromStr, toStr);
  }, { query: querySchema });

export default releases;
