CREATE TABLE IF NOT EXISTS plugins (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  installs INTEGER NOT NULL DEFAULT 0,
  icon TEXT NOT NULL DEFAULT 'Puzzle'
);

CREATE TABLE IF NOT EXISTS user_plugins (
  user_id TEXT NOT NULL,
  plugin_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (user_id, plugin_id)
);

INSERT OR IGNORE INTO plugins (id, name, description, installs, icon) VALUES
  ('ship-svelte', 'ship-svelte', 'Auto-implement and ship Svelte components.', 1200, 'Sparkles'),
  ('test-coverage', 'test-coverage', 'Generate tests from traffic and coverage gaps.', 890, 'TestTube'),
  ('issue-resolver', 'issue-resolver', 'Parse issues, plan, and open PRs automatically.', 2100, 'Check'),
  ('code-review', 'code-review', 'Suggest smart comments and review PRs.', 1500, 'Shield'),
  ('auto-deploy', 'auto-deploy', 'Deploy, monitor health, and rollback on failure.', 760, 'Wand2');
