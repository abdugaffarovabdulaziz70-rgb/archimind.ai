/*
# Create NovaAI database schema

This migration sets up the complete database structure for NovaAI, an AI assistant application.

## Tables Created

1. **profiles** - User profile information
   - `id` (uuid, primary key, references auth.users)
   - `full_name` (text, user's display name)
   - `avatar_url` (text, URL to user's avatar image)
   - `created_at`, `updated_at` (timestamps)

2. **chats** - Chat conversation threads
   - `id` (uuid, primary key)
   - `user_id` (uuid, foreign key to profiles, defaults to auth.uid())
   - `title` (text, chat title)
   - `created_at`, `updated_at` (timestamps)

3. **messages** - Individual messages within chats
   - `id` (uuid, primary key)
   - `chat_id` (uuid, foreign key to chats)
   - `role` (text, 'user' or 'assistant')
   - `content` (text, message content)
   - `created_at` (timestamp)

4. **user_settings** - User preferences
   - `id` (uuid, primary key)
   - `user_id` (uuid, foreign key to profiles)
   - `theme` (text, 'light', 'dark', or 'system')
   - `voice_enabled` (boolean, text-to-speech setting)
   - `language` (text, preferred language)
   - `created_at`, `updated_at` (timestamps)

## Security

- Row Level Security (RLS) enabled on all tables
- Owner-scoped policies for authenticated users
- Users can only access their own data
- CASCADE delete for referential integrity

## Notes

1. All user-owned tables use `DEFAULT auth.uid()` for user_id columns
2. Foreign keys use ON DELETE CASCADE to maintain data integrity
3. Indexes added for frequently queried columns
*/

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'New Chat',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_chats" ON chats;
CREATE POLICY "select_own_chats" ON chats FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_chats" ON chats;
CREATE POLICY "insert_own_chats" ON chats FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_chats" ON chats;
CREATE POLICY "update_own_chats" ON chats FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_chats" ON chats;
CREATE POLICY "delete_own_chats" ON chats FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_messages" ON messages;
CREATE POLICY "select_own_messages" ON messages FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM chats WHERE chats.id = messages.chat_id AND chats.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_messages" ON messages;
CREATE POLICY "insert_own_messages" ON messages FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM chats WHERE chats.id = messages.chat_id AND chats.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "delete_own_messages" ON messages;
CREATE POLICY "delete_own_messages" ON messages FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM chats WHERE chats.id = messages.chat_id AND chats.user_id = auth.uid())
  );

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  theme text NOT NULL DEFAULT 'dark' CHECK (theme IN ('light', 'dark', 'system')),
  voice_enabled boolean NOT NULL DEFAULT true,
  language text NOT NULL DEFAULT 'en',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_settings" ON user_settings;
CREATE POLICY "select_own_settings" ON user_settings FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_settings" ON user_settings;
CREATE POLICY "insert_own_settings" ON user_settings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_settings" ON user_settings;
CREATE POLICY "update_own_settings" ON user_settings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_created_at ON chats(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
