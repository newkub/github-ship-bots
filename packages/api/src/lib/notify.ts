import type { Env, ShipCard } from "@ship-feed/shared";
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
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
  const safeTitle = escapeHtml(title);
  const safeBody = escapeHtml(body);
  const safeUrl = url ? escapeHtml(url) : undefined;
  const text = safeUrl
    ? `<b>${safeTitle}</b>\n<pre>${safeBody}</pre>\n<a href="${safeUrl}">Open</a>`
    : `<b>${safeTitle}</b>\n<pre>${safeBody}</pre>`;
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
