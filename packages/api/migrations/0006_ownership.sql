ALTER TABLE cards ADD COLUMN creator_id TEXT;

CREATE TABLE IF NOT EXISTS user_repos (
  user_id TEXT NOT NULL,
  repo_full_name TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (user_id, repo_full_name)
);

CREATE INDEX IF NOT EXISTS idx_cards_creator_id ON cards(creator_id);
CREATE INDEX IF NOT EXISTS idx_cards_status ON cards(status);
CREATE INDEX IF NOT EXISTS idx_cards_repo_full_name ON cards(repo_full_name);
CREATE INDEX IF NOT EXISTS idx_cards_updated_at ON cards(updated_at);

CREATE INDEX IF NOT EXISTS idx_swipes_card_id ON swipes(card_id);
CREATE INDEX IF NOT EXISTS idx_swipes_user_id ON swipes(user_id);

CREATE INDEX IF NOT EXISTS idx_evidence_card_id ON evidence(card_id);
CREATE INDEX IF NOT EXISTS idx_user_plugins_user_id ON user_plugins(user_id);
