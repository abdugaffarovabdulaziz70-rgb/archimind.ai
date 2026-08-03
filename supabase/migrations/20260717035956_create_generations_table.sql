/*
# Create generations table for ArchiMind AI

1. New Tables
- `generations`
  - `id` (uuid, primary key)
  - `user_id` (uuid, nullable — supports both anon and authenticated users)
  - `original_prompt` (text, not null) — the user's raw input
  - `enhanced_prompt` (text, not null) — AI-enhanced detailed prompt
  - `image_url` (text, not null) — URL of the generated image
  - `project_type` (text, default 'villa') — type of architectural project
  - `status` (text, default 'completed') — generation status
  - `is_favorite` (boolean, default false) — user can favorite generations
  - `is_public` (boolean, default false) — whether visible in public gallery
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on `generations`.
- Allow anon + authenticated CRUD (single-tenant style, data is intentionally shared for gallery).
- Users can favorite/update their own generations.
- Public gallery reads only is_public = true rows for anon.
*/

CREATE TABLE IF NOT EXISTS generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  original_prompt text NOT NULL,
  enhanced_prompt text NOT NULL,
  image_url text NOT NULL,
  project_type text NOT NULL DEFAULT 'villa',
  status text NOT NULL DEFAULT 'completed',
  is_favorite boolean NOT NULL DEFAULT false,
  is_public boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generations_is_public ON generations (is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON generations (user_id);

ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read public generations (gallery)
DROP POLICY IF EXISTS "anon_read_public_generations" ON generations;
CREATE POLICY "anon_read_public_generations" ON generations FOR SELECT
  TO anon, authenticated USING (is_public = true OR user_id = auth.uid());

-- Allow anyone to insert generations
DROP POLICY IF EXISTS "anon_insert_generations" ON generations;
CREATE POLICY "anon_insert_generations" ON generations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Allow users to update their own generations (favorites, etc.)
DROP POLICY IF EXISTS "user_update_own_generations" ON generations;
CREATE POLICY "user_update_own_generations" ON generations FOR UPDATE
  TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Allow anon to update any generation (for favorites on anon data)
DROP POLICY IF EXISTS "anon_update_generations" ON generations;
CREATE POLICY "anon_update_generations" ON generations FOR UPDATE
  TO anon USING (true) WITH CHECK (true);

-- Allow users to delete their own generations
DROP POLICY IF EXISTS "user_delete_own_generations" ON generations;
CREATE POLICY "user_delete_own_generations" ON generations FOR DELETE
  TO authenticated USING (user_id = auth.uid());

-- Allow anon to delete anon-created generations
DROP POLICY IF EXISTS "anon_delete_generations" ON generations;
CREATE POLICY "anon_delete_generations" ON generations FOR DELETE
  TO anon USING (true);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_generations_updated_at ON generations;
CREATE TRIGGER trigger_generations_updated_at
  BEFORE UPDATE ON generations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
