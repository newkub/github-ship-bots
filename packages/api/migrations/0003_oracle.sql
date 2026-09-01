CREATE TABLE IF NOT EXISTS test_oracle_baselines (
  id TEXT PRIMARY KEY,
  repo_full_name TEXT NOT NULL,
  name TEXT NOT NULL,
  r2_key TEXT NOT NULL,
  sha256 TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS test_oracle_results (
  id TEXT PRIMARY KEY,
  baseline_id TEXT NOT NULL,
  card_id TEXT NOT NULL,
  diff_score REAL NOT NULL,
  passed BOOLEAN NOT NULL,
  r2_diff_key TEXT,
  created_at TEXT NOT NULL
);
