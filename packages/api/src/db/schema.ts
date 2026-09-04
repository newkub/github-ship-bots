import { sqliteTable, text, integer, real, primaryKey, index } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    githubLogin: text("github_login").notNull().unique(),
    email: text("email"),
    workosUserId: text("workos_user_id"),
    plan: text("plan").notNull().default("free"),
    stripeCustomerId: text("stripe_customer_id"),
    createdAt: text("created_at").notNull(),
  },
  (t) => ({
    idxWorkosUserId: index("idx_users_workos_user_id").on(t.workosUserId),
  })
);

export const cards = sqliteTable(
  "cards",
  {
    id: text("id").primaryKey(),
    creatorId: text("creator_id"),
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
  },
  (t) => ({
    idxStatus: index("idx_cards_status").on(t.status),
    idxRepo: index("idx_cards_repo").on(t.repoFullName),
    idxCreator: index("idx_cards_creator").on(t.creatorId),
    idxUpdatedAt: index("idx_cards_updated_at").on(t.updatedAt),
    idxScore: index("idx_cards_score").on(t.score),
  })
);

export const swipes = sqliteTable(
  "swipes",
  {
    id: text("id").primaryKey(),
    cardId: text("card_id").notNull(),
    userId: text("user_id").notNull(),
    direction: text("direction").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (t) => ({
    idxCardId: index("idx_swipes_card_id").on(t.cardId),
    idxUserId: index("idx_swipes_user_id").on(t.userId),
  })
);

export const evidence = sqliteTable(
  "evidence",
  {
    id: text("id").primaryKey(),
    cardId: text("card_id"),
    kind: text("kind").notNull(),
    r2Key: text("r2_key").notNull(),
    sha256: text("sha256").notNull(),
    ciRunUrl: text("ci_run_url"),
    createdAt: text("created_at").notNull(),
  },
  (t) => ({
    idxCardId: index("idx_evidence_card_id").on(t.cardId),
  })
);

export const subscriptions = sqliteTable(
  "subscriptions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    stripeSubscriptionId: text("stripe_subscription_id").notNull(),
    plan: text("plan").notNull(),
    status: text("status").notNull(),
    currentPeriodEnd: text("current_period_end").notNull(),
  },
  (t) => ({
    idxUserId: index("idx_subscriptions_user_id").on(t.userId),
  })
);

export const learningWeights = sqliteTable(
  "learning_weights",
  {
    repoFullName: text("repo_full_name").notNull(),
    feature: text("feature").notNull(),
    weight: real("weight").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.repoFullName, t.feature] }),
    idxRepoFeature: index("idx_learning_repo_feature").on(t.repoFullName, t.feature),
  })
);

export const inspectorAnnotations = sqliteTable(
  "inspector_annotations",
  {
    id: text("id").primaryKey(),
    url: text("url").notNull(),
    selector: text("selector").notNull(),
    prompt: text("prompt").notNull(),
    screenshotR2Key: text("screenshot_r2_key"),
    cardId: text("card_id"),
    createdAt: text("created_at").notNull(),
  },
  (t) => ({
    idxCardId: index("idx_inspector_card_id").on(t.cardId),
  })
);

export const webhookEvents = sqliteTable("webhook_events", {
  id: text("id").primaryKey(),
  stripeEventId: text("stripe_event_id").notNull().unique(),
  eventType: text("event_type").notNull(),
  processedAt: text("processed_at").notNull(),
});

export const pushSubscriptions = sqliteTable(
  "push_subscriptions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id"),
    endpoint: text("endpoint").notNull().unique(),
    p256dh: text("p256dh").notNull(),
    auth: text("auth").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (t) => ({
    idxUserId: index("idx_push_subscriptions_user_id").on(t.userId),
  })
);

export const testOracleBaselines = sqliteTable(
  "test_oracle_baselines",
  {
    id: text("id").primaryKey(),
    repoFullName: text("repo_full_name").notNull(),
    name: text("name").notNull(),
    r2Key: text("r2_key").notNull(),
    sha256: text("sha256").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (t) => ({
    idxRepo: index("idx_oracle_baselines_repo").on(t.repoFullName),
  })
);

export const testOracleResults = sqliteTable(
  "test_oracle_results",
  {
    id: text("id").primaryKey(),
    baselineId: text("baseline_id").notNull(),
    cardId: text("card_id").notNull(),
    diffScore: real("diff_score").notNull(),
    passed: integer("passed", { mode: "boolean" }).notNull(),
    r2DiffKey: text("r2_diff_key"),
    createdAt: text("created_at").notNull(),
  },
  (t) => ({
    idxCardId: index("idx_oracle_results_card_id").on(t.cardId),
    idxBaselineId: index("idx_oracle_results_baseline_id").on(t.baselineId),
  })
);

export const approvalRules = sqliteTable("approval_rules", {
  repoFullName: text("repo_full_name").primaryKey(),
  minApprovers: integer("min_approvers").notNull().default(1),
  minRejectors: integer("min_rejectors").notNull().default(1),
  voteWeight: integer("vote_weight").notNull().default(1),
  vetoEnabled: integer("veto_enabled", { mode: "boolean" }).notNull().default(false),
  updatedAt: text("updated_at").notNull(),
});

export const commentTemplates = sqliteTable(
  "comment_templates",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    repoFullName: text("repo_full_name"),
    name: text("name").notNull(),
    body: text("body").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (t) => ({
    idxUserId: index("idx_comment_templates_user_id").on(t.userId),
  })
);

export const cardComments = sqliteTable(
  "card_comments",
  {
    id: text("id").primaryKey(),
    cardId: text("card_id").notNull(),
    userId: text("user_id").notNull(),
    swipeId: text("swipe_id"),
    templateId: text("template_id"),
    body: text("body").notNull(),
    postedToGitHub: integer("posted_to_github", { mode: "boolean" }).notNull().default(false),
    createdAt: text("created_at").notNull(),
  },
  (t) => ({
    idxCardId: index("idx_card_comments_card_id").on(t.cardId),
  })
);

export const userRepos = sqliteTable(
  "user_repos",
  {
    userId: text("user_id").notNull(),
    repoFullName: text("repo_full_name").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.repoFullName] }),
    idxUserId: index("idx_user_repos_user_id").on(t.userId),
    idxRepo: index("idx_user_repos_repo").on(t.repoFullName),
  })
);

export const rateLimits = sqliteTable("rate_limits", {
  id: text("id").primaryKey(),
  count: integer("count").notNull().default(0),
  expiresAt: integer("expires_at").notNull(),
});
