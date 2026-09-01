import { subscribe, serializeSubscription, getNotificationPermission, requestNotificationPermission } from "@mmmike/web-push/client";

export async function enablePush() {
  const permission = await requestNotificationPermission();
  if (permission !== "granted") return { ok: false, reason: permission };

  const publicKey = await fetchVapidPublicKey();
  if (!publicKey) return { ok: false, reason: "no-vapid-key" };

  const result = await subscribe(publicKey);
  if (result.status !== "subscribed") return { ok: false, reason: result.status };

  const data = serializeSubscription(result.subscription);
  const res = await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) return { ok: false, reason: "server-error" };

  return { ok: true };
}

export async function canPush() {
  return getNotificationPermission() === "granted";
}

async function fetchVapidPublicKey() {
  const res = await fetch("/api/push/vapid-public-key");
  const data = await res.json<{ publicKey: string | null }>();
  return data.publicKey;
}
