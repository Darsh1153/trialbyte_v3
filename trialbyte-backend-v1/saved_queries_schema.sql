-- Create saved_queries table
-- This table stores saved trial queries with title, description, and trial_id
-- Run this SQL to create the table in your database

CREATE TABLE IF NOT EXISTS saved_queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  trial_id UUID NOT NULL REFERENCES therapeutic_trial_overview(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  query_type TEXT DEFAULT 'trial' CHECK (query_type IN ('trial', 'drug', 'custom')),
  query_data JSONB,
  filters JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_saved_queries_user_id ON saved_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_queries_trial_id ON saved_queries(trial_id);
CREATE INDEX IF NOT EXISTS idx_saved_queries_created_at ON saved_queries(created_at);
CREATE INDEX IF NOT EXISTS idx_saved_queries_title ON saved_queries(title);

-- Comments for documentation
COMMENT ON TABLE saved_queries IS 'Stores saved trial queries for users';
COMMENT ON COLUMN saved_queries.id IS 'Primary key - UUID';
COMMENT ON COLUMN saved_queries.title IS 'User-defined title for the saved query';
COMMENT ON COLUMN saved_queries.description IS 'Optional description of the saved query';
COMMENT ON COLUMN saved_queries.trial_id IS 'Foreign key to therapeutic_trial_overview table';
COMMENT ON COLUMN saved_queries.user_id IS 'Foreign key to users table';
COMMENT ON COLUMN saved_queries.query_type IS 'Type of query: trial, drug, or custom';
COMMENT ON COLUMN saved_queries.query_data IS 'JSON data containing the query details';
COMMENT ON COLUMN saved_queries.filters IS 'JSON data containing filter criteria used in the query';
COMMENT ON COLUMN saved_queries.created_at IS 'Timestamp when the query was saved';
COMMENT ON COLUMN saved_queries.updated_at IS 'Timestamp when the query was last updated';
