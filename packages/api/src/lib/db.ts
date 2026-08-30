import type { D1Database } from "@cloudflare/workers-types";

export function first<T>(rows: T[]): T | undefined {
  return rows[0];
}

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function now() {
  return new Date().toISOString();
}
