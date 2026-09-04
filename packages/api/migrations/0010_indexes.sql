CREATE INDEX IF NOT EXISTS idx_cards_status ON cards(status);
CREATE INDEX IF NOT EXISTS idx_cards_repo ON cards(repo_full_name);
CREATE INDEX IF NOT EXISTS idx_cards_creator ON cards(creator_id);
CREATE INDEX IF NOT EXISTS idx_cards_updated_at ON cards(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_cards_score ON cards(score DESC);

CREATE INDEX IF NOT EXISTS idx_swipes_card_id ON swipes(card_id);
CREATE INDEX IF NOT EXISTS idx_swipes_user_id ON swipes(user_id);

CREATE INDEX IF NOT EXISTS idx_evidence_card_id ON evidence(card_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

CREATE INDEX IF NOT EXISTS idx_learning_repo_feature ON learning_weights(repo_full_name, feature);

CREATE INDEX IF NOT EXISTS idx_inspector_card_id ON inspector_annotations(card_id);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);

CREATE INDEX IF NOT EXISTS idx_oracle_baselines_repo ON test_oracle_baselines(repo_full_name);

CREATE INDEX IF NOT EXISTS idx_oracle_results_card_id ON test_oracle_results(card_id);
CREATE INDEX IF NOT EXISTS idx_oracle_results_baseline_id ON test_oracle_results(baseline_id);

CREATE INDEX IF NOT EXISTS idx_user_repos_user_id ON user_repos(user_id);
CREATE INDEX IF NOT EXISTS idx_user_repos_repo ON user_repos(repo_full_name);

CREATE INDEX IF NOT EXISTS idx_card_comments_card_id ON card_comments(card_id);
