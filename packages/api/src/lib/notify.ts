import type { Env, ShipCard } from "@ship-feed/shared";
import { fetchExternal, getCorrelationId } from "@ship-feed/shared";
import { sendPushBatch } from "@mmmike/web-push/send";
import type { VapidConfig, PushSubscriptionData } from "@mmmike/web-push/send";

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
  const githubWeb = env.GITHUB_WEB_URL || "https://github.com";
  const correlationId = getCorrelationId();
  let url: string | undefined;
  if (card.issueNumber) {
    url = `${githubWeb}/${card.repoFullName}/issues/${card.issueNumber}`;
  } else if (card.pullNumber) {
    url = `${githubWeb}/${card.repoFullName}/pull/${card.pullNumber}`;
  }

  const tasks = [notifySlack(env, title, body, correlationId, url), notifyTelegram(env, title, body, correlationId, url), notifyPush(env, card, title, body, url)];
  await Promise.all(tasks.map((p) => p.catch(() => undefined)));
}

async function notifySlack(env: Env, title: string, body: string, correlationId: string, url?: string) {
  if (!env.SLACK_WEBHOOK_URL) return;
  const text = url ? `${title}\n${body}\n${url}` : `${title}\n${body}`;
  await fetchExternal("slack", "send", correlationId, env.SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text }),
  });
}

async function notifyTelegram(env: Env, title: string, body: string, correlationId: string, url?: string) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return;
  const safeTitle = escapeHtml(title);
  const safeBody = escapeHtml(body);
  const safeUrl = url ? escapeHtml(url) : undefined;
  const text = safeUrl
    ? `<b>${safeTitle}</b>\n<pre>${safeBody}</pre>\n<a href="${safeUrl}">Open</a>`
    : `<b>${safeTitle}</b>\n<pre>${safeBody}</pre>`;
  await fetchExternal("telegram", "send", correlationId, `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: env.TELEGRAM_CHAT_ID,
      text,
      parse_mode: "HTML",
    }),
  });
}

function getVapidConfig(env: Env): VapidConfig | undefined {
  if (!env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_KEY || !env.VAPID_SUBJECT) return undefined;
  return {
    publicKey: env.VAPID_PUBLIC_KEY,
    privateKey: env.VAPID_PRIVATE_KEY,
    subject: env.VAPID_SUBJECT,
  };
}

async function notifyPush(env: Env, card: ShipCard, title: string, body: string, url?: string) {
  const vapid = getVapidConfig(env);
  if (!vapid || !env.DB) return;

  const { results } = await env.DB
    .prepare(
      `SELECT p.endpoint, p.p256dh, p.auth FROM push_subscriptions p
       WHERE p.user_id IN (
         SELECT user_id FROM user_repos WHERE repo_full_name = ?
         UNION
         SELECT ?
       )`
    )
    .bind(card.repoFullName, card.creatorId)
    .all<{ endpoint: string; p256dh: string; auth: string }>();

  if (!results || results.length === 0) return;

  const subscriptions: PushSubscriptionData[] = results.map((row) => ({
    endpoint: row.endpoint,
    keys: { p256dh: row.p256dh, auth: row.auth },
  }));

  const payload = {
    title,
    body,
    url: url || `${env.PUBLIC_APP_URL}/dashboard/`,
    tag: card.id,
  };

  const result = await sendPushBatch(subscriptions, payload, vapid);
  for (const gone of result.gone) {
    await env.DB.prepare("DELETE FROM push_subscriptions WHERE endpoint = ?").bind(gone).run();
  }
}
