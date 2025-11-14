/*
# [Force Security Invoker on View]
This migration explicitly recreates the `total_revenue` view to use `SECURITY INVOKER`. This is a more forceful approach to resolve the persistent "Security Definer View" advisory, ensuring that Row-Level Security policies are correctly applied based on the querying user's permissions.

## Query Description: This operation safely replaces an existing view with an updated definition. It does not alter any data or table structures. The change is critical for security compliance.

## Metadata:
- Schema-Category: "Safe"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: false (The old state was insecure)

## Structure Details:
- Affects: `public.total_revenue` view.

## Security Implications:
- RLS Status: Will be correctly enforced on the view.
- Policy Changes: No.
- Auth Requirements: None.

## Performance Impact:
- Indexes: None.
- Triggers: None.
- Estimated Impact: Negligible.
*/

CREATE OR REPLACE VIEW public.total_revenue WITH (security_invoker = true) AS
 SELECT sum(silage_sales.total_amount) AS total_revenue
   FROM public.silage_sales;
