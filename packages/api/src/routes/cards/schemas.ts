import { z } from "zod";

export const impactSchema = z.enum(["high", "medium", "low"]);
export const riskSchema = z.enum(["high", "medium", "low"]);
export const effectSchema = z.enum(["high", "medium", "low"]);
export const phaseSchema = z.enum(["mvp", "v2", "done"]);
export const kindSchema = z.enum(["idea", "work", "merge", "release"]);
export const statusSchema = z.enum(["pending", "approved", "rejected", "shipped"]);
export const directionSchema = z.enum(["approve", "reject"]);

export const cardInputSchema = z.object({
  kind: kindSchema,
  title: z.string(),
  description: z.string(),
  repoFullName: z.string(),
  issueNumber: z.number().optional(),
  pullNumber: z.number().optional(),
  impact: impactSchema.default("medium"),
  risk: riskSchema.default("medium"),
  effect: effectSchema.default("medium"),
  phase: phaseSchema.default("mvp"),
  creatorLogin: z.string().optional(),
});

export const swipeSchema = z.object({
  direction: directionSchema,
  comment: z.string().max(500).optional(),
});

export const paramsSchema = z.object({ id: z.string() });
