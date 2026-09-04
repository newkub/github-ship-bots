ALTER TABLE evidence ADD COLUMN tags TEXT NOT NULL DEFAULT '[]';
CREATE INDEX IF NOT EXISTS idx_evidence_tags ON evidence(tags);
