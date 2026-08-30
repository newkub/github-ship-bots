CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  github_login TEXT NOT NULL UNIQUE,
  email TEXT,
  workos_user_id TEXT,
  plan TEXT NOT NULL DEFAULT 'free',
  stripe_customer_id TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cards (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  repo_full_name TEXT NOT NULL,
  issue_number INTEGER,
  pull_number INTEGER,
  impact TEXT NOT NULL,
  risk TEXT NOT NULL,
  effect TEXT NOT NULL,
  phase TEXT NOT NULL,
  score REAL NOT NULL,
  evidence_ids TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS swipes (
  id TEXT PRIMARY KEY,
  card_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  direction TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS evidence (
  id TEXT PRIMARY KEY,
  card_id TEXT,
  kind TEXT NOT NULL,
  r2_key TEXT NOT NULL,
  sha256 TEXT NOT NULL,
  ci_run_url TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  stripe_subscription_id TEXT NOT NULL,
  plan TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_end TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS learning_weights (
  repo_full_name TEXT NOT NULL,
  feature TEXT NOT NULL,
  weight REAL NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (repo_full_name, feature)
);

CREATE TABLE IF NOT EXISTS inspector_annotations (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  selector TEXT NOT NULL,
  prompt TEXT NOT NULL,
  screenshot_r2_key TEXT,
  card_id TEXT,
  created_at TEXT NOT NULL
);
