-- Add project-related columns to chats table
ALTER TABLE chats ADD COLUMN IF NOT EXISTS project_type TEXT DEFAULT 'house';
ALTER TABLE chats ADD COLUMN IF NOT EXISTS style TEXT DEFAULT 'modern';
ALTER TABLE chats ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'completed', 'archived'));
ALTER TABLE chats ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE;
ALTER TABLE chats ADD COLUMN IF NOT EXISTS favorites_count INTEGER DEFAULT 0;

-- Create projects table for saved architectural projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  chat_id UUID REFERENCES chats(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  project_type TEXT DEFAULT 'house',
  style TEXT DEFAULT 'modern',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'completed', 'archived')),
  concept_data JSONB,
  is_public BOOLEAN DEFAULT FALSE,
  favorites_count INTEGER DEFAULT 0,
  downloads_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('project_created', 'project_updated', 'project_shared', 'comment', 'like', 'follow')),
  description TEXT,
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "select_own_projects" ON projects FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "insert_own_projects" ON projects FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_projects" ON projects FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete_own_projects" ON projects FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Public projects can be viewed by anyone
CREATE POLICY "select_public_projects" ON projects FOR SELECT
  TO anon, authenticated USING (is_public = TRUE);

-- Notifications policies
CREATE POLICY "select_own_notifications" ON notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "insert_own_notifications" ON notifications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_notifications" ON notifications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "delete_own_notifications" ON notifications FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Activities policies
CREATE POLICY "select_own_activities" ON activities FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "insert_own_activities" ON activities FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);

-- Add role to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'premium', 'admin'));

-- Trigger to create user settings on profile creation
CREATE OR REPLACE FUNCTION create_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_created ON profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION create_user_settings();