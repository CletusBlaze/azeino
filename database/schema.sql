-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users (mirrors Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY,
  email         VARCHAR UNIQUE NOT NULL,
  display_name  VARCHAR,
  avatar_url    VARCHAR,
  plan          VARCHAR DEFAULT 'free' CHECK (plan IN ('free', 'plus', 'pro', 'business')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations
CREATE TABLE IF NOT EXISTS conversations (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title         VARCHAR DEFAULT 'New Chat',
  is_archived   BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role            VARCHAR NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content         TEXT NOT NULL,
  content_type    VARCHAR DEFAULT 'text' CHECK (content_type IN ('text', 'image', 'document', 'mixed')),
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Files
CREATE TABLE IF NOT EXISTS files (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message_id    UUID REFERENCES messages(id) ON DELETE SET NULL,
  file_name     VARCHAR NOT NULL,
  file_type     VARCHAR NOT NULL,
  file_size     INTEGER,
  storage_url   VARCHAR,
  file_base64   TEXT,
  purpose       VARCHAR DEFAULT 'upload' CHECK (purpose IN ('upload', 'generated', 'edited')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Images
CREATE TABLE IF NOT EXISTS images (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prompt        TEXT,
  storage_url   VARCHAR,
  image_data    TEXT,
  version       INTEGER DEFAULT 1,
  parent_id     UUID REFERENCES images(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- User Memory
CREATE TABLE IF NOT EXISTS user_memory (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  memory_type   VARCHAR DEFAULT 'fact' CHECK (memory_type IN ('preference', 'fact', 'context', 'project')),
  content       TEXT NOT NULL,
  source_message UUID REFERENCES messages(id) ON DELETE SET NULL,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Usage Logs
CREATE TABLE IF NOT EXISTS usage_logs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  capability    VARCHAR NOT NULL,
  provider      VARCHAR,
  tokens_used   INTEGER DEFAULT 0,
  cost_estimate DECIMAL(10, 6) DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_memory_user_id ON user_memory(user_id);
 http://localhost:3000/**