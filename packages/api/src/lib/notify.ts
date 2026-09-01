import type { Env, ShipCard } from "@ship-feed/shared";

export async function notifyCardStatus(env: Env, card: ShipCard, event: "created" | "approved" | "rejected" | "shipped") {
  const title = `[ship-feed] ${event}: ${card.title}`;
  const body = `repo: ${card.repoFullName}\nscore: ${card.score.toFixed(1)}\nstatus: ${card.status}`;

  if (card.issueNumber) {
    const url = `https://github.com/${card.repoFullName}/issues/${card.issueNumber}`;
    const tasks = [notifySlack(env, title, body, url), notifyTelegram(env, title, body, url)];
    await Promise.all(tasks.map((p) => p.catch(() => undefined)));
  } else if (card.pullNumber) {
    const url = `https://github.com/${card.repoFullName}/pull/${card.pullNumber}`;
    const tasks = [notifySlack(env, title, body, url), notifyTelegram(env, title, body, url)];
    await Promise.all(tasks.map((p) => p.catch(() => undefined)));
  } else {
    const tasks = [notifySlack(env, title, body), notifyTelegram(env, title, body)];
    await Promise.all(tasks.map((p) => p.catch(() => undefined)));
  }
}

async function notifySlack(env: Env, title: string, body: string, url?: string) {
  if (!env.SLACK_WEBHOOK_URL) return;
  const text = url ? `${title}\n${body}\n${url}` : `${title}\n${body}`;
  await fetch(env.SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text }),
  });
}

async function notifyTelegram(env: Env, title: string, body: string, url?: string) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return;
  const text = url ? `<b>${title}</b>\n<pre>${body}</pre>\n<a href="${url}">Open</a>` : `<b>${title}</b>\n<pre>${body}</pre>`;
  await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: env.TELEGRAM_CHAT_ID,
      text,
      parse_mode: "HTML",
    }),
  });
}
