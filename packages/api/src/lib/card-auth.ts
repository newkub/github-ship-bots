import { getSession } from "./session";

export function unauthorized() {
  return { error: "unauthorized" };
}

export function notFound() {
  return { error: "card not found" };
}

export function ensureAuth(
  set: { status?: number | string },
  user: Awaited<ReturnType<typeof getSession>>
): user is NonNullable<typeof user> {
  if (!user) {
    set.status = 401;
    return false;
  }
  return true;
}
