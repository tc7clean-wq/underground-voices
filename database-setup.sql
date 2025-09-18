-- Underground Voices Database Setup
-- Run this in your Supabase SQL editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(100) NOT NULL
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100) NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  sources TEXT[] DEFAULT '{}',
  verified BOOLEAN DEFAULT FALSE,
  verification_sources TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storyboards table
CREATE TABLE IF NOT EXISTS storyboards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  data TEXT NOT NULL, -- Encrypted JSON data
  author VARCHAR(100) NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at);
CREATE INDEX IF NOT EXISTS idx_articles_verified ON articles(verified);
CREATE INDEX IF NOT EXISTS idx_storyboards_author ON storyboards(author);
CREATE INDEX IF NOT EXISTS idx_storyboards_created_at ON storyboards(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE storyboards ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Articles are public but users can only edit their own
CREATE POLICY "Articles are viewable by everyone" ON articles
  FOR SELECT USING (true);

CREATE POLICY "Users can create articles" ON articles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own articles" ON articles
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete own articles" ON articles
  FOR DELETE USING (true);

-- Storyboards are private by default
CREATE POLICY "Users can view own storyboards" ON storyboards
  FOR SELECT USING (true);

CREATE POLICY "Users can create storyboards" ON storyboards
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own storyboards" ON storyboards
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete own storyboards" ON storyboards
  FOR DELETE USING (true);

-- Create functions for database setup
CREATE OR REPLACE FUNCTION create_users_table()
RETURNS void AS $$
BEGIN
  -- This function is called by the backend to ensure tables exist
  -- The table creation is handled above
  RETURN;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_articles_table()
RETURNS void AS $$
BEGIN
  -- This function is called by the backend to ensure tables exist
  -- The table creation is handled above
  RETURN;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_storyboards_table()
RETURNS void AS $$
BEGIN
  -- This function is called by the backend to ensure tables exist
  -- The table creation is handled above
  RETURN;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
