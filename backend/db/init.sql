-- Create tables only if they don't exist (preserves data across restarts)

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(10),
  profile_image TEXT,
  phone VARCHAR(20),
  work TEXT,
  location VARCHAR(255),
  bio TEXT,
  social TEXT,
  age INTEGER,
  has_kids INTEGER DEFAULT 0,
  is_retired BOOLEAN DEFAULT false,
  marital_status VARCHAR(50),
  birthday VARCHAR(100),
  languages TEXT[] DEFAULT '{}',
  can_drive BOOLEAN DEFAULT true,
  dietary VARCHAR(255),
  spiritual_gifts TEXT[] DEFAULT '{}',
  current_groups TEXT[] DEFAULT '{}',
  desired_groups TEXT[] DEFAULT '{}',
  hobbies TEXT[] DEFAULT '{}',
  available TEXT[] DEFAULT '{}',
  need_help_with TEXT[] DEFAULT '{}',
  joined VARCHAR(10) DEFAULT '2026',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add need_help_with column if table already exists (safe migration)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'need_help_with') THEN
    ALTER TABLE users ADD COLUMN need_help_with TEXT[] DEFAULT '{}';
  END IF;
END $$;

-- Create connections table
CREATE TABLE IF NOT EXISTS connections (
  id SERIAL PRIMARY KEY,
  from_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  to_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  from_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  to_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  type VARCHAR(50),
  category VARCHAR(100),
  description TEXT,
  location VARCHAR(255),
  salary VARCHAR(100),
  urgent BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create prayer_requests table
CREATE TABLE IF NOT EXISTS prayer_requests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  anonymous BOOLEAN DEFAULT false,
  category VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  prayer_count INTEGER DEFAULT 0,
  answered BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create prayer_responses table
CREATE TABLE IF NOT EXISTS prayer_responses (
  id SERIAL PRIMARY KEY,
  prayer_request_id INTEGER REFERENCES prayer_requests(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create gallery_posts table
CREATE TABLE IF NOT EXISTS gallery_posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  caption TEXT,
  category VARCHAR(100),
  media_type VARCHAR(20) DEFAULT 'photo',
  media_url TEXT,
  color VARCHAR(20),
  emoji VARCHAR(20),
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create gallery_comments table
CREATE TABLE IF NOT EXISTS gallery_comments (
  id SERIAL PRIMARY KEY,
  gallery_post_id INTEGER REFERENCES gallery_posts(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create suggestions table
CREATE TABLE IF NOT EXISTS suggestions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create suggestion_comments table
CREATE TABLE IF NOT EXISTS suggestion_comments (
  id SERIAL PRIMARY KEY,
  suggestion_id INTEGER REFERENCES suggestions(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_messages_from_to ON messages(from_user_id, to_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_connections_from ON connections(from_user_id);
CREATE INDEX IF NOT EXISTS idx_connections_to ON connections(to_user_id);
CREATE INDEX IF NOT EXISTS idx_connections_status ON connections(status);
CREATE INDEX IF NOT EXISTS idx_jobs_user ON jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_user ON prayer_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_answered ON prayer_requests(answered);
CREATE INDEX IF NOT EXISTS idx_prayer_responses_request ON prayer_responses(prayer_request_id);
CREATE INDEX IF NOT EXISTS idx_gallery_posts_user ON gallery_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_gallery_comments_post ON gallery_comments(gallery_post_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_user ON suggestions(user_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_category ON suggestions(category);
CREATE INDEX IF NOT EXISTS idx_suggestion_comments_suggestion ON suggestion_comments(suggestion_id);
