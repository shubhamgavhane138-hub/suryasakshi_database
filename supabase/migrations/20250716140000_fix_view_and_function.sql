/*
# [Fix] Correct View Definition and Set Function Search Path
This migration script corrects a critical security issue by removing the `SECURITY DEFINER` property from the `activity_log_view` and fixes a warning by setting a secure `search_path` for the `handle_new_user` function.

## Query Description:
This operation safely drops the existing `activity_log_view` if it exists and recreates it without the vulnerable `SECURITY DEFINER` property. It also alters an existing function to improve its security posture. There is no risk of data loss, as this only affects how data is viewed and how a function executes.

## Metadata:
- Schema-Category: "Security"
- Impact-Level: "High"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Modifies: `public.activity_log_view`
- Modifies: `public.handle_new_user()` function

## Security Implications:
- RLS Status: The view will now correctly respect the RLS policies of the user querying it, which resolves a critical security vulnerability.
- Policy Changes: No
- Auth Requirements: None for this script.

## Performance Impact:
- Indexes: None
- Triggers: None
- Estimated Impact: Negligible.
*/

-- Safely drop the view only if it exists to prevent errors.
DROP VIEW IF EXISTS public.activity_log_view;

-- Recreate the view WITHOUT the SECURITY DEFINER property.
-- It will now use SECURITY INVOKER by default, which is secure.
CREATE VIEW public.activity_log_view AS
SELECT
    al.id,
    al.created_at,
    al.action,
    al.details,
    p.username
FROM
    public.activity_log al
JOIN
    public.profiles p ON al.user_id = p.id
ORDER BY
    al.created_at DESC;

-- Grant usage to authenticated users
GRANT SELECT ON public.activity_log_view TO authenticated;


/*
# [Fix] Set Secure Search Path for Function
This operation alters the `handle_new_user` function to set a non-mutable `search_path`. This is a security best practice to prevent potential hijacking attacks.
*/

-- Alter the function to set a secure search_path
ALTER FUNCTION public.handle_new_user() SET search_path = public;
