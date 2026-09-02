import { sqliteTable, text, integer, real, primaryKey } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  githubLogin: text("github_login").notNull().unique(),
  email: text("email"),
  workosUserId: text("workos_user_id"),
  plan: text("plan").notNull().default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: text("created_at").notNull(),
});

export const cards = sqliteTable("cards", {
  id: text("id").primaryKey(),
  kind: text("kind").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("pending"),
  repoFullName: text("repo_full_name").notNull(),
  issueNumber: integer("issue_number"),
  pullNumber: integer("pull_number"),
  impact: text("impact").notNull(),
  risk: text("risk").notNull(),
  effect: text("effect").notNull(),
  phase: text("phase").notNull(),
  score: real("score").notNull(),
  evidenceIds: text("evidence_ids").notNull().default("[]"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const swipes = sqliteTable("swipes", {
  id: text("id").primaryKey(),
  cardId: text("card_id").notNull(),
  userId: text("user_id").notNull(),
  direction: text("direction").notNull(),
  createdAt: text("created_at").notNull(),
});

export const evidence = sqliteTable("evidence", {
  id: text("id").primaryKey(),
  cardId: text("card_id"),
  kind: text("kind").notNull(),
  r2Key: text("r2_key").notNull(),
  sha256: text("sha256").notNull(),
  ciRunUrl: text("ci_run_url"),
  createdAt: text("created_at").notNull(),
});

export const plugins = sqliteTable("plugins", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  installs: integer("installs").notNull().default(0),
  icon: text("icon").notNull().default("Puzzle"),
});

export const userPlugins = sqliteTable("user_plugins", {
  userId: text("user_id").notNull(),
  pluginId: text("plugin_id").notNull(),
  createdAt: text("created_at").notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.pluginId] }),
}));
