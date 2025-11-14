/*
# [Fix Security Definer Views]
This migration script addresses a critical security advisory by altering all user-created views in the 'public' schema to use `SECURITY INVOKER` instead of the default `SECURITY DEFINER`.

## Query Description:
The script iterates through all views in the `public` schema and applies the `SECURITY INVOKER` property. This is a critical security enhancement. `SECURITY DEFINER` views run with the permissions of the user who created them, which can bypass Row-Level Security (RLS) policies. By changing to `SECURITY INVOKER`, views will correctly run with the permissions of the user who is querying them, ensuring RLS policies are always enforced as intended. This change is safe and has no impact on data.

## Metadata:
- Schema-Category: ["Security", "Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: false
- Reversible: true

## Structure Details:
- This script modifies the properties of existing views in the `public` schema.
- It does not add, remove, or alter any tables, columns, or data.

## Security Implications:
- RLS Status: This change strengthens RLS enforcement.
- Policy Changes: No. It ensures existing policies are correctly applied.
- Auth Requirements: None for the migration itself, but it ensures user auth is respected by views.

## Performance Impact:
- Indexes: None.
- Triggers: None.
- Estimated Impact: Negligible performance impact. The primary impact is on security enforcement.
*/
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT
            n.nspname as table_schema,
            c.relname as table_name
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relkind = 'v' -- it's a view
          AND n.nspname = 'public'
    LOOP
        EXECUTE format('ALTER VIEW %I.%I SET (security_invoker = true);', r.table_schema, r.table_name);
        RAISE NOTICE 'Patched security definer for view: %.%', r.table_schema, r.table_name;
    END LOOP;
END;
$$;
