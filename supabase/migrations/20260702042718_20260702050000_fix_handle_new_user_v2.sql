-- Fix the handle_new_user trigger with better error handling
-- The previous version may have had issues with the order of operations

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Use a block to handle any errors gracefully
  BEGIN
    -- Insert into profiles
    INSERT INTO profiles (id, full_name, avatar_url)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO UPDATE SET
      full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', profiles.full_name),
      avatar_url = COALESCE(NEW.raw_user_meta_data->>'avatar_url', profiles.avatar_url),
      updated_at = now();
  EXCEPTION WHEN OTHERS THEN
    -- Log error but don't fail the transaction
    RAISE NOTICE 'Error inserting into profiles: %', SQLERRM;
  END;

  -- Insert into user_settings
  BEGIN
    INSERT INTO user_settings (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error inserting into user_settings: %', SQLERRM;
  END;

  RETURN NEW;
END;
$$;

-- Also ensure the profiles table has the correct foreign key setup
-- Drop any problematic constraints and recreate