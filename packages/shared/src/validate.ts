export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !Number.isNaN(value);
}

export function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || value === null || isString(value);
}

export function isOptionalNumber(value: unknown): value is number | undefined {
  return value === undefined || value === null || isNumber(value);
}

export function isEnumValue<T extends string>(value: unknown, allowed: readonly T[]): value is T {
  return isString(value) && allowed.some((item) => item === value);
}

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

export function assertString(value: unknown, name: string): string {
  if (!isString(value)) throw new Error(`Expected ${name} to be a string`);
  return value;
}

export function assertNumber(value: unknown, name: string): number {
  if (!isNumber(value)) throw new Error(`Expected ${name} to be a number`);
  return value;
}

export function assertOptionalNumber(value: unknown, name: string): number | undefined {
  if (value === undefined || value === null) return undefined;
  if (!isNumber(value)) throw new Error(`Expected ${name} to be a number or null`);
  return value;
}

export function assertOptionalString(value: unknown, name: string): string | undefined {
  if (value === undefined || value === null) return undefined;
  return assertString(value, name);
}

export function assertEnumValue<T extends string>(value: unknown, allowed: readonly T[], name: string): T {
  if (!isEnumValue(value, allowed)) throw new Error(`Expected ${name} to be one of ${allowed.join(", ")}`);
  return value;
}

import type { User, PlanTier } from "./user.types";

export function assertRecord(value: unknown, name: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Expected ${name} to be an object`);
  }
  return value as Record<string, unknown>;
}

export function assertBoolean(value: unknown, name: string): boolean {
  if (typeof value !== "boolean") throw new Error(`Expected ${name} to be a boolean`);
  return value;
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function assertArray(value: unknown, name: string): unknown[] {
  if (!isArray(value)) throw new Error(`Expected ${name} to be an array`);
  return value;
}

const PLAN_TIERS: readonly PlanTier[] = ["free", "pro", "team"];

export function assertUser(value: unknown): User {
  const record = assertRecord(value, "User");
  return {
    id: assertString(record.id, "id"),
    githubLogin: assertString(record.githubLogin, "githubLogin"),
    email: assertOptionalString(record.email, "email"),
    workosUserId: assertOptionalString(record.workosUserId, "workosUserId"),
    plan: assertEnumValue(record.plan, PLAN_TIERS, "plan"),
    stripeCustomerId: assertOptionalString(record.stripeCustomerId, "stripeCustomerId"),
    createdAt: assertString(record.createdAt, "createdAt"),
  };
}
