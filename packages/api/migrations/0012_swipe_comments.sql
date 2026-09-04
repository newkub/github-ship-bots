ALTER TABLE card_comments ADD COLUMN swipe_id TEXT;
CREATE INDEX IF NOT EXISTS idx_card_comments_swipe_id ON card_comments(swipe_id);
