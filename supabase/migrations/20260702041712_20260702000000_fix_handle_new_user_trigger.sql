-- Fix handle_new_user trigger function to be more robust
-- Uses ON CONFLICT to handle cases where records might already exist

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles, ignoring if already exists
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', profiles.full_name),
    avatar_url = COALESCE(NEW.raw_user_meta_data->>'avatar_url', profiles.avatar_url),
    updated_at = now();
  
  -- Insert into user_settings, ignoring if already exists
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add policy for deleting own profile (for cleanup)
DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- Also allow the trigger function to work without authentication restrictions
-- The SECURITY DEFINER runs as the function owner (postgres) so it can bypass RLS
-- This is necessary because the trigger fires during auth.users insert before the user is authenticated