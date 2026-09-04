-- Seed data for local development and integration tests.
-- Run only in development/test environments.
DELETE FROM cards WHERE id LIKE 'seed-%';
DELETE FROM users WHERE id LIKE 'seed-%';
DELETE FROM swipes WHERE id LIKE 'seed-%';
DELETE FROM user_repos WHERE user_id LIKE 'seed-%';

INSERT OR IGNORE INTO users (id, github_login, email, workos_user_id, plan, created_at) VALUES
('seed-user-1', 'seed-dev', 'seed@example.com', 'workos_seed_1', 'free', datetime('now'));

INSERT OR IGNORE INTO user_repos (user_id, repo_full_name, created_at) VALUES
('seed-user-1', 'newkub/github-ship-bots', datetime('now'));

INSERT INTO cards (id, creator_id, kind, title, description, status, repo_full_name, impact, risk, effect, phase, score, evidence_ids, created_at, updated_at) VALUES
('seed-card-1', 'seed-user-1', 'idea', 'Seed idea card', 'This is a seeded card for development.', 'pending', 'newkub/github-ship-bots', 'medium', 'low', 'high', 'mvp', 7.5, '[]', datetime('now'), datetime('now')),
('seed-card-2', 'seed-user-1', 'pr', 'Seed PR card', 'This is a seeded approved card.', 'approved', 'newkub/github-ship-bots', 'high', 'low', 'high', 'mvp', 8.8, '[]', datetime('now'), datetime('now'));

INSERT INTO swipes (id, card_id, user_id, direction, created_at) VALUES
('seed-swipe-1', 'seed-card-2', 'seed-user-1', 'approve', datetime('now'));
