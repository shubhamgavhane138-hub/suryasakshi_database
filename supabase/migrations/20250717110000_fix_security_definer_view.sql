/*
# [Fix Security Definer Views]
This migration script addresses a critical security advisory by altering all views in the `public` schema that use `SECURITY DEFINER` to use `SECURITY INVOKER` instead.

## Query Description:
This operation iterates through all views in the `public` schema. For each view found to be using `SECURITY DEFINER`, it changes its security model to `SECURITY INVOKER`. This is a critical security enhancement. `SECURITY DEFINER` views execute with the permissions of the view's owner, which can unintentionally bypass Row-Level Security (RLS) policies. By switching to `SECURITY INVOKER`, the view will execute with the permissions of the user who is querying it, correctly enforcing all RLS policies. This change prevents potential unauthorized data access. No data will be lost or modified.

## Metadata:
- Schema-Category: "Security"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Affects: Views in the `public` schema using `SECURITY DEFINER`.
- Change: The security model of affected views will be changed to `SECURITY INVOKER`.

## Security Implications:
- RLS Status: This change strengthens RLS enforcement for any affected views.
- Policy Changes: No policies are changed, but their enforcement is made more robust.
- Auth Requirements: None.

## Performance Impact:
- Indexes: None.
- Triggers: None.
- Estimated Impact: Negligible performance impact. The primary impact is on security enforcement.
*/
DO $$
DECLARE
    view_record RECORD;
BEGIN
    FOR view_record IN
        SELECT
            c.relname AS view_name
        FROM
            pg_class c
        JOIN
            pg_namespace n ON n.oid = c.relnamespace
        WHERE
            c.relkind = 'v'
            AND n.nspname = 'public'
            AND c.reloptions IS NOT NULL
            AND array_to_string(c.reloptions, ',') LIKE '%security_definer=true%'
    LOOP
        RAISE NOTICE 'Fixing SECURITY DEFINER on view: public.%', view_record.view_name;
        EXECUTE format('ALTER VIEW public.%I SET (security_invoker = true);', view_record.view_name);
    END LOOP;
END $$;
