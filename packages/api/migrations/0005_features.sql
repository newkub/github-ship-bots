CREATE TABLE IF NOT EXISTS approval_rules (
  repo_full_name TEXT PRIMARY KEY,
  min_approvers INTEGER NOT NULL DEFAULT 1,
  min_rejectors INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS comment_templates (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  repo_full_name TEXT,
  name TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS card_comments (
  id TEXT PRIMARY KEY,
  card_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  template_id TEXT,
  body TEXT NOT NULL,
  posted_to_github INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS security_findings (
  id TEXT PRIMARY KEY,
  card_id TEXT,
  repo_full_name TEXT NOT NULL,
  type TEXT NOT NULL,
  severity TEXT NOT NULL,
  description TEXT NOT NULL,
  resolved_at TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS rollback_events (
  id TEXT PRIMARY KEY,
  card_id TEXT NOT NULL,
  deployment_id TEXT,
  reason TEXT NOT NULL,
  success INTEGER NOT NULL DEFAULT 0,
  rolled_back_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS refactor_artifacts (
  id TEXT PRIMARY KEY,
  card_id TEXT NOT NULL,
  diff_key TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS issue_traces (
  id TEXT PRIMARY KEY,
  issue_id TEXT NOT NULL,
  card_id TEXT,
  event TEXT NOT NULL,
  detail TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ci_diagnostics (
  id TEXT PRIMARY KEY,
  card_id TEXT,
  run_id TEXT NOT NULL,
  log_key TEXT NOT NULL,
  diagnosis TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS usage_events (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  event TEXT NOT NULL,
  metadata TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS agent_sdks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL UNIQUE,
  token TEXT NOT NULL,
  config TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS notification_channels (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  channel TEXT NOT NULL,
  webhook TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS health_checks (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  metrics TEXT NOT NULL DEFAULT '{}',
  run_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS voice_commands (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  audio_key TEXT,
  transcript TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TEXT NOT NULL
);
