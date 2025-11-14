/*
# [Security Patch] Fix Security Definer and Function Search Path
This migration addresses two security advisories identified in the initial schema.

## Query Description:
1.  **activity_log_view**: The view is altered to use `SECURITY INVOKER` (the default and secure option) instead of `SECURITY DEFINER`. This ensures that Row-Level Security policies of the user querying the view are enforced, preventing potential data leaks.
2.  **create_user_profile()**: The function is updated to explicitly set the `search_path`. This prevents potential hijacking attacks where a malicious user could create objects in other schemas that the function might unintentionally use.

These changes are safe and do not affect existing data. They are crucial for securing the application before connecting it to live data.

## Metadata:
- Schema-Category: ["Security", "Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Altering VIEW: `public.activity_log_view`
- Altering FUNCTION: `public.create_user_profile()`

## Security Implications:
- RLS Status: Correctly enforces RLS on the `activity_log_view`.
- Policy Changes: No.
- Auth Requirements: None for this migration.

## Performance Impact:
- Indexes: None.
- Triggers: None.
- Estimated Impact: Negligible.
*/

-- Fix 1: Alter the view to use security_invoker (default)
ALTER VIEW public.activity_log_view SET (security_invoker = true);

-- Fix 2: Secure the function by setting the search_path
CREATE OR REPLACE FUNCTION public.create_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username');
  RETURN NEW;
END;
$$;
